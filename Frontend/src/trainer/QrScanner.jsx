import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import jsQR from "jsqr";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyAttendance,
  resetAttendanceState,
} from "../features/trainer/trainerAttendanceSlice";
import { fetchTrainerBookings, markAttendanceLocal } from "../features/trainer/trainerBookingSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QRScanner = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const { loading, message, success, error } = useSelector(
    (state) => state.trainerAttendance,
  );

  const [preview, setPreview] = useState(null);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 300, height: 300 },
        rememberLastUsedCamera: true,
      },
      false,
    );

    const onScanSuccess = async (decodedText) => {
      if (hasScannedRef.current) return;

      hasScannedRef.current = true;
      await processDecodedText(decodedText);

      setTimeout(() => {
        hasScannedRef.current = false;
      }, 2000);
    };

    scannerRef.current.render(onScanSuccess, () => {});

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetAttendanceState());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

 const processDecodedText = async (decodedText) => {
  try {
    const data = JSON.parse(decodedText);

    if (!data.token) {
      throw new Error("Invalid QR format");
    }

    const result = await dispatch(
      verifyAttendance({ token: data.token })
    );

    if (verifyAttendance.fulfilled.match(result)) {

      dispatch(markAttendanceLocal(result.payload.bookingId));

      dispatch(fetchTrainerBookings());

      toast.success(
        result.payload?.message ||
        "Attendance marked successfully"
      );

    } else {

      toast.error(
        result.payload ||
        "Verification failed"
      );

    }

  } catch (err) {

    toast.error(
      err.message || "Failed to read QR code"
    );

  }
};
  const decodeQRFromImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => {
        const imageSrc = reader.result;
        setPreview(imageSrc);
        img.src = imageSrc;
      };

      reader.onerror = () => reject(new Error("Failed to read image file"));

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (!code) {
          reject(new Error("No QR code found in selected image"));
          return;
        }

        resolve(code.data);
      };

      img.onerror = () => reject(new Error("Invalid image"));

      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProcessing(true);
      setLocalMessage("");

      const decodedText = await decodeQRFromImage(file);
      await processDecodedText(decodedText);
    } catch (err) {
      toast.error(err.message || "Unable to scan QR from image");
    } finally {
      setUploadProcessing(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setLocalMessage("");
    dispatch(resetAttendanceState());

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>

        <div id="reader" className="mb-6" />

        <div className="border-t pt-5">
          <h3 className="text-lg font-medium mb-3">Or scan from image</h3>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading || uploadProcessing}
            >
              Upload QR Image
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {preview && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected image:</p>
              <img
                src={preview}
                alt="QR preview"
                className="w-56 h-56 object-contain border rounded-lg bg-gray-50"
              />
            </div>
          )}

          {(loading || uploadProcessing) && (
            <p className="text-blue-600 text-sm">Processing QR...</p>
          )}

          {localMessage && (
            <p className="text-red-600 text-sm mt-2">{localMessage}</p>
          )}

          {message && success && (
            <p className="text-green-600 text-sm mt-2">{message}</p>
          )}

          {message && error && (
            <p className="text-red-600 text-sm mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;

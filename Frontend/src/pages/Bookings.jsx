import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  fetchRecommendedClasses,
  fetchSearchedClasses,
  resetStatus as resetClassesStatus,
} from "../features/classes/classSlice";
import { bookClass, fetchMyBookings } from "../features/bookings/bookingSlice";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import ClassCard from "../components/ClassCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { classes, recommendedClasses, searchedClasses, isLoading, isError, message } =
    useSelector((state) => state.classes);
  const { bookings } = useSelector((state) => state.bookings);
  const { membership } = useSelector((state) => state.membership);

  const [qrImage, setQrImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(fetchClasses());
    dispatch(fetchRecommendedClasses());
    dispatch(fetchMyBookings());
    dispatch(resetClassesStatus());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      dispatch(fetchSearchedClasses(searchTerm.trim()));
    }
  }, [searchTerm, dispatch]);

  const handleBooking = async (cls) => {
  if (membership?.status !== "Active") {
    toast.warning("You need an active membership to book a class!");
    navigate("/plans");
    return;
  }

  try {
    const res = await dispatch(bookClass(cls._id)).unwrap();

    dispatch(fetchMyBookings());
    dispatch(fetchClasses());
    dispatch(fetchRecommendedClasses());

    if (res.booking?.qrImage) {
      setQrImage(res.booking.qrImage);
    }

    toast.success(res.message || "Class booked successfully");
  } catch (err) {
    toast.error(err || "Booking failed");
  }
};
  const bookedClassIds = bookings
    .filter((b) => b.status === "Scheduled")
    .map((b) => b.class?._id);

  const cancelledClassIds = bookings
    .filter((b) => b.status === "Cancelled")
    .map((b) => b.class?._id);

  const filterClasses = (classList) => {
    return classList.filter((cls) => {
      if (!cls || !cls.startTime) return false;

      const search = searchTerm.toLowerCase().trim();
      const nameMatch = cls.name?.toLowerCase().includes(search);
      const trainerMatch = cls.trainer?.name?.toLowerCase().includes(search);
      const dateMatch = new Date(cls.startTime)
        .toLocaleDateString()
        .toLowerCase()
        .includes(search);

      if (cls.hasEnded && !cls.adminReopen) return false;
      if (!search) return true;

      return nameMatch || trainerMatch || dateMatch;
    });
  };

  const displayedClasses = searchTerm.trim().length > 2 && searchedClasses.length > 0
    ? searchedClasses
    : filterClasses(classes);
  const displayedRecommendedClasses = filterClasses(recommendedClasses);

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Available <br /> <span className="text-orange-500">Sessions</span>
            </h1>
            <p className="text-gray-400 mt-4 font-medium uppercase tracking-widest text-sm">
              Level up your training today
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Find a class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {isError && (
        <p className="text-red-500 text-center font-bold mb-6">{message}</p>
      )}

      {displayedRecommendedClasses.length > 0 && (
        <div className="max-w-7xl mx-auto mb-16">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
              Recommended <span className="text-orange-500">For You</span>
            </h2>
            <p className="text-gray-400 mt-2 font-medium uppercase tracking-widest text-sm">
              Based on your booking history and popular sessions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedRecommendedClasses.map((cls) => (
              <ClassCard
                key={cls._id}
                cls={cls}
                handleBooking={handleBooking}
                bookedClassIds={bookedClassIds}
                cancelledClassIds={cancelledClassIds}
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {displayedClasses.map((cls) => (
          <ClassCard
            key={cls._id}
            cls={cls}
            handleBooking={handleBooking}
            bookedClassIds={bookedClassIds}
            cancelledClassIds={cancelledClassIds}
          />
        ))}
      </div>

      {displayedClasses.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold uppercase tracking-widest">
            No classes found matching your search.
          </p>
        </div>
      )}

      {qrImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl text-center">
            <h2 className="text-xl font-black uppercase mb-4">
              Your Booking QR
            </h2>

            <img src={qrImage} alt="QR Code" className="w-64 h-64 mx-auto" />

            <a
              href={qrImage}
              download="gym-qr.png"
              className="block mt-4 bg-black text-white px-6 py-3 rounded-xl font-bold uppercase"
            >
              Download QR
            </a>

            <button
              onClick={() => setQrImage(null)}
              className="mt-3 text-sm text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
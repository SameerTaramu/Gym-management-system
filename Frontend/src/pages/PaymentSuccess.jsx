import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembership } from "../features/users/userMembershipSlice";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { membership, isLoading } = useSelector(
    (state) => state.membership
  );

  useEffect(() => {
    dispatch(fetchMembership());
  }, [dispatch]);

  useEffect(() => {
    if (membership?.status === "Active") {
      const timer = setTimeout(() => {
        navigate("/plans"); 
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [membership, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        {isLoading ? (
          <h2 className="text-2xl font-semibold">
            Verifying payment…
          </h2>
        ) : membership?.status === "Active" ? (
          <>
            <h2 className="text-3xl font-bold text-green-500">
              Payment Successful 🎉
            </h2>
            <p className="mt-4 text-gray-400">
              Your membership is now active.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting…
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-yellow-400">
              Payment Pending
            </h2>
            <p className="mt-4 text-gray-400">
              Please wait a moment or check your membership status.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-500">
          Payment Failed
        </h2>
        <p className="mt-4 text-gray-400">
          Your payment was cancelled or failed.
        </p>
        <button
          onClick={() => navigate("/plans")}
          className="mt-6 px-6 py-3 bg-orange-500 text-black rounded-lg"
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;

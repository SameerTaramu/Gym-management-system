import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchAvailableTrainers,
  fetchMyHiredTrainers,
  hireTrainer,
  cancelTrainerHire,
  resetTrainerHireStatus,
} from "../features/trainerHire/trainerHireSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrainerHire = () => {
  const dispatch = useDispatch();

  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [selectedPeriods, setSelectedPeriods] = useState({});

  const {
    trainers = [],
    myHires = [],
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.trainerHire);

  const getConfig = () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    dispatch(fetchAvailableTrainers());
    dispatch(fetchMyHiredTrainers());
    fetchMembership();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
    if (isSuccess && message) toast.success(message);

    if (isError || isSuccess) {
      const timer = setTimeout(
        () => dispatch(resetTrainerHireStatus()),
        2500
      );
      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, message, dispatch]);

  const fetchMembership = async () => {
    try {
      setMembershipLoading(true);
      const res = await axios.get(
        "http://localhost:5005/api/membership",
        getConfig()
      );
      setMembership(res.data.membership || null);
    } catch (error) {
      console.error("Fetch membership error:", error);
      setMembership(null);
    } finally {
      setMembershipLoading(false);
    }
  };

  const canHireTrainer =
    membership?.status === "Active" &&
    membership?.plan?.canHireTrainer === true;

  const activeHires = myHires.filter((hire) => hire.status === "Active");
  const activeHireTrainerIds = activeHires.map((hire) => hire.trainer?._id);
  const hasActiveTrainer = activeHires.length > 0;

  const handlePeriodChange = (trainerId, value) => {
    setSelectedPeriods((prev) => ({
      ...prev,
      [trainerId]: value,
    }));
  };

  const handleHire = (trainerId) => {
    const periodType = selectedPeriods[trainerId] || "weekly";
    dispatch(hireTrainer({ trainerId, periodType }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pt-28">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Hire Personal Trainer
        </h1>
        <p className="text-gray-500 mt-1">
          Choose a trainer and select a weekly or monthly plan.
        </p>
      </div>

      {!membershipLoading && !canHireTrainer && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-5 mb-8">
          Your current membership does not include personal trainer hiring.
        </div>
      )}

      {hasActiveTrainer && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-5 mb-8">
          You already have an active personal trainer. Cancel your current trainer
          before hiring another.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {trainers.map((trainer) => {
          const alreadyHired = activeHireTrainerIds.includes(trainer._id);

          return (
            <div
              key={trainer._id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    trainer.image
                      ? `http://localhost:5005${trainer.image}`
                      : "https://via.placeholder.com/80x80?text=Trainer"
                  }
                  alt={trainer.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {trainer.name}
                  </h3>
                  <p className="text-sm text-gray-500">{trainer.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Select Period
                </label>
                <select
                  value={selectedPeriods[trainer._id] || "weekly"}
                  onChange={(e) =>
                    handlePeriodChange(trainer._id, e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={
                    membershipLoading ||
                    !canHireTrainer ||
                    hasActiveTrainer ||
                    alreadyHired ||
                    isLoading
                  }
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <button
                disabled={
                  membershipLoading ||
                  !canHireTrainer ||
                  hasActiveTrainer ||
                  alreadyHired ||
                  isLoading
                }
                onClick={() => handleHire(trainer._id)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  membershipLoading ||
                  !canHireTrainer ||
                  hasActiveTrainer ||
                  alreadyHired
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {alreadyHired
                  ? "Already Hired"
                  : hasActiveTrainer
                  ? "Cancel Current Trainer First"
                  : "Hire Trainer"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            My Hired Trainers
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {myHires.length === 0 ? (
            <div className="p-6 text-gray-500">No trainer hires yet.</div>
          ) : (
            myHires.map((hire) => (
              <div
                key={hire._id}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-gray-900">
                    {hire.trainer?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {hire.trainer?.email}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                      {hire.periodType}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border bg-gray-100 text-gray-600 border-gray-200">
                      {hire.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {hire.startDate
                      ? `From ${new Date(hire.startDate).toLocaleDateString()}`
                      : ""}
                    {hire.endDate
                      ? ` to ${new Date(hire.endDate).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>

                {hire.status === "Active" && (
                  <button
                    onClick={() => dispatch(cancelTrainerHire(hire._id))}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerHire;
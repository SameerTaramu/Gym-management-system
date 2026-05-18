import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrainerClients,
  resetTrainerClientStatus,
} from "../features/trainer/trainerClientSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrainerClients = () => {
  const dispatch = useDispatch();
  const { clients = [], isLoading, isError, message } = useSelector(
    (state) => state.trainerClients
  );

  useEffect(() => {
    dispatch(fetchTrainerClients());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      const timer = setTimeout(
        () => dispatch(resetTrainerClientStatus()),
        2500
      );
      return () => clearTimeout(timer);
    }
  }, [isError, message, dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Hired Clients
        </h1>
        <p className="text-gray-500 mt-1">
          View users who have hired you as their personal trainer.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Client List</h2>
        </div>

        <div className="divide-y divide-gray-50">
          {isLoading ? (
            <div className="p-6 text-gray-500">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="p-6 text-gray-500">No clients found.</div>
          ) : (
            clients.map((hire) => (
              <div
                key={hire._id}
                className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {hire.user?.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500 break-all">
                        {hire.user?.email || "No email"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                          hire.status === "Active"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : hire.status === "Cancelled"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {hire.status}
                      </span>

                      {hire.periodType && (
                        <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                          {hire.periodType}
                        </span>
                      )}

                      {hire.user?.membership?.status && (
                        <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border bg-blue-50 text-blue-600 border-blue-100">
                          Membership: {hire.user.membership.status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400">
                      {hire.startDate
                        ? `From ${new Date(hire.startDate).toLocaleDateString()}`
                        : ""}
                      {hire.endDate
                        ? ` to ${new Date(hire.endDate).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="lg:text-right shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Hired On
                  </p>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    {hire.hiredAt
                      ? new Date(hire.hiredAt).toLocaleDateString()
                      : new Date(hire.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerClients;
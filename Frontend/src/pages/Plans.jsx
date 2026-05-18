import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans, choosePlan } from "../features/plans/planSlice";
import {
  buyMembershipCash,
  cancelMembership,
  fetchMembership,
  resetStatus,
  renewMembership,
} from "../features/users/userMembershipSlice";
import { submitEsewaForm } from "../utils/submitEsewaForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check, ShieldCheck, Zap, CreditCard, Wallet } from "lucide-react";

const getExpiryCountdown = (membership) => {
  if (!membership || !membership.endDate) return null;
  const now = new Date();
  const end = new Date(membership.endDate);
  if (end <= now) return { type: "expired", text: "Membership expired" };
  if (membership.status !== "Active") return null;
  const diffMs = end - now;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { type: "active", text: `Expires in ${days}d ${hours}h` };
};

const Plans = () => {
  const dispatch = useDispatch();
  const { plans, selectedPlan, isLoading } = useSelector(
    (state) => state.plans,
  );
  const {
    membership,
    isLoading: memLoading,
    isError: memError,
    message: memMessage,
  } = useSelector((state) => state.membership);
  const hasActiveMembership =
    membership?.status === "Active" || membership?.status === "Pending";
  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchMembership());
    dispatch(resetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (memError && memMessage) {
      toast.error(memMessage);
      dispatch(resetStatus());
    }
  }, [memError, memMessage, dispatch]);

  const handleChoosePlan = (plan) => dispatch(choosePlan(plan));

  const handleBuyCash = async (planId) => {
    console.log("Cash button clicked", planId);

    try {
      await dispatch(buyMembershipCash(planId)).unwrap();
      toast.success("Membership purchased (Pending approval)");
      dispatch(fetchMembership());
    } catch (err) {
      toast.error(err);
    }
  };
  const handleEsewaPay = async (planId) => {
    try {
      console.log("Clicked eSewa button");

      const res = await axios.post(
        "http://localhost:5005/api/membership/esewa",
        { planId },
        { withCredentials: true },
      );

      console.log("Payload from backend:", res.data);

      submitEsewaForm(res.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to initiate eSewa payment",
      );
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelMembership()).unwrap();
      toast.info("Pending membership cancelled");
      dispatch(fetchMembership());
    } catch (err) {
      toast.error(err);
    }
  };
  const handleKhaltiPay = async (planId) => {
    try {
      const res = await axios.post(
        "http://localhost:5005/api/membership/khalti",
        { planId },
        { withCredentials: true },
      );

      window.location.href = res.data.payment_url;
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to initiate Khalti payment",
      );
    }
  };

  const safePlans = Array.isArray(plans) ? plans : [];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-black uppercase tracking-widest text-gray-400">
        Loading Plans...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="max-w-7xl mx-auto mb-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
          Choose Your <br /> <span className="text-orange-500">Tier</span>
        </h1>
        <p className="text-gray-400 font-medium uppercase tracking-[0.3em] text-xs">
          Commit to your potential. No hidden fees.
        </p>
      </div>

      {safePlans.length === 0 ? (
        <p className="text-center text-gray-400 font-bold uppercase tracking-widest">
          No plans available.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto items-start">
          {safePlans.map((plan, index) => {
            const isUserPlan =
              membership?.plan && membership.plan._id === plan._id;
            const lockOtherPlans =
              membership &&
              membership.plan &&
              membership.plan._id !== plan._id &&
              ["Active", "Pending"].includes(membership.status);
            const isSelected = selectedPlan?._id === plan._id;
            const isPopular = index === 1;
            const countdown = isUserPlan
              ? getExpiryCountdown(membership)
              : null;

            return (
              <div
                key={plan._id}
                className={`relative rounded-[3rem] p-10 flex flex-col transition-all duration-500 border-2 ${
                  lockOtherPlans
                    ? "opacity-40 pointer-events-none grayscale"
                    : ""
                } ${
                  isSelected
                    ? "border-orange-500 bg-white shadow-2xl scale-[1.02] z-10"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black tracking-[0.2em] px-6 py-2 rounded-full uppercase">
                    Most Popular
                  </div>
                )}

                <div className="mb-10">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black">Rs {plan.price}</span>
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                      / {plan.duration}
                    </span>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <Check size={18} className="text-green-500" /> FULL EQUIPMENT
                      ACCESS
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <Check size={18} className="text-green-500" /> ALL CLASS
                      BOOKINGS
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <Zap size={18} className="text-orange-500" /> LOCKER ROOM
                      ACCESS
                    </li>
                  </ul>
                </div>

                {countdown && (
                  <div
                    className={`mb-6 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] ${
                      countdown.type === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {countdown.text}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    disabled={lockOtherPlans}
                    onClick={() => handleChoosePlan(plan)}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                      lockOtherPlans
                        ? "bg-gray-200 text-gray-400"
                        : isSelected
                          ? "bg-green-500 text-white shadow-lg shadow-green-100"
                          : "bg-black text-white hover:bg-orange-500 shadow-xl"
                    }`}
                  >
                    {lockOtherPlans
                      ? "Plan Locked"
                      : isSelected
                        ? "Selected"
                        : "Select Plan"}
                  </button>

                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                    {isUserPlan && membership?.status === "Active" ? (
                      <div className="flex items-center justify-center gap-2 py-4 text-green-600 font-black text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={16} /> Subscription Active
                      </div>
                    ) : isUserPlan && membership?.status === "Pending" ? (
                      <button
                        onClick={handleCancel}
                        disabled={memLoading}
                        className="w-full py-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        Cancel Pending Request
                      </button>
                    ) : isUserPlan && membership?.status === "Expired" ? (
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await dispatch(renewMembership()).unwrap();
                              toast.success("Renewal requested (Cash)");
                              dispatch(fetchMembership());
                            } catch (err) {
                              toast.error(err);
                            }
                          }}
                          disabled={memLoading}
                          className="py-4 rounded-2xl bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-orange-500"
                        >
                          Renew Cash
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await axios.post(
                                "http://localhost:5005/api/membership/khalti/renew",
                                {},
                                { withCredentials: true },
                              );

                              window.location.href = res.data.payment_url;
                            } catch (err) {
                              toast.error(
                                err?.response?.data?.message ||
                                  "Failed to renew with Khalti",
                              );
                            }
                          }}
                          disabled={memLoading}
                          className="py-4 rounded-2xl bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                        >
                          Renew Khalti
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await axios.post(
                                "http://localhost:5005/api/membership/esewa/renew",
                                {},
                                { withCredentials: true },
                              );

                              console.log("Renew payload:", res.data);

                              submitEsewaForm(res.data);
                            } catch (err) {
                              toast.error(
                                err?.response?.data?.message ||
                                  "Failed to renew membership",
                              );
                            }
                          }}
                          disabled={memLoading}
                          className="py-4 rounded-2xl bg-[#60bb46] text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                        >
                          Renew eSewa
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleBuyCash(plan._id)}
                          disabled={memLoading || hasActiveMembership}
                          className="flex items-center justify-center gap-1 py-4 rounded-2xl bg-gray-100 text-black text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                        >
                          <Wallet size={12} /> Cash
                        </button>
                        <button
                          onClick={() => {
                            handleEsewaPay(plan._id);
                          }}
                          disabled={memLoading || hasActiveMembership}
                          className="flex items-center justify-center gap-1 py-4 rounded-2xl bg-[#60bb46] text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                        >
                          <CreditCard size={12} /> eSewa
                        </button>
                        <button
                          onClick={() => handleKhaltiPay(plan._id)}
                          disabled={memLoading || hasActiveMembership}
                          className="flex items-center justify-center gap-1 py-4 rounded-2xl bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                        >
                          <CreditCard size={12} /> Khalti
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Plans;

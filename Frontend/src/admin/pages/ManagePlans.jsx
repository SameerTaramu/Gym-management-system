import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlans,
  createPlan,
  deletePlan,
  resetStatus,
} from "../../features/admin/adminPlanSlice";
import { toast, ToastContainer } from "react-toastify";
import { Tag, Clock, Banknote, Trash2, Plus, LayoutGrid } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ManagePlans = () => {
  const dispatch = useDispatch();
  const { plans, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.plans
  );

  const [form, setForm] = useState({
    name: "",
    duration: "monthly",
    price: "",
    canHireTrainer: false,
  });

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
    if (isSuccess && message) toast.success("Plan saved successfully");

    if (isSuccess || isError) {
      const timer = setTimeout(() => dispatch(resetStatus()), 2500);
      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Plan name is required";
    if (!form.price) return "Price is required";

    const price = Number(form.price);
    if (isNaN(price) || price <= 0) {
      return "Price must be a valid positive number";
    }

    if (!form.duration) return "Duration is required";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setCreating(true);

    const result = await dispatch(
      createPlan({
        name: form.name.trim(),
        duration: form.duration,
        price: Number(form.price),
        canHireTrainer: form.canHireTrainer,
      })
    );

    setCreating(false);

    if (result.meta.requestStatus === "fulfilled") {
      setForm({
        name: "",
        duration: "monthly",
        price: "",
        canHireTrainer: false,
      });
      dispatch(fetchPlans());
    }
  };

  const confirmDelete = (planId, planName) => {
    toast.info(
      <div className="flex flex-col gap-2">
        <span className="text-sm">
          Delete plan <b>{planName}</b>?
        </span>
        <div className="flex justify-end gap-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
            onClick={() => {
              handleDelete(planId);
              toast.dismiss();
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const result = await dispatch(deletePlan(id));
    setDeletingId(null);

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchPlans());
    }
  };

  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Membership Plans
          </h1>
          <p className="text-gray-500 mt-1">
            Configure pricing tiers and subscription durations.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Add New Plan</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Plan Name
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Pro Membership"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Duration
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Price (Rs.)
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  min="1"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="5000"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold py-3 shadow-lg shadow-indigo-100 transition-all self-end active:scale-[0.98]"
            >
              {creating ? "Saving..." : "Create Plan"}
            </button>

            <div className="md:col-span-4">
              <label className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="canHireTrainer"
                  checked={form.canHireTrainer}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  Allow trainer hiring for this plan
                </span>
              </label>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Available Tiers</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Plan Name</th>
                  <th className="px-6 py-4">Billing Cycle</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Trainer Hiring</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading && !creating ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      Fetching pricing data...
                    </td>
                  </tr>
                ) : safePlans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No active plans found.
                    </td>
                  </tr>
                ) : (
                  safePlans.map((plan) => (
                    <tr
                      key={plan._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {plan.name}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            plan.duration === "yearly"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : plan.duration === "quarterly"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          }`}
                        >
                          {plan.duration}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-700">
                        Rs. {plan.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            plan.canHireTrainer
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                        >
                          {plan.canHireTrainer ? "Allowed" : "Not Allowed"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => confirmDelete(plan._id, plan.name)}
                          disabled={deletingId === plan._id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex disabled:opacity-30"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePlans;
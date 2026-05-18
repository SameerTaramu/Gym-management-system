import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveMemberships,
  deactivateMembership,
  resetStatus,
} from "../../features/admin/activeMembershipSlice";
import AdminLayout from "../components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import { Users, Search, Ban, CheckCircle, ShieldCheck, Mail } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ManageMembership = () => {
  const dispatch = useDispatch();
  const { memberships, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.activeMemberships
  );
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchActiveMemberships());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Something went wrong!");
      dispatch(resetStatus());
    }
    if (isSuccess) {
      toast.success(message || "Action successful!");
      dispatch(resetStatus());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleDeactivate = (userId) => {
    if (window.confirm("Are you sure you want to deactivate this membership?")) {
      dispatch(deactivateMembership(userId));
    }
  };

  const filteredMemberships = memberships.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-8 h-8" />
              Active Memberships
            </h1>
            <p className="text-gray-500 mt-1">Review and manage users with current subscriptions.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 font-medium">Loading memberships...</p>
            </div>
          ) : filteredMemberships.length === 0 ? (
            <div className="p-20 text-center">
              <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No active memberships found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="px-6 py-5">User Profile</th>
                    <th className="px-6 py-5">Subscription Plan</th>
                    <th className="px-6 py-5">Billing</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMemberships
                    .filter(user => user?.membership)
                    .map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-700">{user.membership?.plan?.name || "N/A"}</p>
                          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">{user.membership?.plan?.duration || "N/A"}</p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-600">
                            {user.membership?.plan?.price ? `Rs. ${user.membership.plan.price.toLocaleString()}` : "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {user.membership?.status === "Active" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase bg-green-50 text-green-600 rounded-full border border-green-100">
                              <CheckCircle className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase bg-red-50 text-red-600 rounded-full border border-red-100">
                              <Ban className="w-3 h-3" /> Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {user.membership?.status === "Active" && (
                            <button
                              onClick={() => handleDeactivate(user._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMembership;
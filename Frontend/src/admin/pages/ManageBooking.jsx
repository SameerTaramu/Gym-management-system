import AdminLayout from "../components/AdminLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, deleteBooking, resetStatus } from "../../features/admin/adminBookingSlice";
import { toast, ToastContainer } from "react-toastify";
import { Ticket, User, Calendar, Trash2, Clock, MapPin } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ManageBooking = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.adminBookings
  );

  useEffect(() => {
    dispatch(fetchBookings());
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(id));
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Ticket className="text-indigo-600 w-8 h-8" />
            Manage Bookings
          </h1>
          <p className="text-gray-500 mt-1">Monitor class attendance and reservation history.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 font-medium">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-20 text-center text-gray-400 italic">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="px-6 py-5">User / Member</th>
                    <th className="px-6 py-5">Class & Trainer</th>
                    <th className="px-6 py-5">Schedule</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b) => {
                    const cls = b.class && typeof b.class === "object" ? b.class : {};
                    const trainer = cls.trainer && typeof cls.trainer === "object" ? cls.trainer : {};
                    const user = b.user && typeof b.user === "object" ? b.user : {};

                    return (
                      <tr key={b._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-bold">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-900">{user.name || "N/A"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-800">{cls.name || "N/A"}</p>
                          <p className="text-xs text-indigo-500 font-medium italic">with {trainer.name || "N/A"}</p>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {cls.schedule?.date ? (
                            <div className="flex flex-col">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {new Date(cls.schedule.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                {cls.schedule.time}
                              </span>
                            </div>
                          ) : (
                            "Not available"
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                            b.status === 'Confirmed' || b.status === 'Active' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-gray-50 text-gray-500 border-gray-100'
                          }`}>
                            {b.status || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex group-hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageBooking;
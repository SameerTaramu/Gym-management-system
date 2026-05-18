import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../components/AdminLayout";
import {
  fetchPendingMemberships,
  approveMembership,
  rejectMembership,
  resetAdminStatus,
} from "../../features/admin/adminMembershipSlice";

const AdminPendingMemberships = () => {
  const dispatch = useDispatch();
  const { pending, isLoading, isError, message } = useSelector(
    (state) => state.adminMembership
  );

  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingMemberships());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(resetAdminStatus());
    }
  }, [isError, message, dispatch]);

  const handleApprove = async (userId) => {
    setProcessingId(userId);
    try {
      await dispatch(approveMembership(userId)).unwrap();
      toast.success("Payment approved. Membership activated.");
      dispatch(fetchPendingMemberships()); 

    } catch (err) {
      toast.error(err || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this payment?")) return;

    setProcessingId(userId);
    try {
      await dispatch(rejectMembership(userId)).unwrap();
      toast.info("Payment rejected");
      dispatch(fetchPendingMemberships()); 

    } catch (err) {
      toast.error(err || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto p-4 ">
        <h1 className="text-3xl font-bold mb-6">Pending Payments</h1>

        {isLoading && <p className="text-gray-500">Loading...</p>}

        {!isLoading && pending.length === 0 && (
          <p className="text-gray-500">No pending payments</p>
        )}

        {pending.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">User</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Plan</th>
                  <th className="p-2">Payment</th>
                  <th className="p-2">Purchased At</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.membership.plan?.name}</td>
                    <td className="p-2">{u.membership.paymentMethod}</td>
                    <td className="p-2">
                      {new Date(u.membership.purchasedAt).toLocaleString()}
                    </td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        disabled={processingId === u._id || isLoading}
                        onClick={() => handleApprove(u._id)}
                        className="bg-green-500 text-white px-4 py-1 rounded"
                      >
                        {processingId === u._id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        disabled={processingId === u._id || isLoading}
                        onClick={() => handleReject(u._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        {processingId === u._id ? "Processing..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPendingMemberships;

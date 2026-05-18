import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../features/admin/adminUserSlice";
import { toast, ToastContainer } from "react-toastify";
import { Search, Trash2, Users as UsersIcon, Filter } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../components/AdminLayout";

const Users = () => {
  const dispatch = useDispatch();
  const { users = [], isLoading} = useSelector((state) => state.users || {});

  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        toast.success("User deleted successfully");
        dispatch(fetchUsers());
      })
      .catch((err) => toast.error(err || "Failed to delete user"))
      .finally(() => setDeletingId(null));
  };

  const confirmDelete = (userId, userName) => {
    toast.info(
      <div className="p-1">
        <p className="mb-3 font-medium">Delete user <b>{userName}</b>?</p>
        <div className="flex gap-2">
          <button onClick={() => { handleDelete(userId); toast.dismiss(); }} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition-hover hover:bg-red-700">Confirm</button>
          <button onClick={() => toast.dismiss()} className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage, filter and monitor your platform users.</p>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <UsersIcon className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select 
              className="bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="trainer">Trainers</option>
              <option value="user">Members</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">Loading platform data...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400">No users match your criteria.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize 
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'trainer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => confirmDelete(user._id, user.name)}
                        disabled={deletingId === user._id}
                        className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === user._id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../admin/components/AdminLayout";
import { Search, Filter, ShieldCheck, ShieldAlert, Mail, UserPlus, MoreVertical, Activity } from "lucide-react";
import {
  fetchTrainers,
  toggleTrainerStatus,
} from "../../features/admin/adminTrainerSlice";

const TrainerList = () => {
  const dispatch = useDispatch();
  const { trainers = [], isLoading } = useSelector((state) => state.trainers);

  const [actionId, setActionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
                            (statusFilter === "active" ? t.isActive : !t.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [trainers, searchTerm, statusFilter]);

  const handleToggle = async (id) => {
    setActionId(id);
    await dispatch(toggleTrainerStatus(id));
    setActionId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trainer Management</h1>
            <p className="text-gray-500 mt-1">Monitor and control access for your professional training staff.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active</p>
                <p className="text-xl font-bold text-gray-900">{trainers.filter(t => t.isActive).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select 
              className="bg-gray-50 border border-gray-100 text-gray-700 py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Trainer Profile</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">Fetching trainers...</td></tr>
              ) : filteredTrainers.length === 0 ? (
                <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No trainers matching that search.</td></tr>
              ) : (
                filteredTrainers.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {t.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{t.name}</span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {t.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          t.isActive 
                            ? "bg-green-50 text-green-600 border-green-100" 
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                          <Activity className="w-3 h-3" />
                          {t.isActive ? "Live" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={actionId === t._id}
                          onClick={() => handleToggle(t._id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            t.isActive 
                              ? "bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100" 
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                          } disabled:opacity-50`}
                        >
                          {actionId === t._id ? "..." : t.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
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

export default TrainerList;
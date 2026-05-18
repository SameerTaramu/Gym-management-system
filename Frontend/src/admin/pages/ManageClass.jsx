import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
  reopenClass,
  resetClassStatus,
} from "../../features/admin/adminClassSlice";
import { toast, ToastContainer } from "react-toastify";
import {
  Calendar,
  Clock,
  Users,
  Edit3,
  Trash2,
  RotateCcw,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ManageClass = () => {
  const dispatch = useDispatch();
  const {
    classes = [],
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.adminClasses);

  const [form, setForm] = useState({
    name: "",
    description: "",
    trainerName: "",
    date: "",
    time: "",
    durationMinutes: "",
    slots: "",
    image: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [reopenId, setReopenId] = useState(null);
  const [reopenForm, setReopenForm] = useState({
    startTime: "",
    durationMinutes: "",
    slots: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
    if (isSuccess && message) toast.success(message);

    if (isError || isSuccess) {
      const timer = setTimeout(() => dispatch(resetClassStatus()), 2500);
      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((p) => ({ ...p, image: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      trainerName: "",
      date: "",
      time: "",
      durationMinutes: "",
      slots: "",
      image: null,
    });
    setPreview(null);
    setEditingId(null);
  };
  const validateForm = () => {
    if (!form.name.trim()) return "Class name is required";
    if (!form.trainerName.trim()) return "Trainer name is required";
    if (!form.date) return "Date is required";
    if (!form.time) return "Time is required";
    if (!form.durationMinutes || Number(form.durationMinutes) <= 0)
      return "Valid duration is required";
    if (!form.slots || Number(form.slots) <= 0)
      return "Valid slots are required";

    const startTime = new Date(`${form.date}T${form.time}`);
    if (startTime < new Date()) return "Class time must be in the future";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setSaving(true);
    const startTime = new Date(`${form.date}T${form.time}`);
    const payload = {
      name: form.name.trim(),
      description: form.description,
      trainerName: form.trainerName.trim(),
      startTime,
      durationMinutes: Number(form.durationMinutes),
      slots: Number(form.slots),
      image: form.image,
    };
    const res = editingId
      ? await dispatch(updateClass({ id: editingId, updates: payload }))
      : await dispatch(createClass(payload));
    setSaving(false);
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(fetchClasses());
      resetForm();
      toast.success(editingId ? "Class updated successfully" : "Class created successfully");
    } else {
      toast.error(res.payload || "Failed to save class");
    }
  };

  const handleEdit = (cls) => {
    const start = new Date(cls.startTime);
    setEditingId(cls._id);
    setForm({
      name: cls.name,
      description: cls.description || "",
      trainerName: cls.trainer?.name || "",
      date: start.toISOString().slice(0, 10),
      time: start.toTimeString().slice(0, 5),
      durationMinutes: cls.durationMinutes,
      slots: cls.slots,
      image: null,
    });
    setPreview(cls.image ? `http://localhost:5000${cls.image}` : null);
  };

  const confirmDelete = (id, name) => {
    toast.info(
      <div className="flex flex-col gap-2">
        <span className="text-sm">
          Delete class <b>{name}</b>?
        </span>
        <div className="flex justify-end gap-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
            onClick={() => {
              handleDelete(id);
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
      { autoClose: false, closeOnClick: false },
    );
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await dispatch(deleteClass(id));
    setDeletingId(null);
    dispatch(fetchClasses());
  };

  const openReopenModal = (cls) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  setReopenId(cls._id);
  setReopenForm({
    startTime: now.toISOString().slice(0, 16),
    durationMinutes: cls.durationMinutes,
    slots: cls.slots,
    image: null,
  });
};

  const handleReopenChange = (e) => {
    const { name, value, files } = e.target;
    setReopenForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      reopenClass({
        id: reopenId,
        startTime: reopenForm.startTime,
        durationMinutes: Number(reopenForm.durationMinutes),
        slots: Number(reopenForm.slots),
        image: reopenForm.image,
      }),
    );
    setReopenId(null);
    dispatch(fetchClasses());
  };

  const now = new Date();

  const getStatus = (cls) => {
    if (now >= new Date(cls.endTime))
      return (
        <span className="px-3 py-1 text-[10px] font-bold uppercase bg-gray-100 text-gray-500 rounded-full border border-gray-200">
          Ended
        </span>
      );
    if (now >= new Date(cls.startTime))
      return (
        <span className="px-3 py-1 text-[10px] font-bold uppercase bg-red-50 text-red-500 rounded-full border border-red-100">
          Ongoing
        </span>
      );
    return (
      <span className="px-3 py-1 text-[10px] font-bold uppercase bg-green-50 text-green-600 rounded-full border border-green-100">
        Upcoming
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Classes
          </h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and monitor your training sessions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10 transition-all">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Class" : "Add New Class"}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Class Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Class Name"
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Trainer Name
              </label>
              <input
                name="trainerName"
                value={form.trainerName}
                onChange={handleChange}
                placeholder="Trainer Name"
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Duration (min)
              </label>
              <input
                type="number"
                min={1}
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={handleChange}
                placeholder="60"
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Total Slots
              </label>
              <input
                type="number"
                min={1}
                name="slots"
                value={form.slots}
                onChange={handleChange}
                placeholder="20"
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
              {preview && (
                <img
                  src={preview}
                  className="h-14 w-14 object-cover rounded-xl border border-gray-100"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="md:col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold py-3 shadow-lg shadow-indigo-100 transition-all self-end"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Class"
                  : "Create Class"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              Existing Classes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading sessions...
                    </td>
                  </tr>
                ) : classes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No classes found
                    </td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr
                      key={cls._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {cls.name}
                      </td>
                      <td className="px-6 py-4">{getStatus(cls)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />{" "}
                          {new Date(cls.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold ml-5">
                          {new Date(cls.startTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {cls.bookedSlots} / {cls.slots}{" "}
                        <span className="text-[10px] text-gray-300 ml-1">
                          slots
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(cls)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(cls._id, cls.name)}
                            disabled={deletingId === cls._id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {now >= new Date(cls.endTime) && (
                            <button
                              onClick={() => openReopenModal(cls)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {reopenId && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleReopenSubmit}
              className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 space-y-4"
            >
              <h3 className="text-2xl font-bold text-gray-900 text-center">
                Reopen Class
              </h3>
              <div className="space-y-4 pt-2">
                <input
                  type="datetime-local"
                  name="startTime"
                  value={reopenForm.startTime}
                  onChange={handleReopenChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                <input
                  type="number"
                  name="durationMinutes"
                  value={reopenForm.durationMinutes}
                  onChange={handleReopenChange}
                  placeholder="Duration"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all"
                />
                <input
                  type="number"
                  name="slots"
                  value={reopenForm.slots}
                  onChange={handleReopenChange}
                  placeholder="Slots"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all"
                />
                <input
                  type="file"
                  name="image"
                  onChange={handleReopenChange}
                  className="w-full text-xs"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setReopenId(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100">
                  Reopen
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageClass;

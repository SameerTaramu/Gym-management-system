import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { UserPlus, Mail, Lock, Upload } from "lucide-react";
import AdminLayout from "../../admin/components/AdminLayout";
import { createTrainer } from "../../features/admin/adminTrainerSlice";
import { validateTrainer } from "../../utils/validator";

const CreateTrainer = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.trainers);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const error = validateTrainer(form);
    if (error) return toast.error(error);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      if (image) fd.append("image", image);

      await dispatch(createTrainer(fd)).unwrap();
      toast.success("Trainer created successfully");
      setForm({ name: "", email: "", password: "" });
      setImage(null);
    } catch (err) {
      toast.error(err || "Failed to create trainer");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Trainer</h2>
          <p className="text-sm text-gray-500">Fill in the details to register a new trainer.</p>
        </div>

        <form onSubmit={submitHandler} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${
              isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Trainer"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateTrainer;
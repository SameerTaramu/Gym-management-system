import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const currentUser = user || JSON.parse(localStorage.getItem("user"));

    if (isSuccess && currentUser) {
      if (currentUser.role === "admin") {
        navigate("/admin/dashboard");
      }
      else if (currentUser.role === "trainer") {
        navigate("/trainer/dashboard");
      }
      else {
        navigate("/");
      }
    }
    dispatch(reset());
  }, [isSuccess, user, navigate, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }
    dispatch(login(form));
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 px-6">
      <div className="bg-neutral-900 p-10 rounded-2xl w-full max-w-md border border-neutral-800 shadow-md">
        <h2 className="text-3xl font-bold text-center text-white">WELCOME BACK</h2>
        <p className="text-neutral-400 text-center mt-2 mb-6">
          Sign in to continue your fitness journey
        </p>

        {isError && <p className="text-red-500 mb-4 text-center">{message}</p>}
        {isLoading && <p className="text-blue-500 mb-4 text-center">Loading...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-black py-4 rounded-xl font-semibold hover:bg-orange-600"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-neutral-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;

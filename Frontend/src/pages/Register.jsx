
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/login"); 
    }
    dispatch(reset());
  }, [isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[\w.-]+@(gmail\.com|gov\.np)$/;
      const namePattern = /^[A-Za-z\s]+$/;

 if (!form.name.trim()) {
    newErrors.name = "Full Name is required";
  } else if (!namePattern.test(form.name)) {
    newErrors.name = "Name must contain only letters and spaces";
  }
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailPattern.test(form.email))
      newErrors.email = "Email must end with @gmail.com or @gov.np";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(register(form));
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 px-6">
      <div className="bg-neutral-900 p-10 rounded-2xl w-full max-w-md border border-neutral-800 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white">
          Create Account
        </h2>
        <p className="text-neutral-400 text-center mt-2 mb-6">
          Join us and start your fitness journey today
        </p>

        {isError && (
          <p className="text-red-500 mb-4 text-center">{message}</p>
        )}
        {isLoading && (
          <p className="text-center text-orange-500 mb-4">Loading...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-black py-4 rounded-xl font-semibold hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-neutral-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;

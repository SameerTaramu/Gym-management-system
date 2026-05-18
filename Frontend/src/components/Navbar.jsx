import { Link, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    if (open) window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [open]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Plans", path: "/plans" },
    { name: "Bookings", path: "/bookings" },
    { name: "Hire Trainer", path: "/hire-trainer" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <span>
            <span className="text-black">GYM</span>
            <span className="text-orange-500">RAT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive(link.path)
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="flex items-center gap-2 outline-none"
            >
              {user ? (
                <div className="flex items-center gap-3 pl-3 py-1.5 pr-2 rounded-full border border-gray-200 hover:border-gray-300 bg-white shadow-sm transition-all">
                  <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-gray-800">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                >
                  <User size={16} />
                  Login
                </Link>
              )}
            </button>

            {open && user && (
              <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold truncate text-gray-900">
                    {user.email}
                  </p>
                </div>

                {user.role === "admin" ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Calendar className="w-4 h-4 text-gray-400" />
                    My Bookings
                  </Link>
                )}

                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive(link.path)
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {!user && (
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
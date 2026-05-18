import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

import { FaBars, FaTachometerAlt, FaCalendarCheck, FaSignOutAlt } from "react-icons/fa";

const TrainerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  return (
    <div className="flex h-screen bg-gray-100">

      <aside
        className={`bg-neutral-900 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-orange-500">
              Trainer
            </h1>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-4">

          <Link
            to="/trainer/dashboard"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800"
          >
            <FaTachometerAlt />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/trainer/bookings"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800"
          >
            <FaCalendarCheck />
            {sidebarOpen && <span>Bookings</span>}
          </Link>
            <Link
            to="/trainer/attendance"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800"
          >
            <FaCalendarCheck />
            {sidebarOpen && <span>Attendance</span>}
          </Link>
          <Link
            to="/trainer/clients"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800"
          >
            <FaCalendarCheck />
            {sidebarOpen && <span>Clients</span>}
          </Link>

        </nav>

        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 p-4 border-t border-neutral-800 hover:bg-neutral-800 text-red-400"
        >
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <div className="flex-1 flex flex-col">

        <header className="bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Trainer Dashboard
          </h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default TrainerLayout;
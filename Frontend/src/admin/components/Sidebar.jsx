import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiClipboard,
  FiUserPlus,
  FiBarChart2,
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },

    { name: "Manage Users", path: "/admin/users", icon: <FiUsers /> },

    { name: "Manage Trainers", path: "/admin/trainers", icon: <FiUsers /> },
    {
      name: "Create Trainer",
      path: "/admin/trainers/create",
      icon: <FiUserPlus />,
    },

    { name: "Manage Classes", path: "/admin/classes", icon: <FiBook /> },

    { name: "Manage Plans", path: "/admin/plans", icon: <FiDollarSign /> },

    {
      name: "Pending Memberships",
      path: "/admin/memberships/pending",
      icon: <FiClipboard />,
    },
    {
      name: "Active Memberships",
      path: "/admin/memberships/active",
      icon: <FiUsers />,
    },

    { name: "Manage Bookings", path: "/admin/bookings", icon: <FiClipboard /> },
    { name: "Analytics", path: "/admin/analytics", icon: <FiBarChart2 /> },
  ];
  return (
    <div
      className={`bg-neutral-900 text-white min-h-screen p-4 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <button
        className="mb-6 px-2 py-1 bg-orange-500 rounded hover:bg-orange-600"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "→" : "←"}
      </button>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 p-2 rounded transition-colors
              hover:bg-orange-500
              ${
                location.pathname === item.path
                  ? "bg-orange-500 font-semibold"
                  : ""
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

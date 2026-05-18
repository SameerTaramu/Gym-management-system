import AdminLayout from "../components/AdminLayout";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.name || "Admin"}!
        </h1>
        <p className="text-gray-600 text-lg">
          This is your admin dashboard. Use the sidebar to manage users, plans, bookings, and other system settings.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

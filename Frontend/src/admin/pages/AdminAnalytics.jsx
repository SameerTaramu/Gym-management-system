import AdminLayout from "../components/AdminLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../features/admin/adminStatsSlice.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Users,
  UserCog,
  ShieldCheck,
  Dumbbell,
  BadgeDollarSign,
  CalendarCheck,
} from "lucide-react";

const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4", "#8b5cf6"];

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {title}
        </p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
          {value ?? 0}
        </h3>
      </div>
      <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">{icon}</div>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
    <div className="h-[320px]">{children}</div>
  </div>
);

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, isError, message } = useSelector(
    (state) => state.adminStats
  );

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const overview = stats?.overview || {};
  const membershipChart = stats?.membershipChart || [];
  const bookingStatusChart = stats?.bookingStatusChart || [];
  const userRoleChart = stats?.userRoleChart || [];
  const systemOverviewChart = stats?.systemOverviewChart || [];
  const classPerformance = stats?.classPerformance || [];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor users, trainers, bookings, classes, and memberships.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center text-gray-500">
            Loading analytics...
          </div>
        ) : isError ? (
          <div className="bg-red-50 rounded-3xl border border-red-100 p-10 text-center text-red-500">
            {message || "Failed to load analytics"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={overview.totalUsers}
                icon={<Users className="w-6 h-6" />}
              />
              <StatCard
                title="Total Trainers"
                value={overview.totalTrainers}
                icon={<UserCog className="w-6 h-6" />}
              />
              <StatCard
                title="Admins"
                value={overview.totalAdmins}
                icon={<ShieldCheck className="w-6 h-6" />}
              />
              <StatCard
                title="Classes"
                value={overview.totalClasses}
                icon={<Dumbbell className="w-6 h-6" />}
              />
              <StatCard
                title="Plans"
                value={overview.totalPlans}
                icon={<BadgeDollarSign className="w-6 h-6" />}
              />
              <StatCard
                title="Bookings"
                value={overview.totalBookings}
                icon={<CalendarCheck className="w-6 h-6" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Membership Status">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipChart}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {membershipChart.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Booking Status">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusChart}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {bookingStatusChart.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="User Roles">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userRoleChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="System Overview">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={systemOverviewChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <ChartCard title="Class Performance">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="slots" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Bookings from "./pages/Bookings";
import TrainerHire from "./pages/TrainerHire";
import MyBookings from "./pages/MyBookings";
import Contact from "./pages/Contact";
import { useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import ManageClass from "./admin/pages/ManageClass";
import ManagePlans from "./admin/pages/ManagePlans";
import ManageBooking from "./admin/pages/ManageBooking";
import CreateTrainer from "./admin/pages/CreateTrainer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminPendingMemberships from "./admin/pages/AdminPendingMemberships";
import ManageMembership from "./admin/pages/ManageMembership";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import TrainerList from "./admin/pages/TrainerList";
import TrainerLayout from "./layout/TrainerLayout";
import TrainerBookings from "./trainer/TrainerBookings";
import TrainerAttendance from "./trainer/TrainerAttendance";
import TrainerClients from "./trainer/TrainerClients";
import AdminAnalytics from "./admin/pages/AdminAnalytics";

function App() {
  const location = useLocation();

  const hideLayout = location.pathname.startsWith("/trainer");

  return (
    <div className="App flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/plans" element={<Plans />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/hire-trainer" element={<TrainerHire />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/classes" element={<ManageClass />} />
            <Route path="/admin/plans" element={<ManagePlans />} />
            <Route
              path="/admin/memberships/pending"
              element={<AdminPendingMemberships />}
            />
            <Route
              path="/admin/memberships/active"
              element={<ManageMembership />}
            />
            <Route path="/admin/bookings" element={<ManageBooking />} />
            <Route path="/admin/trainers/create" element={<CreateTrainer />} />
            <Route path="/admin/trainers" element={<TrainerList />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
            <Route path="/trainer" element={<TrainerLayout />}>
              <Route path="dashboard" element={<div>Dashboard</div>} />
              <Route path="bookings" element={<TrainerBookings />} />
              <Route path="attendance" element={<TrainerAttendance />} />
              <Route path="clients" element={<TrainerClients />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <p className="text-center py-10 text-2xl text-red-500">
                404 - Page Not Found
              </p>
            }
          />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;

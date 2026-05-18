import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import planReducer from "../features/plans/planSlice";
import classReducer from "../features/classes/classSlice";
import userReducer from "../features/admin/adminUserSlice";
import adminMembershipReducer from "../features/admin/adminMembershipSlice";
import membershipReducer from "../features/users/userMembershipSlice";
import activeMembershipReducer from "../features/admin/activeMembershipSlice";
import adminBookingReducer from "../features/admin/adminBookingSlice";
import adminClassReducer from "../features/admin/adminClassSlice";
import trainerReducer from "../features/admin/adminTrainerSlice";
import trainerBookingReducer from "../features/trainer/trainerBookingSlice";
import attendanceReducer from "../features/trainer/trainerAttendanceSlice";
import adminStatsReducer from "../features/admin/adminStatsSlice";
import trainerHireReducer from "../features/trainerHire/trainerHireSlice";
import trainerClientsReducer from "../features/trainer/trainerClientSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    classes: classReducer,
    plans: planReducer,
    users: userReducer,
    trainers: trainerReducer,
    adminMembership: adminMembershipReducer,
    membership: membershipReducer,
    activeMemberships: activeMembershipReducer,
    adminBookings: adminBookingReducer,
    adminClasses: adminClassReducer,
    trainerBookings: trainerBookingReducer,
    trainerAttendance: attendanceReducer,
    adminStats: adminStatsReducer,
    trainerHire: trainerHireReducer,
    trainerClients: trainerClientsReducer,
  },
});
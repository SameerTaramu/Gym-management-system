import User from "../model/userModel.js";
import Class from "../model/classModel.js";
import Booking from "../model/bookingModel.js";
import MembershipPlan from "../model/memberShipPlan.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalTrainers = await User.countDocuments({ role: "trainer" });

    const activeMembers = await User.countDocuments({
      "membership.status": "Active",
    });

    const expiredMembers = await User.countDocuments({
      "membership.status": "Expired",
    });

    const totalClasses = await Class.countDocuments();
    const totalPlans = await MembershipPlan.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const classes = await Class.find({}, "name bookedSlots slots").sort({
      createdAt: -1,
    });

    const enrichedClasses = classes.map((cls) => {
      const utilization = cls.slots > 0 ? cls.bookedSlots / cls.slots : 0;
      return {
        _id: cls._id,
        name: cls.name,
        bookings: cls.bookedSlots || 0,
        slots: cls.slots || 0,
        utilization,
        remainingSlots: Math.max(0, (cls.slots || 0) - (cls.bookedSlots || 0)),
      };
    });

    const sortedByUtilization = [...enrichedClasses].sort(
      (a, b) => b.utilization - a.utilization
    );

    const classPerformance = enrichedClasses;
    const topClasses = sortedByUtilization.slice(0, 5);
    const underutilizedClasses = sortedByUtilization
      .slice(-5)
      .filter((cls) => cls.utilization < 0.6);

    const averageUtilization =
      enrichedClasses.length > 0
        ?
            enrichedClasses.reduce((sum, cls) => sum + cls.utilization, 0) /
            enrichedClasses.length
        :
            0;

    const predictedNextWeekBookings = Math.round(totalBookings * 1.05); // simple heuristic

    res.status(200).json({
      overview: {
        totalUsers,
        totalTrainers,
        activeMembers,
        expiredMembers,
        totalClasses,
        totalPlans,
        totalBookings,
        averageClassUtilization: Number((averageUtilization * 100).toFixed(1)),
        predictedNextWeekBookings,
      },
      membershipChart: [
        { name: "Active", value: activeMembers },
        { name: "Expired", value: expiredMembers },
      ],
      userRoleChart: [
        { name: "Users", value: totalUsers },
        { name: "Trainers", value: totalTrainers },
      ],
      systemOverviewChart: [
        { name: "Classes", value: totalClasses },
        { name: "Plans", value: totalPlans },
        { name: "Bookings", value: totalBookings },
      ],
      classPerformance,
      topClasses,
      underutilizedClasses,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch admin analytics" });
  }
};
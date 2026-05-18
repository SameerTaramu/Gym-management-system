export const calculateMembershipEndDate = (startDate, duration) => {
  const endDate = new Date(startDate);

  switch (duration) {
    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1);
      break;

    case "quarterly":
      endDate.setMonth(endDate.getMonth() + 3);
      break;

    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;

    default:
      throw new Error("Invalid membership duration");
  }

  return endDate;
};

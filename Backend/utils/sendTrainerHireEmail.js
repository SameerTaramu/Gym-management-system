import sendMail from "./reminderClass.js";

const sendTrainerHireMail = async ({
  email,
  trainerName,
  userName,
  periodType,
  startDate,
  endDate,
}) => {
  await sendMail({
    to: email,
    subject: "You have been hired as a trainer",
    text: `Hello ${trainerName}, ${userName} has hired you as a trainer for a ${periodType} period.`,
    html: `
      <h2>Trainer Hire Notification</h2>
      <p>Hello ${trainerName},</p>
      <p><strong>${userName}</strong> has hired you as a trainer.</p>
      <p><strong>Hiring Period:</strong> ${periodType}</p>
      <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> ${new Date(endDate).toLocaleString()}</p>
      <p>Please log in to your dashboard for more details.</p>
    `,
  });
};

export default sendTrainerHireMail;
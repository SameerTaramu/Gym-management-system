import sendMail from "./reminderClass.js";

const sendTrainerCancelMail = async ({
  email,
  trainerName,
  userName,
  periodType,
  startDate,
  endDate,
}) => {
  await sendMail({
    to: email,
    subject: "Trainer hire has been cancelled",
    text: `Hello ${trainerName}, ${userName} has cancelled the ${periodType} trainer hire.`,
    html: `
      <h2>Trainer Hire Cancellation</h2>
      <p>Hello ${trainerName},</p>
      <p><strong>${userName}</strong> has cancelled the trainer hire.</p>
      <p><strong>Hiring Period:</strong> ${periodType}</p>
      <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> ${new Date(endDate).toLocaleString()}</p>
      <p>Please log in to your dashboard for updated details.</p>
    `,
  });
};

export default sendTrainerCancelMail;
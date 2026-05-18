import sendMail from "./reminderClass.js";

const sendBookingConfirm = async ({
  email,
  userName,
  className,
  trainerName,
  startTime,
  endTime,
  qrImage,
}) => {

  let attachments = [];

  if (qrImage) {
    attachments.push({
      filename: "gym-qr-code.png",
      content: qrImage.split("base64,")[1],
      encoding: "base64",
    });
  }

  await sendMail({
    to: email,
    subject: `Booking Confirmed: ${className}`,
    text: `Hello ${userName}, your booking for ${className} is confirmed.`,

    html: `
      <h2>Booking Confirmed</h2>

      <p>Hello ${userName},</p>

      <p>
        Your booking for 
        <strong>${className}</strong> 
        has been confirmed.
      </p>

      <p>
        <strong>Trainer:</strong> 
        ${trainerName || "Trainer not assigned"}
      </p>

      <p>
        <strong>Start Time:</strong><br/>
        ${new Date(startTime).toLocaleString()}
      </p>

      <p>
        <strong>End Time:</strong><br/>
        ${new Date(endTime).toLocaleString()}
      </p>

      <p>
        Please show the attached QR code at the gym.
      </p>
    `,

    attachments,
  });
};

export default sendBookingConfirm;
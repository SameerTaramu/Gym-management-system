import QrScanner from "./QrScanner";

const TrainerAttendance = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        QR Attendance Scanner
      </h2>

      <QrScanner />
    </div>
  );
};

export default TrainerAttendance;
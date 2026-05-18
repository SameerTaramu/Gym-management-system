import { Clock, User, Calendar, CheckCircle2 } from "lucide-react";
import { getTimeRemaining } from "../utils/time";

const ClassCard = ({
  cls,
  handleBooking,
  bookedClassIds,
  cancelledClassIds,
  isRecommended = false,
}) => {
  const now = new Date();
  const startTime = new Date(cls.startTime);
  const endTime = new Date(cls.endTime);
  const hasStarted = now >= startTime;
  const hasEnded = now >= endTime && !cls.adminReopen;
  const timeInfo = getTimeRemaining(cls.startTime);
  const slotsAvailable = (cls.slots || 0) - (cls.bookedSlots || 0);
  const isBooked = bookedClassIds.includes(cls._id);
  const isCancelled = cancelledClassIds.includes(cls._id);

const canBook =
  (!hasStarted || cls.adminReopen) &&
  !hasEnded &&
  slotsAvailable > 0 &&
  !isBooked &&
  !isCancelled;
  return (
    <div
      className={`group rounded-[2.5rem] overflow-hidden border hover:shadow-2xl transition-all duration-500 ${
        isRecommended
          ? "bg-orange-50 border-orange-100"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={`http://localhost:5005${cls.image}`}
          alt={cls.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {isRecommended && (
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg bg-orange-500 text-white">
              Recommended
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
              slotsAvailable > 0
                ? "bg-white text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {slotsAvailable} Slots Left
          </span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {cls.name}
          </h2>
          {isBooked && <CheckCircle2 className="text-green-500 w-6 h-6" />}
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-gray-500">
            <User className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-tight">
              Trainer: {cls.trainer?.name || "Expert"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {startTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="mb-6">
          {isCancelled ? (
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Session Cancelled
            </span>
          ) : hasEnded ? (
            <span className="text-xs font-black uppercase text-red-500 tracking-widest">
              Booking Closed
            </span>
          ) : hasStarted ? (
            <span className="text-xs font-black uppercase text-orange-500 animate-pulse tracking-widest">
              In Progress
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-green-600">
                Starts in {String(timeInfo.hours).padStart(2, "0")}:
                {String(timeInfo.minutes).padStart(2, "0")}:
                {String(timeInfo.seconds).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => handleBooking(cls)}
          disabled={!canBook}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
            canBook
              ? "bg-black text-white hover:bg-orange-500 shadow-xl shadow-gray-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isBooked
            ? "Confirmed"
            : isCancelled
              ? "Cancelled"
              : hasEnded
                ? "Ended"
                : "Reserve Spot"}
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
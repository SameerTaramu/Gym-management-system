import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyBookings,
  cancelBooking,
} from "../features/bookings/bookingSlice";
import { getTimeRemaining } from "../utils/time";
import { CalendarDays, User, Clock, AlertCircle, XCircle } from "lucide-react";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    await dispatch(cancelBooking(bookingId));
    dispatch(fetchMyBookings());
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-gray-400">
        Loading your sessions...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            My <span className="text-orange-500">Bookings</span>
          </h1>
          <p className="text-gray-400 mt-4 font-medium uppercase tracking-widest text-sm">
            Manage your bookings.....
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <CalendarDays className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest">
              No active bookings found
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const cls = booking.class;

              if (!cls) {
                return (
                  <div
                    key={booking._id}
                    className="bg-gray-50 p-8 rounded-[2.5rem] border border-red-100 flex flex-col justify-between"
                  >
                    <div>
                      <AlertCircle className="text-red-500 mb-4 w-8 h-8" />
                      <h2 className="text-xl font-black uppercase tracking-tight text-red-600">
                        Class Unavailable
                      </h2>
                      <p className="text-sm font-medium text-gray-500 mt-2 leading-relaxed">
                        This session has been removed by the administrator.
                      </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-red-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Ref: {booking._id.slice(-8)}
                    </div>
                  </div>
                );
              }

              const timeInfo = getTimeRemaining(cls.startTime);
              const hasStarted = timeInfo.expired;
              const isCancelled = booking.status === "Cancelled";

              return (
                <div
                  key={booking._id}
                  className={`group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                    isCancelled ? "opacity-60 grayscale" : ""
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    {cls.image ? (
                      <img
                        src={`http://localhost:5005${cls.image}`}
                        alt={cls.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center" />
                    )}

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                          isCancelled
                            ? "bg-gray-800 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {isCancelled
                          ? "Cancelled"
                          : hasStarted
                            ? "Completed"
                            : "Confirmed"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                      {cls.name}
                    </h2>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-gray-500">
                        <User size={16} />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          Trainer: {cls.trainer?.name || "Pro"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <Clock size={16} />
                        <span className="text-xs font-medium">
                          {new Date(cls.startTime).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={hasStarted || isCancelled}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                        hasStarted || isCancelled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-black text-white hover:bg-red-500"
                      }`}
                    >
                      {isCancelled ? (
                        <>
                          {" "}
                          <XCircle size={14} /> Cancelled{" "}
                        </>
                      ) : hasStarted ? (
                        "Session Finished"
                      ) : (
                        "Cancel Reservation"
                      )}
                    </button>
                  </div>
                  {booking.qrImage && (
                    <div className="mt-4 text-center">
                      <img
                        src={booking.qrImage}
                        alt="QR Code"
                        className="w-32 h-32 mx-auto"
                      />

                      <a
                        href={booking.qrImage}
                        download={`qr-${booking._id}.png`}
                        className="block mt-2 text-xs font-bold uppercase text-blue-500"
                      >
                        Download QR
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainerBookings } from "../features/trainer/trainerBookingSlice";

const TrainerBookings = () => {
  const dispatch = useDispatch();

  const { bookings, isLoading } = useSelector((state) => state.trainerBookings);

  useEffect(() => {
    dispatch(fetchTrainerBookings());
  }, [dispatch]);

  if (isLoading) return <p>Loading bookings...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">My Class Bookings</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-3">Member</th>
            <th>Email</th>
            <th>Membership</th>
            <th>Class</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-b">
              <td className="py-3">{b.user.name}</td>

              <td>{b.user.email}</td>

              <td>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                  {b.user.membershipStatus}
                </span>
              </td>

              <td>{b.class.name}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    b.attended
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.attended ? "Present" : "Absent"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerBookings;

// import { useSelector, useDispatch } from "react-redux";
// import { removePlan } from "../features/plans/planSlice";

// const MyPlans = () => {
//   const dispatch = useDispatch();
//   const { activatedPlans } = useSelector((state) => state.plans); 

//   return (
//     <div className="min-h-screen px-6 py-10 bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8 text-center">My Plans</h1>
//       {activatedPlans.length === 0 ? (
//         <p className="text-center text-gray-500">
//           You haven't activated any plans yet.
//         </p>
//       ) : (
//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
//           {activatedPlans.map((plan) => (
//             <div key={plan._id} className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
//               <p className="mb-2">Duration: {plan.duration}</p>
//               <p className="text-2xl font-bold mb-4">{plan.price}</p>
//               <p className="mb-4">Start Date: {plan.startDate}</p>
//               <p className="mb-4">Status: {plan.status}</p>
//               <button
//                 onClick={() => dispatch(removePlan(plan._id))}
//                 className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
//               >
//                 Cancel Plan
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPlans;

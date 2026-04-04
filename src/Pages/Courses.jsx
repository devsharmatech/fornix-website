// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import banner from "../Assets/banner.webp";
// import RazorpayCheckout from "../Components/RazorpayCheckout";

// import {
//   fetchCoursesWithPlans,
//   selectCourses,
//   selectPlans,
//   selectCoursesLoading,
//   selectCoursesError,
//   fetchEnrolledCourses,
// } from "../redux/slices/coursesSlice";
// import { selectUser } from "../redux/slices/authSlice";
// import { showNotification } from "../redux/slices/uiSlice";

// const isValidUUID = (value) =>
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
//     value,
//   );

// function Courses() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const courses = useSelector(selectCourses);
//   const plans = useSelector(selectPlans);
//   const loading = useSelector(selectCoursesLoading);
//   const error = useSelector(selectCoursesError);
//   const user = useSelector(selectUser);

//   useEffect(() => {
//     dispatch(fetchCoursesWithPlans());
//   }, [dispatch]);

//   const handlePaymentSuccess = async () => {
//     try {
//       // 🔥 SAME logic as payment
    
//       let userId = user?.user_id || user?.uuid || user?.id;

//       if (!isValidUUID(userId)) {
//         userId = "0c8a7950-df05-47e2-881f-5116b762ad5e";
//       }

//       await dispatch(fetchEnrolledCourses(userId)).unwrap();

//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Post-payment error:", err);
//       navigate("/dashboard"); // fallback navigation
//     }
//   };

//   const handlePaymentFailure = (error) => {
//     console.error("Payment failed:", error);
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center pt-32">
//         <div className="text-center text-red-600 bg-red-50 p-8 rounded-xl max-w-md mx-4">
//           <p className="text-xl font-bold mb-2">Unable to Load Courses</p>
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={() => dispatch(fetchCoursesWithPlans())}
//             className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-32 pb-20">
//       {/* Hero Section */}
//       <section className="relative mb-16">
//         <div className="relative h-100 overflow-hidden">
//           <img
//             src={banner}
//             alt="Courses Banner"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 to-gray-900/60 flex flex-col justify-center px-6 md:px-20 text-center md:text-left">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
//               Advance Your{" "}
//               <span className="text-orange-500">Medical Career</span>
//             </h1>
//             <p className="text-gray-300 text-lg md:text-xl max-w-2xl animate-fade-in-up delay-100">
//               Select from our specialized courses designed to help you crush
//               your exams.
//             </p>
//           </div>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
//         {courses.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
//             <p className="text-2xl text-gray-500 font-medium">Coming Soon...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {courses.map((course) => {
//               const coursePlans = plans.filter(
//                 (p) => p.course_id === course.id,
//               );
//               const displayPlans =
//                 coursePlans.length > 0 ? coursePlans : course.plans || [];

//               // Dynamic colors based on course name (fallback logic)
//               const cardColor = course.name.includes("NEET PG")
//                 ? "emerald"
//                 : course.name.includes("NEET UG")
//                   ? "blue"
//                   : course.name.includes("AMC")
//                     ? "purple"
//                     : "orange";

//               return (
//                 <div
//                   key={course.id}
//                   className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col"
//                 >
//                   <div className="h-52 bg-gray-200 relative group overflow-hidden">
//                     {/* Placeholder gradient if no image */}
//                     <div
//                       className={`absolute inset-0 bg-linear-to-br from-${cardColor}-400 to-${cardColor}-600 opacity-90 transition-opacity group-hover:opacity-100`}
//                     ></div>

//                     {/* Prioritize icon_url, fallback to image_url */}
//                     {(course.icon_url || course.image_url) && (
//                       <img
//                         src={course.icon_url || course.image_url}
//                         alt={course.name}
//                         className={`w-full h-full object-cover absolute inset-0 ${course.icon_url ? '' : 'mix-blend-overlay opacity-50'}`}
//                       />
//                     )}

//                     <div className="absolute bottom-4 left-6 right-6">
//                       <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 inline-block mb-2">
//                         <span className="text-white text-xs font-bold uppercase tracking-wider px-2">
//                           {course.category || "Certification"}
//                         </span>
//                       </div>
//                       <h3 className="text-3xl font-bold text-white drop-shadow-md leading-tight">
//                         {course.name}
//                       </h3>
//                     </div>
//                   </div>

//                   <div className="p-8 flex-1 flex flex-col">
//                     <p className="text-gray-600 mb-8 leading-relaxed flex-1">
//                       {course.description ||
//                         "Comprehensive curriculum designed by top medical experts."}
//                     </p>

//                     {displayPlans.length > 0 ? (
//                       <div className="space-y-4 mt-auto">
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="h-px bg-gray-200 flex-1"></span>
//                           <span className="text-xs font-bold text-gray-400 uppercase">
//                             Pricing Plans
//                           </span>
//                           <span className="h-px bg-gray-200 flex-1"></span>
//                         </div>

//                         {displayPlans.map((plan) => {
//                           
//                           
//                           console.log(
//                             "COURSES.jsx  typeof user_id:",
//                             typeof user?.user_id,
//                           );
//                           console.log(
//                             "COURSES.jsx 👉 isValidUUID:",
//                             isValidUUID(user?.user_id),
//                           );

//                           // Determine user ID for payment
//                           const uid = (() => {
//                             // Try all possible user fields
//                             let id = user?.user_id || user?.uuid || user?.id;

//                             // If missing or invalid, fallback to default test user
//                             if (!id || !isValidUUID(id)) {
//                               console.warn(
//                                 "User ID missing or invalid, using default test user ID",
//                               );
//                               return "0c8a7950-df05-47e2-881f-5116b762ad5e";
//                             }

//                             return id;
//                           })();

//                           return (
//                             <div
//                               key={plan.id}
//                               className="group/plan border border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:bg-orange-50 transition-all relative overflow-hidden flex justify-between items-center gap-4"
//                             >
//                               <div className="flex-1">
//                                 <h4 className="font-bold text-gray-800 group-hover/plan:text-orange-700">
//                                   {plan.name}
//                                 </h4>
//                                 <p className="text-xs text-gray-500">
//                                   {plan.duration_months} Months Access
//                                 </p>
//                               </div>

//                               <div className="flex flex-col items-end gap-2">
//                                 <span className="font-bold text-xl text-gray-900 group-hover/plan:text-orange-600">
//                                   {plan.price === 0 ? "Free" : `₹${plan.price}`}
//                                 </span>

//                                 <RazorpayCheckout
//                                   amount={plan.price}
//                                   currency="INR"
//                                   courseId={course.id}
//                                   planId={plan.id}
//                                   planName={plan.name}
//                                   userId={uid} 
//                                   userEmail={user?.email}
//                                   userPhone={user?.phone}
//                                   userName={user?.name || user?.full_name}
//                                   onSuccess={handlePaymentSuccess}
//                                   onFailure={handlePaymentFailure}
//                                   buttonText={
//                                     plan.price === 0 ? "Enroll Free" : "Buy Now"
//                                   }
//                                   buttonClassName="px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition shadow-sm z-20 relative"
//                                 />
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="mt-auto">
//                         <Link
//                           to={`/courses/${course.id}/subjects`}
//                           className={`w-full block text-center bg-${cardColor}-500 text-white py-4 rounded-xl font-bold hover:bg-${cardColor}-600 transition shadow-lg shadow-${cardColor}-200`}
//                         >
//                           View Course
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Courses;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCoursesWithPlans, fetchEnrolledCourses, selectCourses } from '../redux/slices/coursesSlice';
import { selectUser } from '../redux/slices/authSlice';
import { selectUserProfile, fetchUserDetails } from '../redux/slices/userSlice';
import RazorpayCheckout from './RazorpayCheckout';

/**
 * UpgradePrompt — shows upgrade message first, then pricing cards (same as AMC/Signup) when "View Plans" clicked.
 * Uses RazorpayCheckout for payment — the same component used in AMC and Signup Step 2.
 */
function UpgradePrompt({ isOpen, onClose, feature = 'quiz', courseId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const userProfile = useSelector(selectUserProfile);
    const allCourses = useSelector(selectCourses);

    const activeUser = userProfile || user;
    const uid = activeUser?.user_id || activeUser?.id;

    const [showPlans, setShowPlans] = useState(false);
    const [coursePlans, setCoursePlans] = useState([]);

    // Fetch courses+plans when "View Plans" is clicked
    useEffect(() => {
        if (showPlans && allCourses.length === 0) {
            dispatch(fetchCoursesWithPlans());
        }
    }, [showPlans, allCourses.length, dispatch]);

    // Gather plans for the relevant course
    useEffect(() => {
        if (!showPlans || allCourses.length === 0) return;

        // Find the target course — use passed courseId or default to AMC
        const targetCourseId = courseId || 'cc613b33-3986-4d67-b33a-009b57a72dc8';
        const targetCourse = allCourses.find(c => c.id === targetCourseId);
        const plans = targetCourse?.plans || [];

        // Sort by duration (shortest first)
        const sorted = [...plans].sort((a, b) => {
            const getDuration = (p) => {
                if (p.duration_months) return parseInt(p.duration_months);
                const match = (p.name || '').match(/(\d+)\s*(Month|Year)/i);
                if (match) {
                    const val = parseInt(match[1]);
                    return match[2].toLowerCase().startsWith('year') ? val * 12 : val;
                }
                return p.price || 999;
            };
            return getDuration(a) - getDuration(b);
        });
        setCoursePlans(sorted);
    }, [showPlans, allCourses, courseId]);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) setShowPlans(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePaymentSuccess = async () => {
        try {
            if (uid) {
                await dispatch(fetchEnrolledCourses(uid)).unwrap();
                await dispatch(fetchUserDetails(uid)).unwrap();
            }
        } catch (e) {
            console.error('Post-payment refresh error:', e);
        }
        onClose();
        navigate('/dashboard');
    };

    const handlePaymentFailure = (error) => {
        console.error('Payment failed:', error);
    };

    const messages = {
        quiz: {
            title: '🎯 Free Test Limit Reached',
            description: "You've used all 2 free test attempts. Upgrade to unlock full question bank, mock tests, full notes and more.",
        },
        mock_test: {
            title: '🔒 Premium Feature',
            description: 'Mock tests are available for premium users. Upgrade to access all mock tests.',
        },
        full_notes: {
            title: '📚 Premium Feature',
            description: 'Full notes are available for premium users. Upgrade for complete access.',
        },
        course_access: {
            title: '🔒 Course Locked',
            description: 'This course requires a subscription. Choose a plan to unlock full access.',
        },
    };
    const content = messages[feature] || messages.quiz;

    // Plan card color styles — same as SignUp Step 2 and AMC pricing section
    const planStyles = [
        {
            bgHeader: 'bg-orange-500', priceColor: 'text-orange-600',
            btnColor: 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-200',
            subtext: 'Ideal for quick revision & practice',
        },
        {
            bgHeader: 'bg-orange-600', priceColor: 'text-orange-600',
            btnColor: 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-200',
            subtext: 'Best for complete preparation',
        },
        {
            bgHeader: 'bg-orange-500', priceColor: 'text-orange-600',
            btnColor: 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-200',
            badge: 'Best Value', subtext: 'Ideal for thorough and smart preparation',
        },
        {
            bgHeader: 'bg-orange-600', priceColor: 'text-orange-600',
            btnColor: 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-200',
            badge: 'Premium', subtext: 'Best value for long-term learning',
        },
    ];

    const targetCourseId = courseId || 'cc613b33-3986-4d67-b33a-009b57a72dc8';

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full my-8 ${showPlans ? 'max-w-5xl' : 'max-w-md'} transition-all duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {!showPlans && (
                        <div className="flex justify-center mb-3">
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                    )}
                    <h2 className="text-xl font-bold text-center">
                        {showPlans ? 'Select a Plan' : content.title}
                    </h2>
                    {!showPlans && (
                        <p className="text-white/90 text-center text-sm mt-1">{content.description}</p>
                    )}
                </div>

                {/* Body */}
                <div className="p-6">
                    {!showPlans ? (
                        /* --- State 1: Upgrade message + View Plans button --- */
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPlans(true)}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition"
                            >
                                View Plans
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Maybe Later
                            </button>
                        </div>
                    ) : (
                        /* --- State 2: Pricing cards with RazorpayCheckout (same as AMC/Signup) --- */
                        <div>
                            <button
                                onClick={() => setShowPlans(false)}
                                className="mb-5 flex items-center text-gray-500 hover:text-orange-500 transition text-sm"
                            >
                                ← Back
                            </button>

                            {coursePlans.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3"></div>
                                    <p className="text-gray-500">Loading plans...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {coursePlans.map((plan, idx) => {
                                        const style = planStyles[idx % planStyles.length];
                                        return (
                                            <div key={plan.id} className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col hover:-translate-y-1 transition-all duration-300">
                                                {/* Badge */}
                                                {style.badge && (
                                                    <div className={`absolute top-0 right-0 ${style.bgHeader} text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10`}>
                                                        {style.badge}
                                                    </div>
                                                )}

                                                {/* Card Header */}
                                                <div className={`${style.bgHeader} p-3 text-center text-white relative overflow-hidden`}>
                                                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-6 transform origin-bottom-left"></div>
                                                    <h3 className="text-lg font-bold relative z-10">{plan.name}</h3>
                                                </div>

                                                {/* Subtext */}
                                                <div className="bg-gray-50 px-3 py-1.5 text-center border-b border-gray-100">
                                                    <p className="text-gray-500 text-[10px] font-medium">{style.subtext}</p>
                                                </div>

                                                {/* Features */}
                                                <div className="p-4 flex-1">
                                                    <ul className="space-y-1.5 text-xs text-gray-600">
                                                        {[
                                                            'Q Bank (7000+ Clinical Questions)',
                                                            'Mock Tests',
                                                            'AI Doubt Solver (24/7)',
                                                            'High Yield Notes',
                                                            'Advanced Analytics',
                                                            'FREE Updates During Validity',
                                                        ].map((feat, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <svg className={`w-3.5 h-3.5 ${style.priceColor} shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <span>{feat}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Price + RazorpayCheckout */}
                                                <div className="px-4 py-3 text-center bg-gray-50 border-t border-gray-100">
                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                        <span className="text-gray-400 line-through text-xs">₹{plan.original_price || Math.round(plan.price * 1.5)}</span>
                                                        <span className={`text-2xl font-extrabold ${style.priceColor}`}>₹{plan.price}</span>
                                                    </div>
                                                    {plan.price > 0 && (
                                                        <p className="text-[10px] text-orange-500 font-bold mb-2">(Limited Offer)</p>
                                                    )}
                                                    <p className="text-[10px] text-gray-500 mb-3">
                                                        Validity: {(() => {
                                                            if (plan.duration_months) return plan.duration_months;
                                                            const match = (plan.name || '').match(/(\d+)\s*(Month|Year)/i);
                                                            if (match) {
                                                                const val = parseInt(match[1]);
                                                                return match[2].toLowerCase().startsWith('year') ? val * 12 : val;
                                                            }
                                                            return '?';
                                                        })()} Months
                                                    </p>

                                                    <RazorpayCheckout
                                                        amount={plan.price}
                                                        currency="INR"
                                                        courseId={targetCourseId}
                                                        planId={plan.id}
                                                        planName={plan.name}
                                                        userId={uid}
                                                        userEmail={activeUser?.email}
                                                        userPhone={activeUser?.phone}
                                                        userName={activeUser?.name || activeUser?.full_name}
                                                        onSuccess={handlePaymentSuccess}
                                                        onFailure={handlePaymentFailure}
                                                        buttonText="Buy Now"
                                                        buttonClassName={`w-full ${style.btnColor} text-white font-bold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UpgradePrompt;

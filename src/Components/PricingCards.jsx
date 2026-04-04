import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchCoursesWithPlans,
    selectCourses,
    selectCoursesLoading,
} from '../redux/slices/coursesSlice';

/**
 * PricingCards — reusable pricing cards extracted from PricingPage.
 * Renders plan cards with Buy Now buttons.
 * Props:
 *   onClose — optional callback to call after Buy Now is clicked (e.g. close a modal)
 */
function PricingCards({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courses = useSelector(selectCourses);
    const loading = useSelector(selectCoursesLoading);
    const [allPlans, setAllPlans] = useState([]);

    useEffect(() => {
        dispatch(fetchCoursesWithPlans());
    }, [dispatch]);

    useEffect(() => {
        if (courses && courses.length > 0) {
            const plans = [];
            courses.forEach(course => {
                if (course.plans && course.plans.length > 0) {
                    course.plans.forEach(plan => {
                        plans.push({
                            ...plan,
                            courseName: course.name,
                            courseId: course.id,
                        });
                    });
                }
            });
            plans.sort((a, b) => a.duration_in_days - b.duration_in_days);
            setAllPlans(plans);
        }
    }, [courses]);

    const handleBuyNow = (courseId, planId) => {
        if (onClose) onClose();
        navigate(`/enroll/${courseId}?plan=${planId}`);
    };

    const getPlanColor = (index) => {
        const colors = [
            { bg: 'from-orange-500 to-orange-600', badge: 'bg-orange-500/20 text-orange-100 border-orange-400/30', button: 'bg-orange-500 hover:bg-orange-600' },
            { bg: 'from-orange-500 to-orange-600', badge: 'bg-orange-500/20 text-orange-100 border-orange-400/30', button: 'bg-orange-500 hover:bg-orange-600' },
            { bg: 'from-orange-500 to-orange-600', badge: 'bg-orange-500/20 text-orange-100 border-orange-400/30', button: 'bg-orange-500 hover:bg-orange-600' },
            { bg: 'from-orange-500 to-orange-600', badge: 'bg-orange-500/20 text-orange-100 border-orange-400/30', button: 'bg-orange-500 hover:bg-orange-600' },
        ];
        return colors[index % colors.length];
    };

    const getPlanTagline = (duration) => {
        if (duration <= 30) return 'Ideal for quick revision & practice';
        if (duration <= 90) return 'Best for complete preparation';
        if (duration <= 180) return 'Ideal for thorough and smart preparation';
        return 'Best value for long term learning';
    };

    const getPlanBadge = (plan, index) => {
        if (plan.popular) return 'Best Value';
        if (index === allPlans.length - 1) return 'Premium';
        return null;
    };

    const formatDuration = (days) => {
        if (days === 30) return '1 Month Plan';
        if (days === 90) return '3 Months Plan';
        if (days === 180) return '6 Months Plan';
        if (days === 365) return '1 Year Plan';
        return `${days} Days Plan`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (allPlans.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No pricing plans available right now.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allPlans.map((plan, index) => {
                const colors = getPlanColor(index);
                const badge = getPlanBadge(plan, index);
                const tagline = getPlanTagline(plan.duration_in_days);
                const discountPercent = plan.original_price > plan.price
                    ? Math.round(((plan.original_price - plan.price) / plan.original_price) * 100)
                    : 0;

                return (
                    <div
                        key={plan.id}
                        className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-gray-200 flex flex-col"
                    >
                        {/* Badge */}
                        {badge && (
                            <div className="absolute top-4 right-4 z-10">
                                <span className={`${colors.badge} border backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                                    {badge}
                                </span>
                            </div>
                        )}

                        {/* Header */}
                        <div className={`bg-gradient-to-r ${colors.bg} p-5 text-white relative`}>
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14"></div>
                            <h3 className="text-xl font-bold mb-1 relative z-10">{formatDuration(plan.duration_in_days)}</h3>
                            <p className="text-sm opacity-90 relative z-10">{tagline}</p>
                        </div>

                        {/* Pricing */}
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-baseline gap-2 mb-1">
                                {plan.original_price > plan.price && (
                                    <span className="text-gray-400 line-through text-base">
                                        ₹{plan.original_price.toLocaleString()}
                                    </span>
                                )}
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{plan.price.toLocaleString()}
                                </span>
                            </div>
                            {discountPercent > 0 && (
                                <span className="text-red-500 text-xs font-bold">
                                    Limited Offer! ({discountPercent}% OFF)
                                </span>
                            )}
                            <p className="text-gray-500 text-xs mt-1">Validity: {plan.duration_in_days} Days</p>
                        </div>

                        {/* Features */}
                        <div className="p-5 space-y-2 flex-1">
                            {plan.access_features?.notes && (
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">High Yield Notes</span>
                                </div>
                            )}
                            {plan.access_features?.tests && (
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">Mock Tests</span>
                                </div>
                            )}
                            {plan.access_features?.videos && (
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">Video Lectures</span>
                                </div>
                            )}
                            {plan.access_features?.ai_explanation && (
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">AI Doubt Solver (24/7)</span>
                                </div>
                            )}
                            {plan.features_list && plan.features_list.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">{feature}</span>
                                </div>
                            ))}
                            {plan.offer_active && (
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">FREE Updates During Validity ⭐</span>
                                </div>
                            )}
                        </div>

                        {/* Buy Button */}
                        <div className="p-5 pt-0">
                            <button
                                onClick={() => handleBuyNow(plan.courseId, plan.uuid || plan.plan_id || plan.id)}
                                className={`w-full ${colors.button} text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Course tag */}
                        <div className="px-5 pb-4">
                            <span className="text-xs text-gray-400 font-medium">For {plan.courseName}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PricingCards;

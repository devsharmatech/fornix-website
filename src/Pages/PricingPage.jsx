import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import hanumanBg from '../Assets/hanumaaanjii.jpg';
import {
    fetchCoursesWithPlans,
    selectCourses,
    selectCoursesLoading,
} from '../redux/slices/coursesSlice';

function PricingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courses = useSelector(selectCourses);
    const loading = useSelector(selectCoursesLoading);
    const [allPlans, setAllPlans] = useState([]);

    useEffect(() => {
        dispatch(fetchCoursesWithPlans());
    }, [dispatch]);

    useEffect(() => {
        // Aggregate all plans from all courses
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
            // Sort by duration
            plans.sort((a, b) => a.duration_in_days - b.duration_in_days);
            setAllPlans(plans);
        }
    }, [courses]);

    const handleBuyNow = (courseId, planId) => {
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
            <div className="min-h-screen flex items-center justify-center pt-32 bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pt-24 pb-20">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url(${hanumanBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="absolute inset-0 bg-linear-to-br from-white/97 via-white/95 to-white/90"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center mb-16 pt-8 pb-6 animate-fade-in-up">
                    {/* Decorative Top Badge */}
                    <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-100 to-orange-100 border border-orange-200 px-6 py-2 rounded-full mb-6 shadow-sm">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-orange-700 font-semibold text-sm uppercase tracking-wider">
                            Flexible Plans for Every Student
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-linear-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent leading-tight">
                        Pricing Plans
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
                        Choose the right plan based on your preparation timeline and unlock your full potential
                    </p>

                    {/* Feature Highlights */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 font-medium text-sm">AI-Powered Learning</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 font-medium text-sm">Expert Guidance 24/7</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 font-medium text-sm">Regular Updates</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Cards Grid */}
            {allPlans.length === 0 ? (
                <div className="text-center justify-center items-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Plans Available</h3>
                    <p className="text-gray-500">Pricing plans are currently being updated.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-gray-200"
                            >
                                {/* Badge */}
                                {badge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={`${colors.badge} border backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                                            {badge}
                                        </span>
                                    </div>
                                )}

                                {/* Header with Gradient */}
                                <div className={`bg-linear-to-r ${colors.bg} p-6 text-white relative`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <h3 className="text-2xl font-bold mb-2 relative z-10">
                                        {formatDuration(plan.duration_in_days)}
                                    </h3>
                                    <p className="text-sm opacity-90 relative z-10">{tagline}</p>
                                </div>

                                {/* Pricing */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        {plan.original_price > plan.price && (
                                            <span className="text-gray-400 line-through text-lg">
                                                ₹{plan.original_price.toLocaleString()}
                                            </span>
                                        )}
                                        <span className="text-4xl font-bold text-gray-900">
                                            ₹{plan.price.toLocaleString()}
                                        </span>
                                    </div>
                                    {discountPercent > 0 && (
                                        <span className="text-red-500 text-sm font-bold">
                                            Limited Offer! ({discountPercent}% OFF)
                                        </span>
                                    )}
                                    <p className="text-gray-600 text-sm mt-2">
                                        Validity: {plan.duration_in_days} Days
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="p-6 space-y-3">
                                    {/* Access Features */}
                                    {plan.access_features?.notes && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">High Yield Notes</span>
                                        </div>
                                    )}
                                    {plan.access_features?.tests && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">Mock Tests</span>
                                        </div>
                                    )}
                                    {plan.access_features?.videos && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">Video Lectures</span>
                                        </div>
                                    )}
                                    {plan.access_features?.ai_explanation && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">AI Doubt Solver (24/7)</span>
                                        </div>
                                    )}

                                    {/* Custom Features */}
                                    {plan.features_list && plan.features_list.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </div>
                                    ))}

                                    {/* Additional Features */}
                                    {plan.offer_active && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">FREE Updates During Validity ⭐</span>
                                        </div>
                                    )
                                    }
                                </div>

                                {/* Buy Button */}
                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => handleBuyNow(plan.courseId, plan.uuid || plan.plan_id || plan.id)}
                                        className={`w-full ${colors.button} text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                {/* Course Name Tag */}
                                <div className="px-6 pb-4">
                                    <span className="text-xs text-gray-500 font-medium">
                                        For {plan.courseName}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Note */}
            <div className="text-center mt-12">
                <p className="text-gray-600 text-sm">
                    All purchases are non-refundable. Please check the sample before buying.
                </p>
            </div>
        </div>
    );
}

export default PricingPage;

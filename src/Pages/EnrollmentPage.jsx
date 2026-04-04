import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enrollInCourse, selectCoursesLoading, selectCoursesError, fetchCourseDetails } from '../redux/slices/coursesSlice';
import { selectUser } from '../redux/slices/authSlice';
import TermsModal from '../Components/TermsModal';

const EnrollmentPage = () => {
    const { courseId } = useParams();
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('plan');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const loading = useSelector(selectCoursesLoading);
    const error = useSelector(selectCoursesError);

    // Mock state for plan details (In real app, fetch plan/course details)
    const [planDetails, setPlanDetails] = useState(null);
    const [showTerms, setShowTerms] = useState(false);

    useEffect(() => {
        // Fetch course details to get plan info (simplified for now)
        if (courseId) {
            dispatch(fetchCourseDetails(courseId)).then((action) => {
                if (action.payload) {
                    const foundPlan = action.payload.plans?.find(p => p.uuid === planId || p.id === planId) || { price: 499, name: 'Premium Plan' };
                    setPlanDetails(foundPlan);
                }
            });
        }
    }, [dispatch, courseId, planId]);

    const handlePaymentClick = () => {
        if (!user) {
            alert("Please login to enroll");
            navigate('/login');
            return;
        }
        setShowTerms(true);
    };

    const handleTermsAgreed = () => {
        setShowTerms(false);
        processEnrollment();
    };

    const processEnrollment = async () => {
        if (!user) {
            alert("Please login to enroll");
            navigate('/login');
            return;
        }

        const payload = {
            user_id: user.user_id || user.id,
            course_id: courseId,
            plan_id: planId,
            amount: planDetails?.price || 499,
            tax_amount: 0,
            transaction_mode: "upi",
            transaction_id: "PAYMENT_ID_" + Date.now(),
            order_id: "ORDER_" + Date.now(),
            transaction_status: "success",
            payment_date: new Date().toISOString(),
            start_date: new Date().toISOString()
        };

        const result = await dispatch(enrollInCourse(payload));
        if (enrollInCourse.fulfilled.match(result)) {
            alert("Enrollment Successful!");
            navigate('/dashboard');
        } else {
            alert("Enrollment Failed: " + (result.payload || "Unknown error"));
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Confirm Enrollment</h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Course ID:</span>
                        <span className="font-mono text-xs">{courseId}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-semibold">{planDetails?.name || 'Selected Plan'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="text-orange-800 font-bold">Total Amount:</span>
                        <span className="font-bold text-orange-600">₹{planDetails?.price || 499}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handlePaymentClick}
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-orange-200"
                    >
                        {loading ? 'Processing...' : 'Pay & Enroll (Mock UPI)'}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-3 px-4 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAgree={handleTermsAgreed}
            />
        </div>
    );
};

export default EnrollmentPage;

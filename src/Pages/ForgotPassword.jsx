import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { requestPasswordReset, verifyPasswordResetOTP, updatePassword } from '../redux/slices/authSlice';
import { showNotification } from '../redux/slices/uiSlice';

function ForgotPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (!email) {
            dispatch(showNotification({ type: 'error', message: 'Please enter your email' }));
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(requestPasswordReset(email)).unwrap();
            dispatch(showNotification({ type: 'success', message: result.message || 'OTP sent successfully' }));
            setStep(2);
        } catch (err) {
            dispatch(showNotification({ type: 'error', message: err || 'Failed to send OTP' }));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp) {
            dispatch(showNotification({ type: 'error', message: 'Please enter the OTP' }));
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(verifyPasswordResetOTP({ email, otp })).unwrap();
            dispatch(showNotification({ type: 'success', message: result.message || 'OTP verified successfully' }));
            setStep(3);
        } catch (err) {
            dispatch(showNotification({ type: 'error', message: err || 'Invalid OTP' }));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            dispatch(showNotification({ type: 'error', message: 'Please enter new password' }));
            return;
        }
        if (password !== confirmPassword) {
            dispatch(showNotification({ type: 'error', message: 'Passwords do not match' }));
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(updatePassword({ email, otp, new_password: password })).unwrap();
            dispatch(showNotification({ type: 'success', message: result.message || 'Password updated successfully' }));
            navigate('/login');
        } catch (err) {
            dispatch(showNotification({ type: 'error', message: err || 'Failed to update password' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 pt-24 sm:pt-32">
            <div className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md">
                <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
                <p className="text-gray-500 text-center mb-8">
                    {step === 1 && "Enter your email to receive an OTP"}
                    {step === 2 && "Enter the OTP sent to your email"}
                    {step === 3 && "Set your new password"}
                </p>

                {step === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-1">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center letter-spacing-2"
                                placeholder="1234"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-gray-500 hover:text-orange-500 transition"
                            >
                                Change Email
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="New Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Confirm Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Set New Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-orange-500 font-semibold hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

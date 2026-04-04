import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchUserDetails,
    updateUserProfile,
    deleteUserAccount,
    selectUserProfile,
    selectUserLoading,
    selectUserError,
} from '../redux/slices/userSlice';
import { selectUser, logoutUser } from '../redux/slices/authSlice';
import { showNotification } from '../redux/slices/uiSlice';
import { resetAMCQuiz } from '../redux/slices/quizSlice';

function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authUser = useSelector(selectUser);
    const profile = useSelector(selectUserProfile);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);

    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showResetAMCConfirm, setShowResetAMCConfirm] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null); // Stores new picture to upload
    const [profilePicturePreview, setProfilePicturePreview] = useState(null); // Preview URL
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        gender: 'male',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const userId = authUser?.user_id || authUser?.id || authUser?.uuid;
        if (userId) {
            dispatch(fetchUserDetails(userId));
        }
    }, [dispatch, authUser]);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                gender: profile.gender || 'male',
            });
            // Set profile picture preview from saved profile or localStorage
            const userId = authUser?.user_id || authUser?.id || authUser?.uuid;
            const localStorageKey = `profile_picture_${userId}`;
            const savedPicture = profile.profile_picture || localStorage.getItem(localStorageKey);

            if (savedPicture) {
                setProfilePicturePreview(savedPicture);
            } else {
            }
        }
    }, [profile, authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for the field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        let err = {};
        if (!formData.full_name.trim()) {
            err.full_name = "Full name required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.full_name.trim())) {
            err.full_name = "Name can only contain letters and spaces";
        }

        if (!formData.email) err.email = "Email required";

        if (!formData.phone) {
            err.phone = "Phone number required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            err.phone = "Phone number must be exactly 10 digits";
        }

        setFormErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const userId = authUser?.user_id || authUser?.id || authUser?.uuid;
            const updateData = {
                id: userId,
                ...formData,
            };

            // Include profile picture if changed
            if (profilePicture !== null) {
                updateData.profile_picture = profilePicture;
                // Save to localStorage as fallback
                const localStorageKey = `profile_picture_${userId}`;
                localStorage.setItem(localStorageKey, profilePicture);
            }
            const result = await dispatch(updateUserProfile(updateData)).unwrap();
            // Refetch user details to get the saved profile picture
            await dispatch(fetchUserDetails(userId));
            dispatch(showNotification({
                type: 'success',
                message: 'Profile updated successfully!',
            }));
            setIsEditing(false);
            setProfilePicture(null); // Reset pending change
        } catch (err) {
            console.error('ProfilePage: Update error:', err);
            dispatch(showNotification({
                type: 'error',
                message: err || 'Failed to update profile',
            }));
        }
    };

    const handleDelete = async () => {
        try {
            const userId = authUser?.user_id || authUser?.id || authUser?.uuid;
            await dispatch(deleteUserAccount(userId)).unwrap();

            dispatch(showNotification({
                type: 'success',
                message: 'Account deleted successfully',
            }));

            dispatch(logoutUser());
            navigate('/');
        } catch (err) {
            dispatch(showNotification({
                type: 'error',
                message: err || 'Failed to delete account',
            }));
        }
    };

    const handleResetAMC = async () => {
        try {
            const userId = authUser?.user_id || authUser?.id || authUser?.uuid;
            await dispatch(resetAMCQuiz({ user_id: userId })).unwrap();

            dispatch(showNotification({
                type: 'success',
                message: 'AMC Quiz progress reset successfully',
            }));
            setShowResetAMCConfirm(false);
        } catch (err) {
            dispatch(showNotification({
                type: 'error',
                message: err || 'Failed to reset AMC progress',
            }));
        }
    };

    const getInitials = () => {
        if (formData.full_name) {
            return formData.full_name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return 'U';
    };

    // Image compression - reduced size for smaller base64 strings
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxSize = 150; // Reduced from 300 to create smaller base64
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL('image/jpeg', 0.6); // Reduced quality from 0.8 to 0.6
                    resolve(compressed);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            dispatch(showNotification({ type: 'error', message: 'Please select an image file' }));
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            dispatch(showNotification({ type: 'error', message: 'Image must be less than 2MB' }));
            return;
        }

        try {
            setUploadingPicture(true);
            const compressed = await compressImage(file);
            setProfilePicture(compressed);
            setProfilePicturePreview(compressed);
            setUploadingPicture(false);
            dispatch(showNotification({ type: 'success', message: 'Image selected! Click Save Changes to update.' }));
        } catch (error) {
            setUploadingPicture(false);
            dispatch(showNotification({ type: 'error', message: 'Failed to process image' }));
        }
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 bg-linear-to-br from-orange-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-orange-50 to-orange-50 pt-32 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Cover Image */}
                    <div className="h-32 bg-linear-to-r from-orange-500"></div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12">
                            {/* Avatar */}
                            <div className="relative">
                                {profilePicturePreview ? (
                                    <img
                                        src={profilePicturePreview}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                                        {getInitials()}
                                    </div>
                                )}
                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            id="profile-picture-input"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="profile-picture-input"
                                            className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 rounded-full p-2 shadow-lg cursor-pointer transition transform hover:scale-110"
                                        >
                                            {uploadingPicture ? (
                                                <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </label>
                                    </>
                                )}
                            </div>

                            {/* Name and Actions */}
                            <div className="flex-1 md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">{formData.full_name || 'Student'}</h1>
                                <p className="text-gray-600 mt-1">{formData.email}</p>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                                    {profile?.has_active_subscription ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Active Student
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            Free User
                                        </span>
                                    )}
                                    <span className="text-gray-500 text-sm capitalize">
                                        {formData.gender}
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 md:mt-0 px-6 py-2 bg-linear-to-r from-orange-500 to-orange-400  text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition font-semibold"
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                {formErrors.full_name && <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>
                                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition appearance-none"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-linear-to-r from-orange-500 to-orange-400  text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:transform-none font-semibold"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving Changes...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form to profile data
                                        if (profile) {
                                            setFormData({
                                                full_name: profile.full_name || '',
                                                email: profile.email || '',
                                                phone: profile.phone || '',
                                                gender: profile.gender || 'male',
                                            });
                                        }
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>



                {/* Course Settings Zone */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-orange-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Course Settings
                    </h2>

                    <div className="flex items-start">
                        <div className="shrink-0">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-xl">🇦🇺</span>
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">AMC Course Progress</h3>
                            <p className="text-gray-600 mb-4">
                                Manage your progress for the AMC course. Resetting will clear all your quiz history and statistics for this course.
                            </p>

                            {!showResetAMCConfirm ? (
                                <button
                                    onClick={() => setShowResetAMCConfirm(true)}
                                    className="px-6 py-2 border-2 border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition font-semibold flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset AMC Progress
                                </button>
                            ) : (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-4 animate-fade-in-up">
                                    <p className="text-orange-800 font-semibold flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Are you sure? This will delete all your AMC quiz history.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleResetAMC}
                                            disabled={loading}
                                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 font-semibold shadow-md"
                                        >
                                            {loading ? 'Resetting...' : 'Yes, Reset Progress'}
                                        </button>
                                        <button
                                            onClick={() => setShowResetAMCConfirm(false)}
                                            className="px-6 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border-2 border-red-200">
                    <div className="flex items-start">
                        <div className="shrink-0">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
                            <p className="text-gray-600 mb-4">
                                Once you delete your account, there is no going back. All your data, progress, and history will be permanently removed. Please be certain.
                            </p>

                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                                >
                                    Delete Account
                                </button>
                            ) : (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-4">
                                    <p className="text-red-700 font-semibold flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Are you absolutely sure? This action cannot be undone.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleDelete}
                                            disabled={loading}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold"
                                        >
                                            {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchEnrolledCourses,
    selectEnrolledCourses,
    selectCoursesLoading,
} from '../redux/slices/coursesSlice';
import {
    fetchUserProgress,
    fetchStudyMaterials,
    fetchMCQBank,
    selectProgress,
    selectActivePlan,
    selectStudyMaterials,
    selectMCQBank,
} from '../redux/slices/dashboardSlice';
import { selectUser, logoutUser } from '../redux/slices/authSlice';
import {
    fetchUserDetails,
    selectUserProfile,
} from '../redux/slices/userSlice';
import {
    fetchRankings,
    selectTopRankings,
    selectUserRank,
    selectRankingsLoading,
} from '../redux/slices/rankingsSlice';
import { updateUserProfile } from '../redux/slices/userSlice';
import { showNotification } from '../redux/slices/uiSlice';
import Leaderboard from '../Components/Leaderboard';
import { FiCamera, FiUpload, FiUser, FiClock, FiTarget, FiEdit3, FiBookOpen, FiInbox, FiChevronRight, FiLoader } from 'react-icons/fi';
import { FaGraduationCap, FaTrophy, FaRegCircleCheck, FaCrown } from 'react-icons/fa6';
import { LuActivity } from 'react-icons/lu';

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const userProfile = useSelector(selectUserProfile);

    // Standardized User ID resolution - PRIORITIZE auth user over profile user to prevent stickiness
    const userId = user?.id || user?.user_id || user?._id || user?.uuid ||
        userProfile?.id || userProfile?.user_id || userProfile?._id || userProfile?.uuid;

    // Robust course selection from state
    const coursesSelector = useSelector((state) => state.courses.enrolledCourses);
    const courses = Array.isArray(coursesSelector) ? coursesSelector : [];

    const loading = useSelector(selectCoursesLoading);
    const progress = useSelector(selectProgress);
    const activePlan = useSelector(selectActivePlan);
    const studyMaterials = useSelector(selectStudyMaterials);
    const mcqBank = useSelector(selectMCQBank);

    const topRankings = useSelector(selectTopRankings);
    const userRank = useSelector(selectUserRank);
    const rankingsLoading = useSelector(selectRankingsLoading);

    const [activeTab, setActiveTab] = useState('courses');
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [uploadingPicture, setUploadingPicture] = useState(false);

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

            // Immediately upload
            const updateData = {
                id: userId,
                profile_picture: compressed
            };

            await dispatch(updateUserProfile(updateData)).unwrap();

            // Update local state immediately for responsiveness
            setProfilePictureUrl(compressed);

            // Refetch to ensure consistency
            dispatch(fetchUserDetails(userId));

            setUploadingPicture(false);
            dispatch(showNotification({ type: 'success', message: 'Profile picture updated!' }));
        } catch (error) {
            setUploadingPicture(false);
            dispatch(showNotification({ type: 'error', message: 'Failed to update profile picture' }));
        }
    };

    // Get the display user (prefer profile over auth user)
    const displayUser = userProfile || user;

    // Load profile picture from userProfile or localStorage
    useEffect(() => {
        if (userId) {
            const localStorageKey = `profile_picture_${userId}`;
            const savedPicture = userProfile?.profile_picture || localStorage.getItem(localStorageKey);
            setProfilePictureUrl(savedPicture);
        }
    }, [userId, userProfile]);

    // For debugging
    useEffect(() => {
        console.log('Dashboard Component State:', {
            hasUser: !!user,
            userId: userId,
            coursesCount: courses.length,
            enrolledCoursesRaw: courses
        });
    }, [user, courses, userId]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchEnrolledCourses(userId));
            dispatch(fetchUserDetails(userId));
            dispatch(fetchUserProgress(userId));
            dispatch(fetchStudyMaterials(userId));
            dispatch(fetchMCQBank(userId));
            dispatch(fetchRankings());
        } else {
        }
    }, [dispatch, userId]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleCourseClick = (courseId, courseName) => {
        // Handle specific route for FMGE
        if (courseId === 'f6dd0d25-825f-4c9c-93fe-58cae47378f3' || (courseName && courseName.trim().toUpperCase() === 'FMGE')) {
            navigate('/courses/FMGE');
            return;
        }
        navigate(`/courses/${courseId}/subjects`);
    };

    const handleSubjectClick = (subjectId) => {
        navigate(`/subjects/${subjectId}`);
    };

    const handleMaterialClick = (materialId) => {
        navigate(`/materials/${materialId}`);
    };

    const handleMCQClick = (mcqId) => {
        navigate(`/mcq/${mcqId}`);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32 px-4">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiUser className="w-12 h-12 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-500 mb-8">Please log in to securely access your student dashboard.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-linear-to-r from-orange-500 to-orange-400 text-white px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-orange-200 font-bold tracking-wide"
                    >
                        Go To Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !courses.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center">
                    <FiLoader className="w-14 h-14 text-orange-500 animate-spin mx-auto mb-6 drop-shadow-sm" />
                    <p className="text-gray-600 font-bold tracking-wide">Orchestrating Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-orange-50 to-orange-50 pt-32 pb-12">
            {/* Beautiful Profile Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Profile Content */}
                    <div className="relative px-4 sm:px-8 py-6 sm:py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 z-10 relative">
                            <div className="flex flex-col md:flex-row items-center flex-1 w-full relative">
                                {/* Avatar */}
                                <div className="relative group shrink-0 mx-auto md:mx-0">
                                {profilePictureUrl ? (
                                    <img
                                        src={profilePictureUrl}
                                        alt="Profile"
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[3px] sm:border-4 border-white"
                                    />
                                ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[3px] sm:border-4 border-white">
                                        {displayUser?.name || displayUser?.full_name ?
                                            (displayUser.name || displayUser.full_name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                            : 'ST'}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <input
                                    type="file"
                                    id="dashboard-profile-picture-input"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="dashboard-profile-picture-input"
                                    className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-orange-500 hover:bg-orange-600 rounded-full p-2 sm:p-2.5 shadow-lg cursor-pointer transition transform hover:scale-110 border-2 border-white z-10"
                                >
                                    {uploadingPicture ? (
                                        <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
                                    ) : (
                                        <FiCamera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    )}
                                </label>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 md:ml-6 mt-5 md:mt-0 text-center md:text-left w-full">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2.5">
                                        {displayUser?.name || displayUser?.full_name || 'Student'}
                                        {userProfile?.has_active_subscription && (
                                            <span className="text-orange-500 bg-orange-50 rounded-full p-1" title="Verified Premium Member">
                                                <FaRegCircleCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </span>
                                        )}
                                    </h1>
                                </div>
                                <p className="text-sm sm:text-base text-gray-500 mt-1.5 font-medium flex items-center justify-center md:justify-start gap-1.5">
                                    {displayUser?.email || 'student@fornix.com'}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                                    {userProfile?.has_active_subscription ? (
                                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-[0_2px_10px_rgba(16,185,129,0.2)] bg-gradient-to-r from-orange-500 to-orange-400 text-white border border-orange-500">
                                            <FaRegCircleCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                                            Premium Student
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm bg-gray-100 text-gray-700 border border-gray-200">
                                            <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                                            Free User
                                        </span>
                                    )}
                                    {activePlan && (
                                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-[0_2px_10px_rgba(99,102,241,0.2)] bg-gradient-to-r from-orange-500 to-orange-500 text-white border border-orange-500">
                                            <FaCrown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-yellow-300" />
                                            {activePlan}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Close the inner flex row wrapper for Avatar and Info */}
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 mt-6 md:mt-0">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="flex-1 sm:flex-none justify-center px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-bold flex items-center shadow-md cursor-pointer"
                                >
                                    <FiUser className="w-5 h-5 mr-2" />
                                    View Profile
                                </button>
                                <button
                                    onClick={() => navigate('/quiz/history')}
                                    className="flex-1 sm:flex-none justify-center px-6 py-2.5 sm:py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 hover:shadow-md transform hover:-translate-y-0.5 transition-all font-bold flex items-center shadow-sm cursor-pointer"
                                >
                                    <LuActivity className="w-5 h-5 mr-2" />
                                    Test History
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 sm:mt-10">
                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-all group relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-10 transition-all duration-500">
                                    <FaGraduationCap className="w-32 h-32 text-orange-500" />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2 text-left">Total Courses</p>
                                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-left">{courses.length}</p>
                                    </div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner border border-orange-100/50 group-hover:scale-110 transition-transform shrink-0">
                                        <FiBookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-all group relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-10 transition-all duration-500">
                                    <FiEdit3 className="w-32 h-32 text-orange-500" />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2 text-left">Tests Taken</p>
                                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-left">{progress?.quizzes_taken || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner border border-orange-100/50 group-hover:scale-110 transition-transform shrink-0">
                                        <FiEdit3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-all group relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-10 transition-all duration-500">
                                    <FiClock className="w-32 h-32 text-orange-500" />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2 text-left">Total Study Time</p>
                                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-left">{progress?.study_hours || 0}<span className="text-base sm:text-lg text-gray-400 ml-1">h</span></p>
                                    </div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner border border-orange-100/50 group-hover:scale-110 transition-transform shrink-0">
                                        <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-all group relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-10 transition-all duration-500">
                                    <FiTarget className="w-32 h-32 text-orange-500" />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2 text-left">Avg Test Score</p>
                                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-left">{progress?.average_score || 0}<span className="text-base sm:text-lg text-gray-400 ml-1">%</span></p>
                                    </div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner border border-orange-100/50 group-hover:scale-110 transition-transform shrink-0">
                                        <FiTarget className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-8">
                <div className="flex space-x-2 sm:space-x-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`px-4 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-[3px] transition-all whitespace-nowrap ${activeTab === 'courses'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                            }`}
                    >
                        Enrolled Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('progress')}
                        className={`px-4 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-[3px] transition-all whitespace-nowrap ${activeTab === 'progress'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                            }`}
                    >
                        My Progress
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>

                        </div>

                        {courses.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                    <FiInbox className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Courses Yet</h3>
                                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {courses.map((item, idx) => {
                                    // Handle potential structure variations (item might be wrapped in .course or be the course itself)
                                    const course = item.course || item;
                                    const plan = item.plan || item.enrolled_plan || item.plan_details || {};
                                    const subscription = item.subscription || (item.id && item.course_id ? item : {});
                                    // Dynamic colors based on course name (fallback logic) - MATCHING Courses.jsx
                                    const cardColor = (course.name || "").includes("NEET PG")
                                        ? "emerald"
                                        : (course.name || "").includes("NEET UG")
                                            ? "blue"
                                            : (course.name || "").includes("AMC")
                                                ? "purple"
                                                : "orange";

                                    let courseLink = `/courses/${course.id}/subjects`;
                                    if ((course.name || "").toLowerCase().includes('amc')) {
                                        courseLink = '/courses/amc';
                                    } else if ((course.name || "").toLowerCase().includes('fmge')) {
                                        courseLink = '/courses/FMGE';
                                    }

                                    return (
                                        <div
                                            key={course.id || idx}
                                            onClick={() => handleCourseClick(course.id, course.name)}
                                            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col cursor-pointer"
                                        >
                                            <div className="h-52 bg-gray-200 relative group overflow-hidden">
                                                {/* Placeholder gradient if no image */}
                                                <div
                                                    className={`absolute inset-0 bg-linear-to-br from-${cardColor}-400 to-${cardColor}-600 opacity-90 transition-opacity group-hover:opacity-100`}
                                                ></div>

                                                {/* Prioritize icon_url, fallback to image_url */}
                                                {(course.icon_url || course.image_url) && (
                                                    <img
                                                        src={course.icon_url || course.image_url}
                                                        alt={course.name}
                                                        className={`w-full h-full object-cover absolute inset-0 ${course.icon_url ? '' : 'mix-blend-overlay opacity-50'}`}
                                                    />
                                                )}

                                                <div className="absolute bottom-4 left-6 right-6">
                                                    <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 inline-block mb-2">
                                                        <span className="text-white text-xs font-bold uppercase tracking-wider px-2">
                                                            {course.category || "Enrolled"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <h3 className="text-3xl font-bold text-white drop-shadow-md leading-tight">
                                                            {course.name}
                                                        </h3>
                                                        {/* Status Badge */}
                                                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                                            Active
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed flex-1">
                                                    {course.description ||
                                                        "Comprehensive curriculum designed by top medical experts."}
                                                </p>

                                                <div className="mt-auto">
                                                    <div className="group/plan border border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:bg-orange-50 transition-all relative overflow-hidden flex justify-between items-center gap-4 mb-4">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-800">
                                                                {plan.name || "Current Plan"}
                                                            </h4>
                                                            {subscription.end_date && (
                                                                <p className="text-xs text-gray-500">
                                                                    Expires: {new Date(subscription.end_date).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                            {plan.duration_in_days && (
                                                                <p className="text-xs text-gray-500">
                                                                    Duration: {plan.duration_in_days} Days
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(courseLink);
                                                        }}
                                                        className={`w-full block text-center bg-${cardColor}-500 text-white py-4 rounded-xl font-bold hover:bg-${cardColor}-600 transition shadow-lg shadow-${cardColor}-200`}
                                                    >
                                                        Continue Learning
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Progress Tab */}
                {activeTab === 'progress' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
                        <div className="text-center py-8">
                            <p className="text-gray-500">Progress tracking will be available soon.</p>
                        </div>
                    </div>
                )}

                {/* Rankings Widget - Always Visible */}
                <div className="mt-8 sm:mt-12">
                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2 sm:gap-3 tracking-tight">
                                <span className="bg-yellow-50 p-2 sm:p-2.5 rounded-xl border border-yellow-100 shrink-0">
                                    <FaTrophy className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
                                </span>
                                Global Top Performers
                            </h2>
                            <button
                                onClick={() => navigate('/rankings')}
                                className="w-full sm:w-auto text-gray-900 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 px-4 py-2.5 sm:py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1 group transition-colors border border-gray-200 hover:border-orange-200"
                            >
                                View Complete Rankings
                                <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <Leaderboard
                            rankings={topRankings}
                            userRank={userRank}
                            totalUsers={0}
                            loading={rankingsLoading}
                            limit={5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    computeSmartTracking,
    selectSmartTrackingData,
    selectSmartTrackingLoading,
    selectSmartTrackingError
} from '../redux/slices/smartTrackingSlice';
import { selectUser } from '../redux/slices/authSlice';
import { fetchCoursesWithPlans, selectCourses } from '../redux/slices/coursesSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function SmartTrackingPage() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const data = useSelector(selectSmartTrackingData);
    const loading = useSelector(selectSmartTrackingLoading);
    const error = useSelector(selectSmartTrackingError);
    const courses = useSelector(selectCourses); // Added back just in case, though unused in UI

    // Removed explicit course selection to let backend automatically infer from subscriptions
    const [showFullPlan, setShowFullPlan] = useState(false);
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});

    const toggleSubject = (id) => setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleChapter = (id) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

    useEffect(() => {
        if (user?.id || user?.user_id) {
            const userId = user.id || user.user_id;
            dispatch(computeSmartTracking({
                userId,
                useAi: true
                // courseId omitted - relying on API auto-resolution
            }));
        }
    }, [dispatch, user]);

    // --- Chart Configurations (Minimal/Decent UI) ---
    const pacingChartData = useMemo(() => {
        if (data?.tree && data.tree.length > 0) {
            // Sort by accuracy ascending for better visual focus on weak areas
            const sorted = [...data.tree].sort((a, b) => a.accuracy - b.accuracy).slice(0, 10);
            return {
                labels: sorted.map(s => s.subject_name.length > 15 ? s.subject_name.substring(0, 15) + '...' : s.subject_name),
                datasets: [
                    {
                        label: 'Subject Accuracy (%)',
                        data: sorted.map(s => s.accuracy),
                        backgroundColor: 'rgba(249, 115, 22, 0.8)', // Orange-500
                        borderColor: 'rgba(234, 88, 12, 1)', // Orange-600
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                ]
            };
        } else if (data?.pacing?.by_subject) {
            // Fallback for V1 data
            const sorted = [...data.pacing.by_subject].sort((a, b) => b.hours_per_week - a.hours_per_week).slice(0, 10);
            return {
                labels: sorted.map(s => s.subject_name.length > 15 ? s.subject_name.substring(0, 15) + '...' : s.subject_name),
                datasets: [
                    {
                        label: 'Recommended Hours/Week',
                        data: sorted.map(s => s.hours_per_week),
                        backgroundColor: 'rgba(249, 115, 22, 0.8)', // Orange-500
                        borderColor: 'rgba(234, 88, 12, 1)', // Orange-600
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                ]
            };
        }
        return null;
    }, [data]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { font: { family: 'Inter', size: 12 } } },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50/30 pt-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-800 font-semibold mb-2">Unable to load tracking data</p>
                    <p className="text-sm text-gray-500 mb-4">{typeof error === 'string' ? error : 'Server error occurred'}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-800 text-white rounded text-sm hover:bg-slate-700">Retry</button>
                </div>
            </div>
        );
    }

    const handleForceRefresh = () => {
        if (user?.id || user?.user_id) {
            const userId = user.id || user.user_id;
            dispatch(computeSmartTracking({
                userId,
                forceRefresh: true,
                useAi: true
            }));
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/30 pt-32 pb-20 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Smart Study Tracking</h1>
                        <p className="text-orange-600 mt-1 font-medium">AI-driven insights to optimize your preparation</p>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center justify-end">
                        <button
                            onClick={handleForceRefresh}
                            disabled={loading}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 shadow-md'}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>


                {/* Key Benefits Section - Professional Design */}
                <div className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white">Why Smart Tracking Works</h2>
                            <p className="text-orange-50 mt-1">Data-driven insights that transform your preparation strategy</p>
                        </div>

                        {/* Benefits Grid */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BenefitItem
                                    title="Automatic Progress Monitoring"
                                    description="Tracks your daily and weekly study progress automatically"
                                />
                                <BenefitItem
                                    title="Subject Performance Analysis"
                                    description="Shows subject-wise performance analysis"
                                />
                                <BenefitItem
                                    title="Weak Area Identification"
                                    description="Identifies weak topics based on wrong answers"
                                />
                                <BenefitItem
                                    title="High-Yield Revision Areas"
                                    description="Suggests high-yield revision areas"
                                />
                                <BenefitItem
                                    title="Mock Test Score Trends"
                                    description="Monitors mock test score trends over time"
                                />
                                <BenefitItem
                                    title="Exam Readiness Prediction"
                                    description="Predicts readiness level for AMC Part 1"
                                />
                                <BenefitItem
                                    title="Strategic Revision Planning"
                                    description="Helps plan smart revision instead of random reading"
                                />
                                <BenefitItem
                                    title="Time vs Performance Insights"
                                    description="Time-spent vs score improvement insights"
                                />
                                <BenefitItem
                                    title="Personalized Recommendations"
                                    description="Personalized improvement recommendations"
                                />
                                <BenefitItem
                                    title="Goal Tracking & Accountability"
                                    description="Keeps you accountable with goal tracking"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {data && (
                    <div className="space-y-8">
                        {/* --- NEW! ADVANCED AI EXAM DIAGNOSTIC REPORT --- */}
                        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden text-white relative">
                            {/* Background glow effect */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

                            {/* Header Strip */}
                            <div className="bg-slate-800/80 border-b border-slate-700/50 px-8 py-4 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                    <h2 className="text-lg font-bold text-slate-200 tracking-wide">AI Smart Diagnostic Report</h2>
                                </div>
                            </div>

                            <div className="p-8 relative z-10">
                                {/* Top Analysis Layer */}
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                                    <div className="col-span-1 border-b lg:border-b-0 lg:border-r border-slate-700/60 pb-8 lg:pb-0 lg:pr-8 flex flex-col items-center justify-center relative">

                                        {/* Circular Progress Avatar */}
                                        {(() => {
                                            const suggestions = data?.ai_suggestions?.suggestions || {
                                                chance_to_pass_percentage: 0,
                                                chance_to_pass_verdict: "Awaiting Data",
                                                executive_summary: "Gathering enough data to compute probability. Please complete more quizzes.",
                                                recommended_timeline: [],
                                                high_yield_interventions: [],
                                                time_management_tips: "Focus on creating a daily routine.",
                                                motivation: "Consistent study is the key to success."
                                            };
                                            const passPercent = suggestions.chance_to_pass_percentage || suggestions.exam_readiness_score || 0;
                                            const verdict = String(suggestions.chance_to_pass_verdict || '');
                                            const isHigh = passPercent >= 70 || verdict.includes('High');
                                            const isMod = !isHigh && (passPercent >= 40 || verdict.includes('Moderate'));
                                            const label = suggestions.chance_to_pass_verdict || (isHigh ? 'High Pass Chance' : 'Needs Work');

                                            // Dynamic colors for the State Card
                                            const bgClass = isHigh ? 'bg-green-500/10 border-green-500/40 shadow-[0_4px_20px_rgba(34,197,94,0.2)]' : (isMod ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_4px_20px_rgba(249,115,22,0.2)]' : 'bg-red-500/10 border-red-500/40 shadow-[0_4px_20px_rgba(239,68,68,0.2)]');
                                            const colorClass = isHigh ? 'text-green-400' : (isMod ? 'text-orange-400' : 'text-red-400');
                                            const ringGlow = isHigh ? 'drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]' : (isMod ? 'drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]');

                                            // Build robust user identity
                                            const emailName = typeof user?.email === 'string' ? user.email.split('@')[0] : '';
                                            const fallbackName = user?.user_metadata?.full_name || user?.user_metadata?.name || emailName || "Premium Scholar";
                                            const profilePicUrl = user?.user_metadata?.avatar_url || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=1e293b&color=ffffff&size=150&font-size=0.33`;

                                            return (
                                                <div className="flex flex-col items-center w-full">

                                                    {/* Avatar Ring Module */}
                                                    <div className="relative w-44 h-44 flex flex-col items-center justify-center mb-6 pt-2 group">
                                                        {/* SVG Progress Border */}
                                                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none" viewBox="0 0 176 176">
                                                            {/* Red/Incomplete Track */}
                                                            <circle cx="88" cy="88" r="82" fill="none" stroke="#ef4444" strokeWidth="6" className="opacity-30" />
                                                            {/* Green/Completed Track */}
                                                            <circle cx="88" cy="88" r="82" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray={`${(passPercent / 100) * 515} 515`} className={`transition-all duration-1500 ease-out ${ringGlow}`} strokeLinecap="round" />
                                                        </svg>

                                                        {/* Actual Profile Picture */}
                                                        <div className="absolute inset-0 m-auto w-36 h-36 rounded-full overflow-hidden border-4 border-slate-900 z-10 shadow-inner bg-slate-800 transition-transform duration-500 group-hover:scale-105">
                                                            <img src={profilePicUrl} alt={fallbackName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User&background=0D1117&color=fff'; }} />
                                                        </div>

                                                        {/* Percentage Floating Badge */}
                                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-full px-4 py-1 z-30 flex items-baseline gap-1 group-hover:-translate-y-1 transition-transform duration-300">
                                                            <span className="text-xl font-black text-white">{passPercent}<span className="text-sm text-slate-400">%</span></span>
                                                        </div>
                                                    </div>

                                                    {/* Student Identity */}
                                                    <h3 className="text-xl font-bold text-white tracking-tight text-center px-2 truncate w-full mb-1 uppercase">{fallbackName}</h3>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center mb-5 border-b border-slate-700/50 pb-4 w-3/4">Applicant Profile</p>

                                                    {/* Animated State Card */}
                                                    <div className={`w-full max-w-[200px] text-center text-xs font-black px-4 py-3 rounded-xl uppercase tracking-widest border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${bgClass} ${colorClass}`}>
                                                        {label}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="col-span-3 lg:pl-4 pl-0 flex flex-col justify-center">
                                        <h4 className="text-orange-400 font-bold text-lg mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            Top Level Diagnosis
                                        </h4>
                                        <p className="text-slate-200 text-base leading-relaxed mb-6 font-medium">
                                            {(data?.ai_suggestions?.suggestions || {}).executive_summary || (data?.ai_suggestions?.suggestions || {}).study_strategy || "Analyzing your tracked performance. Complete more quizzes for deeper insights."}
                                        </p>

                                        {(data?.ai_suggestions?.suggestions || {}).time_management_tips && (
                                            <div className="bg-slate-800/80 rounded-xl p-5 border border-orange-500/30 flex gap-4 items-start shadow-inner">
                                                <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-lg shrink-0">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-slate-100 mb-1">Time & Test Strategy</h5>
                                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{(data?.ai_suggestions?.suggestions || {}).time_management_tips}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actionable Vectors Grid - SCROLLABLE & COMPACT */}
                                {((Array.isArray((data?.ai_suggestions?.suggestions || {}).recommended_timeline) && (data?.ai_suggestions?.suggestions || {}).recommended_timeline.length > 0) || (Array.isArray((data?.ai_suggestions?.suggestions || {}).high_yield_interventions) && (data?.ai_suggestions?.suggestions || {}).high_yield_interventions.length > 0)) && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-slate-700/50 pt-8 mt-4">

                                        {/* Timeline Side */}
                                        {Array.isArray((data?.ai_suggestions?.suggestions || {}).recommended_timeline) && (data?.ai_suggestions?.suggestions || {}).recommended_timeline.length > 0 && (
                                            <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700/40">
                                                <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-5 uppercase tracking-widest text-xs border-b border-slate-700/50 pb-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> Recommended Timeline
                                                </h4>
                                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                    {(data?.ai_suggestions?.suggestions || {}).recommended_timeline.map((step, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start bg-slate-800 p-4 rounded-xl border border-slate-700/50 shadow-sm hover:border-orange-500/30 transition-colors">
                                                            <div className="flex-shrink-0 w-16 text-center mt-0.5">
                                                                <span className="text-xs font-black text-orange-400 uppercase tracking-widest">{step.timeframe || `Step ${idx + 1}`}</span>
                                                            </div>
                                                            <div className="border-l-2 border-slate-600/50 pl-4 w-full">
                                                                <h5 className="font-bold text-slate-200 text-sm">{step.focus || "Focus Objective"}</h5>
                                                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed bg-slate-900/50 p-2 rounded-md border border-slate-700/30">{step.action}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* High Yield Side */}
                                        {Array.isArray((data?.ai_suggestions?.suggestions || {}).high_yield_interventions) && (data?.ai_suggestions?.suggestions || {}).high_yield_interventions.length > 0 && (
                                            <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700/40">
                                                <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-5 uppercase tracking-widest text-xs border-b border-slate-700/50 pb-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Focus Areas
                                                </h4>
                                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                    {(data?.ai_suggestions?.suggestions || {}).high_yield_interventions.map((intervention, idx) => (
                                                        <div key={idx} className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                                                            <h5 className="font-bold text-red-400 text-sm mb-2 ml-3">{intervention.topic || "Core Subject"}</h5>
                                                            <p className="text-xs text-slate-300 mb-3 ml-3 leading-relaxed">
                                                                <span className="text-slate-500 font-semibold block mb-0.5 opacity-80 uppercase tracking-wider text-[10px]">Why it matters</span>
                                                                {intervention.reason}
                                                            </p>
                                                            <div className="ml-3 block bg-red-500/10 text-red-300 text-xs px-3 py-2 rounded-lg font-medium border border-red-500/20 shadow-inner">
                                                                <span className="font-bold text-red-400 mr-1">Fix:</span> {intervention.action}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* Motivation Footer */}
                                <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-center text-center">
                                    <p className="text-slate-400 font-serif italic text-sm px-4">"{(data?.ai_suggestions?.suggestions || {}).motivation || 'Start studying today!'}"</p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Cards - Clean, Minimal */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <MetricCard label={data?.metrics?.overall_accuracy !== undefined ? "Avg Accuracy" : "Avg Quiz Score"} value={`${data?.metrics?.overall_accuracy ?? data?.metrics?.avg_quiz_score ?? 0}%`} sub="Performance score" />
                            <MetricCard label={data?.metrics?.total_attempted_questions !== undefined ? "Attempted Qs" : "Weekly Hours"} value={data?.metrics?.total_attempted_questions ?? data?.pacing?.weekly_hours ?? 0} sub={data?.metrics?.total_attempted_questions !== undefined ? `Out of ${data?.metrics?.total_questions_in_course ?? 0} total` : "Recommended study time"} />
                            <MetricCard label={data?.metrics?.overall_completion !== undefined ? "Completion %" : "Total Weeks"} value={data?.metrics?.overall_completion !== undefined ? `${data?.metrics?.overall_completion}%` : (data?.pacing?.total_weeks ?? 0)} sub={data?.metrics?.overall_completion !== undefined ? "Course coverage" : "Until completion"} />
                            <MetricCard label="Weak Areas" value={data?.recommendations?.summary?.total_weak_chapters ?? data?.weaknesses?.length ?? 0} sub={!!data?.pacing ? "High priority topics" : "High priority chapters"} />
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Pacing & Weaknesses */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Accuracy Chart */}
                                <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">{!!data?.pacing ? "Suggested Pacing" : "Subject Accuracy Insights"}</h3>
                                    <div className="h-64">
                                        {pacingChartData && <Bar options={chartOptions} data={pacingChartData} />}
                                    </div>
                                </div>

                                {/* Targeted Priority Map */}
                                <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 shrink-0">{!!data?.pacing ? 'Recommended Study Plan' : 'Chapter Revision Checklist'}</h3>
                                    <div className="max-h-[400px] overflow-y-auto pr-4 pb-2 custom-scrollbar flex-1">
                                        <div className="relative border-l-2 border-orange-200 ml-3 space-y-8 pt-2">
                                            {/* V2 Checklist */}
                                            {(data?.recommendations?.priority_chapters || []).slice(0, showFullPlan ? undefined : 6).map((item, idx) => (
                                                <div key={idx} className="relative pl-6">
                                                    <span className={`absolute -left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${item.severity === 'critical' ? 'bg-red-500' : item.severity === 'weak' ? 'bg-orange-500' : 'bg-orange-500'}`}></span>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5">
                                                        <h4 className="text-base font-bold text-slate-800">{item.chapter_name}</h4>
                                                        <span className="text-[10px] font-black bg-orange-50 px-2 py-0.5 rounded uppercase tracking-widest text-orange-600 border border-orange-100/50 mt-1 sm:mt-0">{item.accuracy}% Accuracy</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-500 mb-2">{item.subject_name}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 font-medium">{item.attempted_questions} attempt / {item.total_questions} total</span>
                                                        <span className="text-xs bg-red-50 border border-red-100 px-2.5 py-1 rounded-md text-red-600 font-bold">{item.wrong} Mistakes</span>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* V1 Timeline Fallback */}
                                            {(data?.study_plan || []).slice(0, showFullPlan ? undefined : 5).map((item, idx) => (
                                                <div key={idx} className="relative pl-6">
                                                    <span className="absolute -left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-orange-500 shadow-sm"></span>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5">
                                                        <h4 className="text-base font-bold text-slate-800">{item.area_name}</h4>
                                                        <span className="text-[10px] font-black bg-orange-50 px-2 py-0.5 rounded uppercase tracking-widest text-orange-600 border border-orange-100/50 mt-1 sm:mt-0">{item.weeks} Weeks • {item.hours_per_week} hrs/wk</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-500 mb-2">{item.milestone}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(item.topics || []).map((t, i) => (
                                                            <span key={i} className="text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 font-medium">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {((data?.recommendations?.priority_chapters?.length > 6) || (data?.study_plan?.length > 5)) && (
                                        <button
                                            onClick={() => setShowFullPlan(!showFullPlan)}
                                            className="w-full mt-4 text-center text-xs uppercase tracking-widest text-orange-600 hover:text-orange-700 font-bold border-t border-orange-100 pt-3 transition-colors shrink-0"
                                        >
                                            {showFullPlan ? 'Collapse Plan' : 'View Full List'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Weaknesses & Actions */}
                            <div className="space-y-8">

                                {/* Next Actions */}
                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg shadow-orange-200">
                                    <h3 className="text-lg font-bold mb-4 text-white">Recommended Actions</h3>
                                    <ul className="space-y-3">
                                        {(data?.recommendations?.next_actions || data?.next_actions || []).map((action, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-orange-50">
                                                <span className="mt-1 text-white font-bold">➜</span>
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Focus Areas</h3>
                                    <div className="space-y-4 max-h-[530px] overflow-y-auto pr-2 custom-scrollbar">
                                        {/* V2 priority topics */}
                                        {(data?.recommendations?.priority_topics || []).map((w, idx) => (
                                            <div key={idx} className={`p-3 border rounded-lg ${w.severity === 'critical' ? 'bg-red-50/50 border-red-100' : 'bg-orange-50/50 border-orange-100'}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-gray-800 text-sm break-words flex-1 pr-2">{w.topic_name}</span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap ${w.severity === 'critical' ? 'text-red-600 bg-red-100' : 'text-orange-600 bg-orange-100'}`}>
                                                        {w.severity === 'critical' ? 'Critical' : 'Weak'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{w.reason}</p>
                                            </div>
                                        ))}

                                        {/* V1 Weaknesses */}
                                        {(data?.weaknesses || []).map((w, idx) => (
                                            <div key={`w1-${idx}`} className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-gray-800 text-sm">{w.area_name}</span>
                                                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">{w.severity > 3 ? 'High Priority' : 'Needs Review'}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{w.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- NEW! Curriculum Tree Explorer --- */}
                        {data?.tree && data.tree.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-12 mb-8">
                                <div className="bg-slate-50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">Curriculum Explorer</h2>
                                    <span className="text-sm text-gray-500 font-medium">{data.metrics?.total_questions_in_course} Total Questions</span>
                                </div>
                                <div className="p-2 sm:p-6 divide-y divide-gray-100">
                                    {data.tree.map((subject) => (
                                        <div key={subject.subject_id} className="py-2">
                                            {/* Subject Level */}
                                            <div
                                                onClick={() => toggleSubject(subject.subject_id)}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`transform transition-transform ${expandedSubjects[subject.subject_id] ? 'rotate-90' : ''}`}>
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                    </div>
                                                    <h3 className="font-bold text-lg text-slate-800">{subject.subject_name}</h3>
                                                </div>
                                                <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-8 sm:ml-0">
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">Attempted</div>
                                                        <div className="font-medium text-slate-700">{subject.attempted_questions} / {subject.total_questions}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-orange-500 uppercase font-semibold">Unattempted</div>
                                                        <div className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{subject.not_attempted}</div>
                                                    </div>
                                                    <div className="text-right w-16">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">Accuracy</div>
                                                        <div className={`font-bold ${subject.accuracy >= 70 ? 'text-green-600' : subject.accuracy >= 40 ? 'text-orange-500' : 'text-red-500'}`}>{subject.accuracy}%</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chapters Level */}
                                            {expandedSubjects[subject.subject_id] && (
                                                <div className="ml-6 sm:ml-12 border-l-2 border-slate-100 pl-2 sm:pl-4 mt-2 space-y-2">
                                                    {(subject.chapters || []).map((chapter) => (
                                                        <div key={chapter.chapter_id}>
                                                            <div
                                                                onClick={() => toggleChapter(chapter.chapter_id)}
                                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-slate-50 rounded-md cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`transform transition-transform text-gray-400 ${expandedChapters[chapter.chapter_id] ? 'rotate-90' : ''}`}>
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                                    </div>
                                                                    <h4 className="font-semibold text-slate-700">{chapter.chapter_name}</h4>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-2 sm:mt-0 ml-6 sm:ml-0 text-sm">
                                                                    <span className="text-gray-600">{chapter.attempted_questions} attempting</span>
                                                                    <span className="text-gray-300">|</span>
                                                                    <span className="text-orange-600 font-medium">{chapter.not_attempted} unattempted</span>
                                                                    <span className="text-gray-300">|</span>
                                                                    <span className={`font-bold ${chapter.accuracy >= 70 ? 'text-green-600' : 'text-red-500'}`}>{chapter.accuracy}%</span>
                                                                </div>
                                                            </div>

                                                            {/* Topics Level */}
                                                            {expandedChapters[chapter.chapter_id] && (
                                                                <div className="ml-6 border-l border-slate-100 pl-4 mt-2 mb-4 space-y-1">
                                                                    {(chapter.topics || []).map((topic) => (
                                                                        <div key={topic.topic_id} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded text-sm group">
                                                                            <span className="text-slate-600 font-medium group-hover:text-orange-600 transition-colors">{topic.topic_name}</span>
                                                                            <div className="flex gap-4">
                                                                                <span className="text-gray-500">{topic.total_questions} total Qs</span>
                                                                                <span className="text-orange-500 w-24 text-right">{topic.not_attempted} untouched</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {(!chapter.topics || chapter.topics.length === 0) && (
                                                                        <p className="text-xs text-gray-400 italic py-2">No topic breakdowns available.</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

function BenefitItem({ title, description }) {
    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, sub }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">{label}</span>
            <div>
                <span className="text-3xl font-bold text-orange-600 block mb-1">{value}</span>
                <span className="text-xs text-gray-400">{sub}</span>
            </div>
        </div>
    );
}

export default SmartTrackingPage;

// force vite update

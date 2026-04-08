import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    FaBookOpen, FaBullseye, FaChartLine, FaFire, FaCheckCircle,
    FaExclamationTriangle, FaArrowUp, FaArrowDown, FaTrophy,
    FaLightbulb, FaRedo, FaChevronRight, FaChevronDown,
    FaClipboardCheck, FaClock, FaStar, FaRocket, FaBrain
} from 'react-icons/fa';
import {
    computeSmartTracking,
    selectSmartTrackingData,
    selectSmartTrackingLoading,
    selectSmartTrackingError
} from '../redux/slices/smartTrackingSlice';
import { selectUser } from '../redux/slices/authSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// ════════════════════════════════════════════════════════════════
// SMART TRACKING PAGE V2.1
// "Study Less, Score More — Focus Only on Weak Areas"
// ════════════════════════════════════════════════════════════════

function SmartTrackingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const data = useSelector(selectSmartTrackingData);
    const loading = useSelector(selectSmartTrackingLoading);
    const error = useSelector(selectSmartTrackingError);

    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [showAllWeak, setShowAllWeak] = useState(false);
    const [showAllStrong, setShowAllStrong] = useState(false);

    const toggleSubject = (id) => setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleChapter = (id) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

    useEffect(() => {
        if (user?.id || user?.user_id) {
            const userId = user.id || user.user_id;
            dispatch(computeSmartTracking({
                userId,
                useAi: true
            }));
        }
    }, [dispatch, user]);

    // Derived data
    const classification = data?.chapter_classification;
    const studyPlan = data?.study_plan;
    const improvement = data?.improvement;
    const metrics = data?.metrics;
    const meta = data?.meta;

    // Totals from classification
    const totalStrong = classification?.strong_chapters?.length || 0;
    const totalWeak = classification?.weak_chapters?.length || 0;
    const allStrong = totalWeak === 0 && totalStrong > 0;

    // Chart data
    const subjectChartData = useMemo(() => {
        if (!data?.tree?.length) return null;
        const sorted = [...data.tree].sort((a, b) => a.accuracy - b.accuracy).slice(0, 10);
        return {
            labels: sorted.map(s => s.subject_name.length > 18 ? s.subject_name.substring(0, 18) + '…' : s.subject_name),
            datasets: [{
                label: 'Accuracy (%)',
                data: sorted.map(s => s.accuracy),
                backgroundColor: sorted.map(s => s.accuracy >= 60 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
                borderColor: sorted.map(s => s.accuracy >= 60 ? 'rgba(22, 163, 74, 1)' : 'rgba(220, 38, 38, 1)'),
                borderWidth: 1,
                borderRadius: 6,
            }]
        };
    }, [data]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { family: 'Inter', size: 13 },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } }
        }
    };

    // Doughnut chart for strong/weak ratio
    const strengthDoughnut = useMemo(() => {
        if (!classification) return null;
        return {
            labels: ['Strong', 'Weak'],
            datasets: [{
                data: [totalStrong, totalWeak],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 0,
                cutout: '72%',
            }]
        };
    }, [classification, totalStrong, totalWeak]);

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

    // Loading
    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-orange-50/20 pt-32">
                <div className="flex flex-col items-center gap-6">
                    {/* Brain + analysis animated SVG */}
                    <div className="relative w-40 h-40">
                        {/* Outer slow rotation */}
                        <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 6s linear infinite' }} viewBox="0 0 160 160" fill="none">
                            <circle cx="80" cy="80" r="74" stroke="#fed7aa" strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" />
                        </svg>
                        {/* Mid ring counter-rotation */}
                        <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 3s linear infinite reverse' }} viewBox="0 0 160 160" fill="none">
                            <circle cx="80" cy="80" r="58" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="6 12" strokeLinecap="round" opacity="0.6" />
                        </svg>
                        {/* Brain SVG in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
                                    {/* Brain left hemisphere */}
                                    <path d="M32 14c-2-4-8-5-12-2s-5 9-3 13c-4 1-7 5-6 9s5 7 9 6c0 3 2 6 5 7s7 0 9-3" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#fff7ed" />
                                    {/* Brain right hemisphere */}
                                    <path d="M32 14c2-4 8-5 12-2s5 9 3 13c4 1 7 5 6 9s-5 7-9 6c0 3-2 6-5 7s-7 0-9-3" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#fff7ed" />
                                    {/* Center fold */}
                                    <line x1="32" y1="14" x2="32" y2="44" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
                                    {/* Neural sparks */}
                                    <circle cx="20" cy="28" r="2" fill="#f97316" style={{ animation: 'neuronPulse 1.2s ease-in-out infinite' }} />
                                    <circle cx="44" cy="28" r="2" fill="#f97316" style={{ animation: 'neuronPulse 1.2s ease-in-out 0.4s infinite' }} />
                                    <circle cx="32" cy="22" r="2" fill="#f97316" style={{ animation: 'neuronPulse 1.2s ease-in-out 0.8s infinite' }} />
                                    <circle cx="24" cy="38" r="1.5" fill="#fb923c" style={{ animation: 'neuronPulse 1.5s ease-in-out 0.2s infinite' }} />
                                    <circle cx="40" cy="38" r="1.5" fill="#fb923c" style={{ animation: 'neuronPulse 1.5s ease-in-out 0.6s infinite' }} />
                                    {/* Connecting lines */}
                                    <line x1="20" y1="28" x2="32" y2="22" stroke="#fed7aa" strokeWidth="1" strokeLinecap="round" style={{ animation: 'neuronPulse 1.2s ease-in-out infinite' }} />
                                    <line x1="44" y1="28" x2="32" y2="22" stroke="#fed7aa" strokeWidth="1" strokeLinecap="round" style={{ animation: 'neuronPulse 1.2s ease-in-out 0.4s infinite' }} />
                                    <line x1="20" y1="28" x2="24" y2="38" stroke="#fed7aa" strokeWidth="1" strokeLinecap="round" style={{ animation: 'neuronPulse 1.5s ease-in-out 0.2s infinite' }} />
                                    <line x1="44" y1="28" x2="40" y2="38" stroke="#fed7aa" strokeWidth="1" strokeLinecap="round" style={{ animation: 'neuronPulse 1.5s ease-in-out 0.6s infinite' }} />
                                </svg>
                            </div>
                        </div>
                        {/* Orbiting analysis dots */}
                        <div className="absolute inset-0" style={{ animation: 'spin 2.5s linear infinite' }}>
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500 shadow shadow-orange-300"></div>
                        </div>
                        <div className="absolute inset-0" style={{ animation: 'spin 2.5s linear infinite reverse', animationDelay: '0.8s' }}>
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-300"></div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-800 font-bold text-lg">Analyzing Your Performance</p>
                        <p className="text-gray-500 text-sm mt-1">Building personalized insights from your data…</p>
                    </div>

                    {/* Animated bar chart */}
                    <div className="flex items-end gap-1.5 h-10">
                        {[6, 9, 5, 10, 7, 8, 4, 9, 6].map((h, i) => (
                            <div
                                key={i}
                                className="w-2.5 rounded-full bg-orange-400"
                                style={{
                                    height: `${h * 4}px`,
                                    animation: `barPulse 1.2s ease-in-out ${i * 0.1}s infinite`,
                                    opacity: 0.7,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes neuronPulse { 0%,100% { opacity: 0.3; r: 1.5; } 50% { opacity: 1; r: 2.5; } }
                    @keyframes barPulse { 0%,100% { transform: scaleY(0.5); opacity: 0.4; } 50% { transform: scaleY(1.2); opacity: 1; } }
                `}</style>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-red-500 text-xl" />
                    </div>
                    <p className="text-gray-900 font-bold text-lg mb-2">Unable to Load Data</p>
                    <p className="text-sm text-gray-500 mb-6">{typeof error === 'string' ? error : 'Server error occurred'}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-orange-50/20 pt-20 sm:pt-32 pb-20 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ═══════ Page Header ═══════ */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                <FaBrain className="text-white text-lg" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Smart Tracker</h1>
                            {meta?.version && (
                                <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{meta.version}</span>
                            )}
                        </div>
                        <p className="text-gray-500 font-medium text-sm md:text-base ml-[52px]">
                            Study less, score more — focus only on weak areas
                        </p>
                    </div>
                    <button
                        onClick={handleForceRefresh}
                        disabled={loading}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shrink-0 ${loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                            }`}
                    >
                        <FaRedo className={`text-xs ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing…' : 'Refresh Analysis'}
                    </button>
                </div>

                {data && (
                    <div className="space-y-8">

                        {/* ═══════ SUCCESS STATE: All Chapters Strong 🎉 ═══════ */}
                        {allStrong && (
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl shadow-green-200 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-4 left-8 text-6xl">🎉</div>
                                    <div className="absolute bottom-4 right-8 text-6xl">🏆</div>
                                    <div className="absolute top-1/2 left-1/4 text-4xl">⭐</div>
                                    <div className="absolute top-1/3 right-1/4 text-4xl">🌟</div>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                        <FaTrophy className="text-4xl text-yellow-300" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black mb-3">All Chapters Are Strong! 🎉</h2>
                                    <p className="text-green-50 text-lg font-medium max-w-xl mx-auto">
                                        You've mastered all {totalStrong} chapters. Keep revising to maintain your edge and aim for even higher accuracy!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ═══════ Section 1: Dashboard Metrics ═══════ */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <DashCard
                                icon={<FaBullseye />}
                                label="Overall Accuracy"
                                value={`${metrics?.overall_accuracy ?? 0}%`}
                                sub={`${metrics?.total_correct ?? 0} correct out of ${metrics?.total_attempted_questions ?? 0}`}
                                color="orange"
                            />
                            <DashCard
                                icon={<FaClipboardCheck />}
                                label="Completion"
                                value={`${metrics?.overall_completion ?? 0}%`}
                                sub={`${metrics?.total_attempted_questions ?? 0} / ${metrics?.total_questions_in_course ?? 0} questions`}
                                color="blue"
                            />
                            <DashCard
                                icon={<FaCheckCircle />}
                                label="Strong Chapters"
                                value={totalStrong}
                                sub={`≥ 60% accuracy`}
                                color="green"
                            />
                            <DashCard
                                icon={<FaExclamationTriangle />}
                                label="Weak Chapters"
                                value={totalWeak}
                                sub={`< 60% accuracy`}
                                color="red"
                            />
                        </div>

                        {/* ═══════ Section 2: Improvement Tracking ═══════ */}
                        {improvement && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <FaChartLine className="text-purple-500 text-sm" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Progress Since Last Analysis</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {/* Before Score */}
                                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Previous Score</p>
                                            <p className="text-3xl font-black text-gray-400">{improvement.previous_score}%</p>
                                        </div>
                                        {/* After Score */}
                                        <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-100">
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Current Score</p>
                                            <p className="text-3xl font-black text-green-600">{improvement.current_score}%</p>
                                        </div>
                                        {/* Improvement */}
                                        <div className="text-center p-4 bg-orange-50 rounded-xl">
                                            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Improvement</p>
                                            <p className={`text-3xl font-black flex items-center justify-center gap-2 ${improvement.improvement_percentage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {improvement.improvement_percentage >= 0 ? <FaArrowUp className="text-lg" /> : <FaArrowDown className="text-lg" />}
                                                {improvement.improvement_percentage >= 0 ? '+' : ''}{improvement.improvement_percentage}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Improved chapters list */}
                                    {improvement.improved_chapters?.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <FaArrowUp className="text-green-500" />
                                                {improvement.improved_chapters.length} chapter{improvement.improved_chapters.length > 1 ? 's' : ''} improved
                                                {improvement.weak_to_strong_count > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-black">
                                                        {improvement.weak_to_strong_count} went from Weak → Strong
                                                    </span>
                                                )}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {improvement.improved_chapters.slice(0, 6).map((ch, i) => (
                                                    <span key={i} className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-medium border border-green-100">
                                                        {ch.chapter_name}: {ch.from}% → {ch.to}%
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══════ Section 3: Today's Focus (Study Plan) ═══════ */}
                        {studyPlan && studyPlan.chapters?.length > 0 && (
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-screen filter blur-[80px] opacity-10 pointer-events-none"></div>

                                <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                            <FaFire className="text-orange-400 text-sm" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Today's Focus</h3>
                                            <p className="text-slate-400 text-xs">{studyPlan.date}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-black uppercase tracking-wider">
                                        {studyPlan.priority} priority
                                    </span>
                                </div>

                                <div className="p-6">
                                    <p className="text-slate-300 text-sm mb-6 font-medium">{studyPlan.message}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {studyPlan.chapters.map((ch, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/50 hover:border-orange-500/40 transition-all group cursor-pointer"
                                                onClick={() => navigate(`/chapters/${ch.chapter_id}`)}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Focus #{idx + 1}</span>
                                                    <span className="text-xs text-red-400 font-bold">{ch.current_percentage}%</span>
                                                </div>
                                                <h4 className="text-white font-bold text-base mb-1 group-hover:text-orange-300 transition-colors line-clamp-2">
                                                    {ch.chapter_name}
                                                </h4>
                                                <p className="text-slate-400 text-xs mb-4">{ch.subject_name}</p>
                                                <div className="flex gap-2 mt-auto">
                                                    {ch.attempted_questions > 0 ? (
                                                        <>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/chapters/${ch.chapter_id}/topics`, { state: { activeTab: 'notes', courseId: metrics?.course_id || null } }); }}
                                                                className="flex-1 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                                            >
                                                                <FaBookOpen className="text-[10px]" /> Improve
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/quiz/start?chapterId=${ch.chapter_id}`); }}
                                                                className="flex-1 py-2 bg-orange-500/40 text-orange-50 border border-orange-500/40 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-orange-500/60 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                                            >
                                                                <FaChevronRight className="text-[10px]" /> Retest
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/chapters/${ch.chapter_id}`); }}
                                                            className="w-full py-2 bg-orange-500/20 text-orange-300 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <FaBookOpen className="text-[10px]" /> Start Study
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════ Section 4: AI Diagnostic Report ═══════ */}
                        {data?.ai_suggestions && (
                            <AIDiagnosticSection data={data} user={user} overallAccuracy={metrics?.overall_accuracy ?? 0} />
                        )}

                        {/* ═══════ Section 4b: Per-Subject Dashboard with Progress Bars ═══════ */}
                        {data?.tree && data.tree.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50">
                                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        <FaChartLine className="text-orange-500" /> Subject-wise Performance
                                    </h3>
                                </div>
                                <div className="p-4 sm:p-6 space-y-4">
                                    {data.tree.map((subject) => (
                                        <div key={subject.subject_id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h4 className="font-bold text-gray-800 text-sm truncate">{subject.subject_name}</h4>
                                                    <p className="text-xs text-gray-400">{subject.total_chapters} chapters · {subject.total_questions} questions</p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {subject.strong_count > 0 && (
                                                        <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                                                            {subject.strong_count} Strong
                                                        </span>
                                                    )}
                                                    {subject.weak_count > 0 && (
                                                        <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">
                                                            {subject.weak_count} Weak
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${subject.accuracy >= 60 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                                                        style={{ width: `${Math.min(subject.accuracy, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-sm font-black min-w-[48px] text-right ${subject.accuracy >= 60 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {subject.accuracy}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═══════ Main Content Grid ═══════ */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left Column: Chart + Weak Chapters */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Subject Accuracy Chart */}
                                {subjectChartData && (
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <FaChartLine className="text-orange-500" /> Subject Accuracy
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/70 inline-block"></span> ≥60%</span>
                                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/70 inline-block"></span> &lt;60%</span>
                                            </div>
                                        </div>
                                        <div className="h-64">
                                            <Bar options={chartOptions} data={subjectChartData} />
                                        </div>
                                    </div>
                                )}

                                {/* Weak Chapters Grid */}
                                {classification?.weak_chapters?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                <FaExclamationTriangle className="text-red-500" />
                                                Weak Chapters
                                                <span className="text-sm font-normal text-gray-400">({totalWeak})</span>
                                            </h3>
                                        </div>
                                        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(showAllWeak ? classification.weak_chapters : classification.weak_chapters.slice(0, 6)).map((ch, idx) => (
                                                <WeakChapterCard key={idx} chapter={ch} navigate={navigate} courseId={metrics?.course_id || null} />
                                            ))}
                                        </div>
                                        {classification.weak_chapters.length > 6 && (
                                            <div className="px-6 pb-4">
                                                <button
                                                    onClick={() => setShowAllWeak(!showAllWeak)}
                                                    className="w-full text-center text-xs uppercase tracking-widest text-orange-600 hover:text-orange-700 font-bold border-t border-gray-100 pt-4 transition-colors"
                                                >
                                                    {showAllWeak ? 'Show Less' : `View All ${totalWeak} Weak Chapters`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Doughnut + Strong + Actions */}
                            <div className="space-y-6">

                                {/* Strength Ratio Doughnut */}
                                {strengthDoughnut && (totalStrong + totalWeak > 0) && (
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaStar className="text-yellow-500" /> Chapter Strength
                                        </h3>
                                        <div className="w-40 h-40 mx-auto relative">
                                            <Doughnut data={strengthDoughnut} options={{ plugins: { legend: { display: false } }, cutout: '72%' }} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-black text-gray-900">{totalStrong + totalWeak}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">Chapters</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-6 mt-4">
                                            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> {totalStrong} Strong
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> {totalWeak} Weak
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Recommended Actions */}
                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg shadow-orange-200/50">
                                    <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                        <FaRocket /> Next Actions
                                    </h3>
                                    <ul className="space-y-3">
                                        {(data?.recommendations?.next_actions || []).map((action, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-orange-50">
                                                <span className="mt-0.5 text-white font-bold shrink-0">➜</span>
                                                <span className="leading-relaxed">{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Strong Chapters (Collapsed) */}
                                {classification?.strong_chapters?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                                                <FaCheckCircle className="text-green-500" />
                                                Strong Chapters
                                                <span className="text-sm font-normal text-gray-400">({totalStrong})</span>
                                            </h3>
                                            <button
                                                onClick={() => setShowAllStrong(!showAllStrong)}
                                                className="text-xs text-gray-400 hover:text-gray-600 font-semibold flex items-center gap-1"
                                            >
                                                {showAllStrong ? 'Hide' : 'Show'}
                                                {showAllStrong ? <FaChevronDown className="text-[8px]" /> : <FaChevronRight className="text-[8px]" />}
                                            </button>
                                        </div>
                                        {showAllStrong && (
                                            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                                                {classification.strong_chapters.map((ch, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50/70 rounded-xl border border-green-100/70">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-800 truncate">{ch.chapter_name}</p>
                                                            <p className="text-xs text-gray-500">{ch.subject_name}</p>
                                                        </div>
                                                        <span className="text-green-600 font-bold text-sm ml-3 shrink-0">{ch.percentage}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ═══════ Section 7: Curriculum Explorer ═══════ */}
                        {data?.tree && data.tree.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-slate-50 px-6 sm:px-8 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <FaBookOpen className="text-orange-500" /> Curriculum Explorer
                                    </h2>
                                    <span className="text-sm text-gray-500 font-medium">{metrics?.total_questions_in_course} Total Questions</span>
                                </div>
                                <div className="p-2 sm:p-6 divide-y divide-gray-100">
                                    {data.tree.map((subject) => (
                                        <div key={subject.subject_id} className="py-2">
                                            {/* Subject Level */}
                                            <div
                                                onClick={() => toggleSubject(subject.subject_id)}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`transform transition-transform ${expandedSubjects[subject.subject_id] ? 'rotate-90' : ''}`}>
                                                        <FaChevronRight className="text-gray-400 text-sm" />
                                                    </div>
                                                    <h3 className="font-bold text-lg text-slate-800">{subject.subject_name}</h3>
                                                    {subject.strong_count > 0 && (
                                                        <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">{subject.strong_count} strong</span>
                                                    )}
                                                    {subject.weak_count > 0 && (
                                                        <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">{subject.weak_count} weak</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-8 sm:ml-0">
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">Attempted</div>
                                                        <div className="font-medium text-slate-700">{subject.attempted_questions} / {subject.total_questions}</div>
                                                    </div>
                                                    <div className="text-right w-16">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">Accuracy</div>
                                                        <div className={`font-bold ${subject.accuracy >= 60 ? 'text-green-600' : 'text-red-500'}`}>{subject.accuracy}%</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chapters */}
                                            {expandedSubjects[subject.subject_id] && (
                                                <div className="ml-6 sm:ml-12 border-l-2 border-slate-100 pl-2 sm:pl-4 mt-2 space-y-2">
                                                    {(subject.chapters || []).map((chapter) => (
                                                        <div key={chapter.chapter_id}>
                                                            <div
                                                                onClick={() => toggleChapter(chapter.chapter_id)}
                                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`transform transition-transform text-gray-400 ${expandedChapters[chapter.chapter_id] ? 'rotate-90' : ''}`}>
                                                                        <FaChevronRight className="text-xs" />
                                                                    </div>
                                                                    <h4 className="font-semibold text-slate-700">{chapter.chapter_name}</h4>
                                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${chapter.status === 'strong' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                                        {chapter.status}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-2 sm:mt-0 ml-6 sm:ml-0 text-sm">
                                                                    <span className="text-gray-600 hidden lg:inline">{chapter.attempted_questions} attempted</span>
                                                                    <span className="text-gray-300 hidden lg:inline">|</span>
                                                                    <span className={`font-bold min-w-[36px] text-right ${chapter.accuracy >= 60 ? 'text-green-600' : 'text-red-500'}`}>{chapter.accuracy}%</span>
                                                                    
                                                                    <div className="flex gap-1 ml-2">
                                                                        {chapter.attempted_questions > 0 ? (
                                                                            <>
                                                                                <button 
                                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/chapters/${chapter.chapter_id}/topics`, { state: { activeTab: 'notes', courseId: metrics?.course_id || null } }); }}
                                                                                    className="text-[10px] px-2 py-1 bg-orange-100/50 text-orange-600 border border-orange-200 rounded hover:bg-orange-100 transition-colors cursor-pointer"
                                                                                >
                                                                                    Improve
                                                                                </button>
                                                                                <button 
                                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/quiz/start?chapterId=${chapter.chapter_id}`); }}
                                                                                    className="text-[10px] px-2 py-1 bg-orange-500 text-white border border-orange-500 rounded hover:bg-orange-600 transition-colors cursor-pointer"
                                                                                >
                                                                                    Retest
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <button 
                                                                                onClick={(e) => { e.stopPropagation(); navigate(`/chapters/${chapter.chapter_id}`); }}
                                                                                className="text-[10px] px-2 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded hover:bg-orange-100 transition-colors flex items-center justify-center"
                                                                            >
                                                                                Study
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Topics */}
                                                            {expandedChapters[chapter.chapter_id] && (
                                                                <div className="ml-6 border-l border-slate-100 pl-4 mt-2 mb-4 space-y-1">
                                                                    {(chapter.topics || []).map((topic) => (
                                                                        <div key={topic.topic_id} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded text-sm group">
                                                                            <span className="text-slate-600 font-medium group-hover:text-orange-600 transition-colors">{topic.topic_name}</span>
                                                                            <div className="flex gap-4">
                                                                                <span className="text-gray-500">{topic.total_questions} Qs</span>
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


// ════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════

function DashCard({ icon, label, value, sub, color }) {
    const colorMap = {
        orange: 'bg-orange-50 text-orange-500 border-orange-100',
        blue: 'bg-blue-50 text-blue-500 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        red: 'bg-red-50 text-red-500 border-red-100',
    };
    const iconBg = {
        orange: 'bg-orange-100 text-orange-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
    };
    return (
        <div className={`rounded-2xl p-4 sm:p-5 border ${colorMap[color]} transition-all hover:shadow-md`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${iconBg[color]}`}>
                {icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>
        </div>
    );
}

function WeakChapterCard({ chapter, navigate, courseId }) {
    return (
        <div
            className="p-4 bg-red-50/60 rounded-xl border border-red-100 hover:border-red-200 cursor-pointer group transition-all hover:shadow-sm"
            onClick={() => navigate(`/chapters/${chapter.chapter_id}`)}
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition-colors flex-1 pr-2 line-clamp-2">
                    {chapter.chapter_name}
                </h4>
                <span className="text-red-600 font-black text-lg shrink-0">{chapter.percentage}%</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{chapter.subject_name}</p>
            <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex gap-2">
                    <span className="text-[10px] bg-white/80 border border-red-100 px-2 py-0.5 rounded-md text-red-600 font-semibold">
                        {chapter.attempted_questions}/{chapter.total_questions} attempted
                    </span>
                </div>
                {chapter.attempted_questions > 0 ? (
                    <div className="flex gap-1.5 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/chapters/${chapter.chapter_id}/topics`, { state: { activeTab: 'notes', courseId } }); }}
                            className="text-[10px] px-2.5 py-1 bg-orange-100/50 text-orange-600 border border-orange-200 rounded-md font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                            Improve
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/quiz/start?chapterId=${chapter.chapter_id}`); }}
                            className="text-[10px] px-2.5 py-1 bg-orange-500 text-white border border-orange-500 rounded-md font-bold hover:bg-orange-600 shadow-sm transition-colors cursor-pointer"
                        >
                            Retest
                        </button>
                    </div>
                ) : (
                    <button className="text-[11px] text-orange-600 font-bold flex items-center gap-1 hover:text-orange-700 bg-orange-50 px-2 py-1.5 rounded-md border border-orange-100 shrink-0">
                        Study <FaChevronRight className="text-[8px]" />
                    </button>
                )}
            </div>
        </div>
    );
}

function AIDiagnosticSection({ data, user, overallAccuracy = 0 }) {
    const suggestions = data?.ai_suggestions?.suggestions || {
        chance_to_pass_percentage: 0,
        chance_to_pass_verdict: "Awaiting Data",
        executive_summary: "Complete more quizzes for deeper insights.",
        recommended_timeline: [],
        high_yield_interventions: [],
        time_management_tips: "Focus on creating a daily routine.",
        motivation: "Consistent study is the key."
    };

    // Use OVERALL ACCURACY for the ring (not AI pass prediction)
    const ringPercent = overallAccuracy;
    const passPercent = suggestions.chance_to_pass_percentage || 0;
    const verdict = String(suggestions.chance_to_pass_verdict || '');
    const isHigh = ringPercent >= 70;
    const isMod = !isHigh && ringPercent >= 40;
    const label = suggestions.chance_to_pass_verdict || (isHigh ? 'High Pass Chance' : 'Needs Work');

    const bgClass = isHigh ? 'bg-green-500/10 border-green-500/40' : (isMod ? 'bg-orange-500/10 border-orange-500/40' : 'bg-red-500/10 border-red-500/40');
    const colorClass = isHigh ? 'text-green-400' : (isMod ? 'text-orange-400' : 'text-red-400');
    const ringGlow = isHigh ? 'drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]' : (isMod ? 'drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]');

    const emailName = typeof user?.email === 'string' ? user.email.split('@')[0] : '';
    const fallbackName = user?.user_metadata?.full_name || user?.user_metadata?.name || emailName || "Premium Scholar";
    const profilePicUrl = user?.user_metadata?.avatar_url || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=1e293b&color=ffffff&size=150&font-size=0.33`;

    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

            <div className="bg-slate-800/80 border-b border-slate-700/50 px-6 sm:px-8 py-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <FaBrain className="text-orange-400" />
                    <h2 className="text-lg font-bold text-slate-200 tracking-wide">AI Smart Diagnostic Report</h2>
                </div>
            </div>

            <div className="p-6 sm:p-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    {/* Avatar Column */}
                    <div className="col-span-1 border-b lg:border-b-0 lg:border-r border-slate-700/60 pb-8 lg:pb-0 lg:pr-8 flex flex-col items-center justify-center">
                        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6 group">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none" viewBox="0 0 176 176">
                                <circle cx="88" cy="88" r="82" fill="none" stroke="#ef4444" strokeWidth="6" className="opacity-30" />
                                <circle cx="88" cy="88" r="82" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray={`${(ringPercent / 100) * 515} 515`} className={`transition-all duration-1500 ease-out ${ringGlow}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 m-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-slate-900 z-10 bg-slate-800">
                                <img src={profilePicUrl} alt={fallbackName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User&background=0D1117&color=fff'; }} />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-600 rounded-full px-4 py-1 z-30">
                                <span className="text-xl font-black text-white">{ringPercent}<span className="text-sm text-slate-400">%</span></span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white text-center truncate w-full mb-1 uppercase">{fallbackName}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center mb-4">Applicant Profile</p>
                        <div className={`w-full max-w-[200px] text-center text-xs font-black px-4 py-3 rounded-xl uppercase tracking-widest border ${bgClass} ${colorClass}`}>
                            {label}
                        </div>
                    </div>

                    {/* Diagnosis Column */}
                    <div className="col-span-3 lg:pl-4 flex flex-col justify-center">
                        <h4 className="text-orange-400 font-bold text-lg mb-3 flex items-center gap-2">
                            <FaLightbulb /> Top Level Diagnosis
                        </h4>
                        <p className="text-slate-200 text-base leading-relaxed mb-6 font-medium">
                            {suggestions.executive_summary}
                        </p>

                        {suggestions.time_management_tips && (
                            <div className="bg-slate-800/80 rounded-xl p-5 border border-orange-500/30 flex gap-4 items-start shadow-inner">
                                <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-lg shrink-0">
                                    <FaClock className="text-lg" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-slate-100 mb-1">Time & Test Strategy</h5>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{suggestions.time_management_tips}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline & Interventions */}
                {(suggestions.recommended_timeline?.length > 0 || suggestions.high_yield_interventions?.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-slate-700/50 pt-8 mt-4">
                        {suggestions.recommended_timeline?.length > 0 && (
                            <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700/40">
                                <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-5 uppercase tracking-widest text-xs border-b border-slate-700/50 pb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> Recommended Timeline
                                </h4>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    {suggestions.recommended_timeline.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                                            <div className="flex-shrink-0 w-16 text-center mt-0.5">
                                                <span className="text-xs font-black text-orange-400 uppercase tracking-widest">{step.timeframe || `Step ${idx + 1}`}</span>
                                            </div>
                                            <div className="border-l-2 border-slate-600/50 pl-4 w-full">
                                                <h5 className="font-bold text-slate-200 text-sm">{step.focus}</h5>
                                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.action}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {suggestions.high_yield_interventions?.length > 0 && (
                            <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700/40">
                                <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-5 uppercase tracking-widest text-xs border-b border-slate-700/50 pb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Focus Areas
                                </h4>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    {suggestions.high_yield_interventions.map((intervention, idx) => (
                                        <div key={idx} className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                                            <h5 className="font-bold text-red-400 text-sm mb-2 ml-3">{intervention.topic}</h5>
                                            <p className="text-xs text-slate-300 mb-3 ml-3 leading-relaxed">
                                                <span className="text-slate-500 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Why it matters</span>
                                                {intervention.reason}
                                            </p>
                                            <div className="ml-3 bg-red-500/10 text-red-300 text-xs px-3 py-2 rounded-lg font-medium border border-red-500/20">
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
                    <p className="text-slate-400 font-serif italic text-sm px-4">"{suggestions.motivation}"</p>
                </div>
            </div>
        </div>
    );
}

export default SmartTrackingPage;

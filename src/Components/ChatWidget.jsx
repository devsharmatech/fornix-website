import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    toggleChat,
    sendMessageToAI,
    addUserMessage,
    resetSession,
    restoreSession,
    fetchChatSessions,
    fetchSessionMessages,
    selectChatMessages,
    selectChatLoading,
    selectChatSessionId,
    selectChatIsOpen,
    selectChatSessions,
    selectCourseContext,
    setCourseContext
} from '../redux/slices/chatSlice';
import { selectUser } from '../redux/slices/authSlice';
import { FiMessageSquare, FiSend, FiX, FiClock } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import trainerAvatar from '../assets/ai-trainer-avatar.png';

const ChatWidget = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const messages = useSelector(selectChatMessages);
    const loading = useSelector(selectChatLoading);
    const sessionId = useSelector(selectChatSessionId);
    const isOpen = useSelector(selectChatIsOpen);
    const user = useSelector(selectUser);

    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const sessions = useSelector(selectChatSessions);
    const [showHistory, setShowHistory] = useState(false);

    // Course selector state
    const [selectedCourse, setSelectedCourse] = useState('General');

    const courseOptions = [
        { value: 'General', label: '🌐 General' },
        { value: 'AMC', label: '🇦🇺 AMC' },
        { value: 'NEET UG', label: '🎓 NEET UG' },
        { value: 'NEET PG', label: '🏥 NEET PG' },
        { value: 'FMGE', label: '🇮🇳 FMGE' },
        { value: 'PLAB', label: '🇬🇧 PLAB' },
    ];

    // Helper to detect course from query
    const detectCourseFromQuery = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('amc') || lowerText.includes('australian medical council')) return 'AMC';
        if (lowerText.includes('neet ug') || lowerText.includes('undergraduate')) return 'NEET UG';
        if (lowerText.includes('neet pg') || lowerText.includes('postgraduate')) return 'NEET PG';
        if (lowerText.includes('fmge') || lowerText.includes('foreign medical')) return 'FMGE';
        if (lowerText.includes('plab') || lowerText.includes('PLAB') || lowerText.includes('uk medical')) return 'PLAB';
        return null;
    };

    useEffect(() => {
        const userId = user?.user_id || user?.id;
        if (isOpen && userId) {
            dispatch(fetchChatSessions(userId));
        }
    }, [isOpen, user, dispatch]);

    // Load session from storage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('chatSessionId');
        const savedCourse = localStorage.getItem('chatCourseContext');

        if (savedSession) {
            dispatch(restoreSession(savedSession));
            dispatch(fetchSessionMessages(savedSession));
        }

        if (savedCourse) {
            dispatch(setCourseContext(savedCourse));
        }
    }, [dispatch]);

    // Auto-detect course from URL on change, but prioritize active session
    useEffect(() => {
        if (sessionId) return; // Don't change context if in an active session

        const path = location.pathname;
        let newCourse = null;

        if (path.includes('/courses/amc')) {
            newCourse = 'AMC';
        } else if (path.includes('/courses/neet-ug')) {
            newCourse = 'NEET UG';
        } else if (path.includes('/courses/neet-pg')) {
            newCourse = 'NEET PG';
        } else if (path.includes('/courses/fmge')) {
            newCourse = 'FMGE';
        } else if (path.includes('/courses/')) {
            newCourse = 'PLAB';
        } else if (path === '/' || path === '/dashboard') {
            // Reset to General only on main pages, keep context otherwise if navigating deeply?
            // Actually, safer to default to General if not in a course route to avoid confusion
            newCourse = 'General'; // Set newCourse to General
        }

        if (newCourse && newCourse !== selectedCourse) {
            dispatch(setCourseContext(newCourse));
        }
    }, [location.pathname, sessionId, selectedCourse, dispatch]);

    // Save context and session to localStorage
    useEffect(() => {
        if (sessionId) {
            localStorage.setItem('chatSessionId', sessionId);
        } else {
            localStorage.removeItem('chatSessionId'); // Clear if sessionId becomes null
        }
        if (selectedCourse) {
            localStorage.setItem('chatCourseContext', selectedCourse);
        } else {
            localStorage.removeItem('chatCourseContext'); // Clear if selectedCourse becomes null
        }
    }, [sessionId, selectedCourse]);

    const handleSessionClick = (sessionId) => {
        dispatch(fetchSessionMessages(sessionId));
        setShowHistory(false);
    };

    const handleNewChat = () => {
        dispatch(resetSession());
        localStorage.removeItem('chatSessionId');
        localStorage.removeItem('chatCourseContext');
        setShowHistory(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!showHistory) {
            scrollToBottom();
        }
    }, [messages, isOpen, showHistory]);

    const renderMessageText = (text) => {
        if (!text) return null;

        // Split by bold patterns **text**
        const parts = text.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Remove asterisks and render as bold/heading-style
                const content = part.slice(2, -2);
                return (
                    <strong key={i} className="block mt-4 mb-2 text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3 py-1 bg-orange-50/50 rounded-r-md tracking-tight">
                        {content}
                    </strong>
                );
            }
            return <span key={i} className="text-gray-700 leading-relaxed">{part}</span>;
        });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Determine course to send
        let courseToSend = selectedCourse;

        // Always try to infer from query to allow cross-course questions
        const detected = detectCourseFromQuery(input);
        if (detected) {
            courseToSend = detected;
            // Update state so UI reflects the new context if needed, or keep it as is?
            // User might be confused if the UI suddenly changes "General" to "AMC" just by asking one question
            // But it's helpful feedback. Let's update it for consistency.
            if (detected !== selectedCourse) {
                setSelectedCourse(detected);
            }
        }

        dispatch(addUserMessage(input));
        dispatch(sendMessageToAI({
            userId: user?.user_id || user?.id || 'guest',
            query: input,
            courseName: courseToSend,
            sessionId: sessionId
        }));
        setInput('');
    };

    if (!user) return null; // Or show prompt to login
    
    // Hide chat widget on the quiz taking page, as requested by user
    if (location.pathname.startsWith('/quiz/taking')) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-auto">
            {/* Chat Window */}
            <div
                className={`bg-white/90 backdrop-blur-xl h-0 w-0  ${isOpen && "h-[600px] max-w-[calc(100vw-2rem)] max-h-[85vh] w-[400px]"}  rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform origin-bottom-right mb-4 overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 p-5 flex justify-between items-center text-white shrink-0 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-inner shrink-0 bg-white">
                            <img src={trainerAvatar} alt="Fornix AI Trainer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base tracking-tight text-white leading-tight">Fornix AI Trainer</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-orange-50 font-medium uppercase tracking-widest leading-none">Online</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (!showHistory) {
                                    dispatch(fetchChatSessions(user?.user_id || user?.id));
                                }
                                setShowHistory(!showHistory);
                            }}
                            className="hover:bg-white/20 p-2 rounded-full transition-colors"
                            title="History"
                        >
                            <FiClock className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => dispatch(toggleChat())}
                            className="hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <FiX className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {showHistory ? (
                        <div className="absolute inset-0 bg-white z-10 flex flex-col">
                            <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
                                <h4 className="font-bold text-gray-700">Unified History</h4>
                                <button onClick={handleNewChat} className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full hover:bg-orange-600 shadow-sm font-medium">
                                    + New Chat
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {sessions.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm mt-10">No history found</p>
                                ) : (
                                    sessions.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => handleSessionClick(session.id)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all ${sessionId === session.id ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50/30'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="font-semibold text-gray-800 text-sm block mb-0.5">{session.course_name || 'General'}</span>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{new Date(session.started_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">Session ID: {session.id.slice(0, 8)}...</p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50/30 flex flex-col" style={{ height: '100%' }}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 rounded-3xl text-sm transition-all duration-300 ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-br-none shadow-md shadow-orange-200'
                                            : 'bg-white/80 backdrop-blur-sm border border-orange-100/50 text-gray-700 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                                            {msg.sender === 'user' ? <span className="font-medium">{msg.text}</span> : renderMessageText(msg.text)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-orange-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area (Hide when in History view) */}
                {!showHistory && (
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-orange-100 shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-gray-50"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200 flex items-center justify-center"
                            >
                                <FiSend className="w-4 h-4 ml-[-2px] mt-[1px]" />
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={() => dispatch(toggleChat())}
                className={`bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-[0_5px_15px_rgba(234,88,12,0.4)] transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'rotate-90 opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
            >
                <FiMessageSquare className="w-7 h-7" />
            </button>

            {/* Alternative Close Button when open (optional, often toggle inside header is enough but FAB could morph) */}
            {/* For now, just the header close button handles closing */}
        </div>
    );
};

export default ChatWidget;

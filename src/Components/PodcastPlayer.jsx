import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import AudioPlayer from './AudioPlayer';

const PodcastPlayer = ({ podcast }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const user = useSelector(selectUser);
    const videoRef = useRef(null);

    // Determine if it's video or audio
    const isVideo = podcast.media_type === 'video';

    // Screenshot prevention: pause video when page loses focus
    useEffect(() => {
        if (!isVideo || !isExpanded) return;

        const handleVisibilityChange = () => {
            if (document.hidden && videoRef.current) {
                videoRef.current.pause();
            }
        };

        // Detect potential screenshot attempts (limited browser support)
        const handleKeyDown = (e) => {
            // Common screenshot shortcuts: PrtScn, Win+Shift+S, Cmd+Shift+4
            if (e.key === 'PrintScreen' ||
                (e.metaKey && e.shiftKey && (e.key === '4' || e.key === '3')) ||
                (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey))) {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVideo, isExpanded]);

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-1">{podcast.title}</h4>
                    {podcast.description && (
                        <p className="text-white/80 text-sm mb-2">{podcast.description}</p>
                    )}
                    {podcast.topics && podcast.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {podcast.topics.map((topic, idx) => (
                                <span key={idx} className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold ml-3">
                    {isVideo ? '🎥 Video' : '🎵 Audio'}
                </span>
            </div>

            {/* Play/Expand Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                {isExpanded ? (
                    <>
                        <span>▼</span> Hide Player
                    </>
                ) : (
                    <>
                        <span>▶</span> {isVideo ? 'Play Video' : 'Play Audio'}
                    </>
                )}
            </button>

            {/* Media Player */}
            {isExpanded && (
                <div className="mt-4 relative group">
                    {isVideo ? (
                        <>
                            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
                                <div className="opacity-20 text-white font-bold text-2xl rotate-12 whitespace-nowrap select-none">
                                    {Array(15).fill(`${user?.name || 'Fornix'} • ${user?.email || 'Protected Content'} • `).map((text, i) => (
                                        <div key={i} className="mb-16 transform -translate-x-1/4">{text}{text}</div>
                                    ))}
                                </div>
                            </div>
                            <video
                                ref={videoRef}
                                controls
                                controlsList="nodownload noremoteplayback" // Disable download and casting
                                onContextMenu={(e) => e.preventDefault()} // Disable right-click
                                className="w-full rounded-lg relative z-0"
                                src={podcast.media_url}
                                disablePictureInPicture // Disable PiP
                                playsInline // Prevent fullscreen on mobile
                            >
                                Your browser does not support the video tag.
                            </video>
                        </>
                    ) : (
                        <AudioPlayer audioUrl={podcast.media_url} />
                    )}
                </div>
            )}
        </div>
    );
};

export default PodcastPlayer;

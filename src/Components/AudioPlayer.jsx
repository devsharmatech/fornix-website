import { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ audioUrl, autoPlay = false }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleEnded);

        const hasValidSource = audioUrl && typeof audioUrl === 'string' && audioUrl.trim().length > 0;
        if (hasValidSource && (isPlaying || autoPlay)) {
            audio.play().then(() => setIsPlaying(true)).catch(err => {
                if (err.name !== 'AbortError') console.error("Auto-play failed:", err);
            });
        }

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!audioRef.current || !audioUrl) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => { if (err.name !== 'AbortError') console.error("Play failed:", err); });
        }
    };

    const seek = (seconds) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = ratio * duration;
    };

    const formatTime = (t) => {
        if (!t || isNaN(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full bg-orange-50 border border-orange-200 rounded-xl p-3 mt-2">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Progress bar */}
            <div
                className="w-full h-2 bg-orange-200 rounded-full cursor-pointer mb-2 touch-none"
                onClick={handleProgressClick}
            >
                <div
                    className="h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-100 pointer-events-none"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Time + Controls row */}
            <div className="flex items-center justify-between gap-2">
                {/* Time */}
                <span className="text-[10px] text-gray-500 tabular-nums min-w-[60px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => seek(-10)}
                        className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white border border-orange-200 text-orange-700 text-[10px] font-semibold hover:bg-orange-50 transition"
                        title="Rewind 10s"
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V7l-4-4 4-4v2.03A9 9 0 0 1 12.5 3z"/><text x="7" y="16" fontSize="7" fontWeight="bold" fill="currentColor">10</text></svg>
                        10s
                    </button>

                    <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow transition"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>
                        ) : (
                            <svg className="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                        )}
                    </button>

                    <button
                        onClick={() => seek(10)}
                        className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white border border-orange-200 text-orange-700 text-[10px] font-semibold hover:bg-orange-50 transition"
                        title="Forward 10s"
                    >
                        10s
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 3a9 9 0 1 1-9 9h2a7 7 0 1 0 7-7V7l4-4-4-4v2.03A9 9 0 0 0 11.5 3z"/><text x="7" y="16" fontSize="7" fontWeight="bold" fill="currentColor">10</text></svg>
                    </button>
                </div>

                {/* Spacer to balance time label */}
                <span className="min-w-[60px]" />
            </div>
        </div>
    );
};

export default AudioPlayer;


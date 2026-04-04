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

        // Auto-play on URL change if it was already playing or explicitly requested
        // Only if we have a valid source
        const hasValidSource = audioUrl && typeof audioUrl === 'string' && audioUrl.trim().length > 0;
        
        if (hasValidSource && (isPlaying || autoPlay)) {
            audio.play().then(() => setIsPlaying(true)).catch(err => {
                // Ignore AbortError which happens on rapid clicks
                if (err.name !== 'AbortError') {
                    console.error("Auto-play failed:", err);
                }
            });
        }

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioUrl]); // Depend on audioUrl to trigger on change

    const togglePlay = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                    if (err.name !== 'AbortError') {
                        console.error("Manual toggle play failed:", err);
                    }
                });
        }
    };

    const forward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(
                audioRef.current.currentTime + 10,
                duration
            );
        }
    };

    const backward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(
                audioRef.current.currentTime - 10,
                0
            );
        }
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current) return;
        const progressBar = e.currentTarget;
        const clickX = e.nativeEvent.offsetX;
        const width = progressBar.offsetWidth;
        const newTime = (clickX / width) * duration;
        audioRef.current.currentTime = newTime;
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-lg p-4 mt-3 border border-orange-200">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Progress Bar */}
            <div
                className="w-full bg-gray-200 rounded-full h-2 mb-3 cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
            >
                <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-xs text-gray-600 mb-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                    onClick={backward}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-semibold shadow-sm text-xs sm:text-sm"
                    title="Rewind 10 seconds"
                >
                    ⏪ 10s
                </button>
                <button
                    onClick={togglePlay}
                    className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-md flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                    {isPlaying ? (
                        <>
                            <span>⏸</span> Pause
                        </>
                    ) : (
                        <>
                            <span>▶</span> Play
                        </>
                    )}
                </button>
                <button
                    onClick={forward}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-semibold shadow-sm text-xs sm:text-sm"
                    title="Forward 10 seconds"
                >
                    10s ⏩
                </button>
            </div>
        </div>
    );
};

export default AudioPlayer;

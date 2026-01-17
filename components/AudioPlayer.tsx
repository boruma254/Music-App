"use client";

import { useState } from "react";

interface AudioPlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

export default function AudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}: AudioPlayerProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="h-20 bg-gray-950 border-t border-gray-800 flex items-center justify-center">
        <p className="text-gray-500">No track selected</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-gradient-to-r from-gray-950 to-gray-900 border-t border-gray-800 flex flex-col">
      {/* Progress Bar */}
      <div className="flex-shrink-0 h-1 bg-gray-800 cursor-pointer group">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 group-hover:shadow-lg transition"
          style={{ width: `${progressPercent}%` }}
          onMouseDown={(e) => {
            const rect = e.currentTarget.parentElement!.getBoundingClientRect();
            const newTime = ((e.clientX - rect.left) / rect.width) * duration;
            onSeek(newTime);
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-between px-6 py-3">
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {currentTrack.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentTrack.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mx-6">
          {/* Previous */}
          <button
            onClick={onPrevious}
            className="text-gray-400 hover:text-white transition"
            title="Previous track"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              <path d="M14.5 2a.5.5 0 01.5.5v15a.5.5 0 01-1 0V2.5a.5.5 0 01.5-.5z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center justify-center text-white transition transform hover:scale-105"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                className="w-5 h-5 ml-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.75 1.5a.75.75 0 00-.75.75v15.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V2.25a.75.75 0 00-.75-.75h-1.5zm6.5 0a.75.75 0 00-.75.75v15.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V2.25a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="text-gray-400 hover:text-white transition"
            title="Next track"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.7 2.841A1.5 1.5 0 0016 4.11V15.89a1.5 1.5 0 01-2.3 1.269l-9.344-5.89a1.5 1.5 0 010-2.538l9.344-5.89z" />
              <path d="M5.5 2a.5.5 0 00-.5.5v15a.5.5 0 001 0V2.5a.5.5 0 00-.5-.5z" />
            </svg>
          </button>
        </div>

        {/* Time and Volume */}
        <div className="flex items-center gap-4 ml-6">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-gray-400 hover:text-white transition"
              title="Volume"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                {volume === 0 ? (
                  <path d="M10.5 1.5H9a.5.5 0 00-.5.5v3.362a3 3 0 01-1.946-2.806A3 3 0 103.5 9v2a5 5 0 008.646 3.854l-1.415-1.415A3 3 0 1011 6.362V1.5z" />
                ) : (
                  <path d="M9.383 3.076A1 1 0 0110 2h0a1 1 0 01.981.615l2.22 6.238a1 1 0 01-.642 1.23l-.391.12a1 1 0 01-1.192-.78l-.015-.048a1 1 0 00-.948-.656h-.748a1 1 0 00-.948.656l-.015.048a1 1 0 01-1.192.78l-.391-.12a1 1 0 01-.642-1.23l2.22-6.238z" />
                )}
              </svg>
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="h-24 w-1 accent-purple-600 cursor-pointer"
                  style={{
                    writingMode: "vertical-rl" as const,
                    transform: "rotate(180deg)",
                  }}
                />
                <span className="text-xs text-gray-400 text-center">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Track } from "@/types";

interface TrackListItemProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlay: () => void;
}

export default function TrackListItem({
  track,
  index,
  isPlaying,
  isCurrentTrack,
  onPlay,
}: TrackListItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded transition ${
        isCurrentTrack
          ? "bg-purple-600 bg-opacity-20 border border-purple-500"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={onPlay}
          className="text-gray-400 hover:text-white transition w-8 flex items-center justify-center"
          title={isCurrentTrack && isPlaying ? "Playing" : "Play"}
        >
          {isCurrentTrack && isPlaying ? (
            // Playing animation
            <div className="flex gap-1 items-center">
              <div
                className="h-1 w-1 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-1 w-1 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-1 w-1 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <p
            className={`font-medium ${isCurrentTrack ? "text-purple-300" : "text-white"}`}
          >
            {index + 1}. {track.name}
          </p>
          <p className="text-sm text-gray-300">{track.artist}</p>
        </div>
      </div>

      <span className="text-sm text-gray-400 ml-4">
        {Math.floor(track.duration / 60)}:
        {String(track.duration % 60).padStart(2, "0")}
      </span>
    </div>
  );
}

"use client";

import { Track } from "@/types";
import { useEffect, useState } from "react";

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
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteTrackIds") || "[]";
      const ids = JSON.parse(raw) as string[];
      setIsFavorite(ids.includes(track.id));
    } catch {
      setIsFavorite(false);
    }
  }, [track.id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem("favoriteTrackIds") || "[]";
      const ids = new Set<string>(JSON.parse(raw) as string[]);
      if (ids.has(track.id)) ids.delete(track.id);
      else ids.add(track.id);
      const next = Array.from(ids);
      localStorage.setItem("favoriteTrackIds", JSON.stringify(next));
      setIsFavorite(!isFavorite);
    } catch {
      // no-op
    }
  };

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

      <div className="flex items-center gap-3 ml-4">
        <button
          onClick={toggleFavorite}
          className={`transition ${isFavorite ? "text-pink-300" : "text-gray-400 hover:text-white"}`}
          title={isFavorite ? "Unfavorite" : "Favorite"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <span className="text-sm text-gray-400 whitespace-nowrap">
          {Math.floor(track.duration / 60)}:
          {String(track.duration % 60).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

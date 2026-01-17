"use client";

import { useEffect, useState } from "react";
import { Playlist } from "@/types";
import { musicService } from "@/services/musicService";

export default function PlaylistsTab() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    musicService.getPlaylists().then(setPlaylists);
  }, []);

  return (
    <div className="overflow-auto h-full p-8">
      <h2 className="text-3xl font-bold mb-6">Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition"
          >
            <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="font-semibold text-lg">{playlist.name}</h3>
            <p className="text-sm text-gray-400 mt-2">{playlist.description}</p>
            <p className="text-xs text-gray-500 mt-3">
              {playlist.tracks} tracks
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

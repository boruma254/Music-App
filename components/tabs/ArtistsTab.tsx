"use client";

import { useEffect, useState } from "react";
import { Artist } from "@/types";
import { musicService } from "@/services/musicService";

export default function ArtistsTab() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    musicService.getArtists().then(setArtists);
  }, []);

  return (
    <div className="overflow-auto h-full p-8">
      <h2 className="text-3xl font-bold mb-6">Artists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition"
          >
            <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🎤</span>
            </div>
            <h3 className="font-semibold text-lg">{artist.name}</h3>
            <p className="text-xs text-gray-500 mt-3">{artist.albums} albums</p>
          </div>
        ))}
      </div>
    </div>
  );
}

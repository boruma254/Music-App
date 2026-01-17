"use client";

import { useEffect, useState } from "react";
import { Album } from "@/types";
import { musicService } from "@/services/musicService";

export default function AlbumsTab() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    musicService.getAlbums().then(setAlbums);
  }, []);

  return (
    <div className="overflow-auto h-full p-8">
      <h2 className="text-3xl font-bold mb-6">Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition"
          >
            <div className="w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">💿</span>
            </div>
            <h3 className="font-semibold text-lg">{album.title}</h3>
            <p className="text-sm text-gray-400 mt-2">by {album.artist}</p>
            <p className="text-xs text-gray-500 mt-3">{album.tracks} tracks</p>
          </div>
        ))}
      </div>
    </div>
  );
}

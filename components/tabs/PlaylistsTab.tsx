"use client";

import { useEffect, useState } from "react";
import { Playlist, Track } from "@/types";
import { musicService } from "@/services/musicService";
import TrackListItem from "../TrackListItem";

interface PlaylistsTabProps {
  audioPlayer: any;
}

export default function PlaylistsTab({ audioPlayer }: PlaylistsTabProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    musicService.getPlaylists(userId || undefined).then(setPlaylists);
  }, []);

  const handlePlaylistClick = async (playlistId: string) => {
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setPlaylistTracks([]);
    } else {
      setSelectedPlaylistId(playlistId);
      const tracks = await musicService.getPlaylistTracks(playlistId);
      setPlaylistTracks(tracks);
    }
  };

  if (selectedPlaylistId) {
    const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);
    return (
      <div className="overflow-auto h-full p-8">
        <button
          onClick={() => {
            setSelectedPlaylistId(null);
            setPlaylistTracks([]);
          }}
          className="text-blue-400 hover:text-blue-300 mb-4 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Playlists</span>
        </button>

        <div className="mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-40 h-40 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-6xl">📋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {selectedPlaylist?.name}
              </h1>
              <p className="text-gray-400 mb-4">
                {selectedPlaylist?.description}
              </p>
              <p className="text-sm text-gray-500">
                {playlistTracks.length} tracks
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {playlistTracks.length > 0 ? (
            playlistTracks.map((track, index) => (
              <TrackListItem
                key={track.id}
                track={track}
                index={index}
                isPlaying={audioPlayer.isPlaying}
                isCurrentTrack={audioPlayer.currentTrack?.id === track.id}
                onPlay={() => audioPlayer.play(track, playlistTracks)}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">
              No tracks in this playlist
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full p-8">
      <h2 className="text-3xl font-bold mb-6">Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist.id)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 hover:bg-gray-700 transition text-left"
          >
            <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="font-semibold text-lg">{playlist.name}</h3>
            <p className="text-sm text-gray-400 mt-2">{playlist.description}</p>
            <p className="text-xs text-gray-500 mt-3">
              {playlist.tracks} tracks
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

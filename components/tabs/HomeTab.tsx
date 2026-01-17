"use client";

import { useEffect, useState } from "react";
import { Playlist, Track } from "@/types";
import { musicService } from "@/services/musicService";
import TrackListItem from "../TrackListItem";

interface HomeTabProps {
  audioPlayer: any;
}

export default function HomeTab({ audioPlayer }: HomeTabProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    musicService.getPlaylists().then((data) => {
      setPlaylists(data);
      if (data.length > 0) {
        setSelectedPlaylist(data[0]);
        musicService.getPlaylistTracks(data[0].id).then(setTracks);
      }
    });
  }, []);

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    musicService.getPlaylistTracks(playlist.id).then(setTracks);
  };

  const handlePlayTrack = (track: Track) => {
    audioPlayer.play(track, tracks);
  };

  return (
    <div className="overflow-auto h-full">
      <div className="p-8">
        {/* Last Updated Playlists Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Last Updated Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handleSelectPlaylist(playlist)}
                className={`p-4 rounded-lg border transition cursor-pointer ${
                  selectedPlaylist?.id === playlist.id
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400"
                    : "bg-gray-800 border-gray-700 hover:border-purple-500"
                }`}
              >
                <h3 className="font-semibold text-lg">{playlist.name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {playlist.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {playlist.tracks} tracks
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Playboard Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Now Playing</h2>
          {selectedPlaylist ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedPlaylist.name}
                </h3>
                <p className="text-gray-400">{selectedPlaylist.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold mb-4">Track List</h4>
                {tracks.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tracks.map((track, index) => (
                      <TrackListItem
                        key={track.id}
                        track={track}
                        index={index}
                        isPlaying={audioPlayer.isPlaying}
                        isCurrentTrack={
                          audioPlayer.currentTrack?.id === track.id
                        }
                        onPlay={() => handlePlayTrack(track)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No tracks available</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a playlist to view tracks</p>
          )}
        </section>
      </div>
    </div>
  );
}

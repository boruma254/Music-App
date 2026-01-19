"use client";

import { useEffect, useState } from "react";
import { Playlist, Track } from "@/types";
import { musicService } from "@/services/musicService";
import { spotifyService } from "@/services/spotifyService";
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
  const [isSpotifyMode, setIsSpotifyMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    setLoading(true);
    const spotifyToken = spotifyService.getStoredAccessToken();
    const userId = localStorage.getItem("currentUserId");

    try {
      if (spotifyToken) {
        // Use Spotify playlists
        setIsSpotifyMode(true);
        const spotifyPlaylists = await spotifyService.getPlaylists(spotifyToken, 50);
        const formattedPlaylists: Playlist[] = spotifyPlaylists.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          tracks: p.tracks?.total || 0,
        }));
        setPlaylists(formattedPlaylists);
        if (formattedPlaylists.length > 0) {
          setSelectedPlaylist(formattedPlaylists[0]);
          await loadPlaylistTracks(formattedPlaylists[0].id, true);
        }
      } else if (userId) {
        // Use MongoDB playlists
        setIsSpotifyMode(false);
        const data = await musicService.getPlaylists(userId);
        setPlaylists(data);
        if (data.length > 0) {
          setSelectedPlaylist(data[0]);
          await loadPlaylistTracks(data[0].id, false);
        }
      } else {
        // Fallback to mock data
        setIsSpotifyMode(false);
        const data = await musicService.getPlaylists();
        setPlaylists(data);
        if (data.length > 0) {
          setSelectedPlaylist(data[0]);
          await loadPlaylistTracks(data[0].id, false);
        }
      }
    } catch (err) {
      console.error("Error loading playlists:", err);
      // Fallback to MongoDB/mock data
      setIsSpotifyMode(false);
      const data = await musicService.getPlaylists(userId || undefined);
      setPlaylists(data);
      if (data.length > 0) {
        setSelectedPlaylist(data[0]);
        await loadPlaylistTracks(data[0].id, false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPlaylistTracks = async (playlistId: string, isSpotify: boolean) => {
    try {
      if (isSpotify) {
        const spotifyToken = spotifyService.getStoredAccessToken();
        if (!spotifyToken) return;
        
        const spotifyTracks = await spotifyService.getPlaylistTracks(spotifyToken, playlistId, 50);
        const formattedTracks: Track[] = spotifyTracks.map((t: any) => ({
          id: t.track?.id || t.id,
          name: t.track?.name || t.name,
          artist: t.track?.artists?.[0]?.name || t.artist || "Unknown",
          duration: Math.floor((t.track?.duration_ms || t.duration || 0) / 1000),
          url: t.track?.preview_url || t.preview_url || t.url,
        }));
        setTracks(formattedTracks);
      } else {
        const data = await musicService.getPlaylistTracks(playlistId);
        setTracks(data);
      }
    } catch (err) {
      console.error("Error loading tracks:", err);
      setTracks([]);
    }
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    loadPlaylistTracks(playlist.id, isSpotifyMode);
  };

  const handlePlayTrack = (track: Track) => {
    audioPlayer.play(track, tracks);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      <div className="p-8">
        {/* Source Indicator */}
        {isSpotifyMode && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.56.3z" />
            </svg>
            <span className="text-sm text-green-400">Connected to Spotify</span>
          </div>
        )}

        {/* Last Updated Playlists Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            {isSpotifyMode ? "Your Spotify Playlists" : "Last Updated Playlists"}
          </h2>
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

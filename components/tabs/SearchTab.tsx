"use client";

import { useState } from "react";
import { Track } from "@/types";
import { spotifyService } from "@/services/spotifyService";
import { musicService } from "@/services/musicService";
import TrackListItem from "../TrackListItem";

interface SearchTabProps {
  audioPlayer: any;
}

export default function SearchTab({ audioPlayer }: SearchTabProps) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState<"spotify" | "local">("spotify");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setTracks([]);

    try {
      const spotifyToken = spotifyService.getStoredAccessToken();

      if (searchType === "spotify" && spotifyToken) {
        // Search Spotify
        const results = await spotifyService.search(spotifyToken, query, 20);
        const formattedTracks: Track[] = (results.tracks?.items || []).map(
          (t: any) => ({
            id: t.id,
            name: t.name,
            artist: t.artists?.[0]?.name || "Unknown",
            duration: Math.floor((t.duration_ms || 0) / 1000),
            url: t.preview_url || undefined,
          }),
        );
        setTracks(formattedTracks);
      } else {
        // Search local tracks
        const allTracks = await musicService.getTracks();
        const filtered = allTracks.filter(
          (track) =>
            track.name.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase()),
        );
        setTracks(filtered);
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: Track) => {
    audioPlayer.play(track, tracks);
  };

  const isSpotifyAvailable = spotifyService.isAuthenticated();

  return (
    <div className="overflow-auto h-full">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Search</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for tracks, artists..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Search Type Selector */}
          {isSpotifyAvailable && (
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  value="spotify"
                  checked={searchType === "spotify"}
                  onChange={(e) => setSearchType(e.target.value as "spotify")}
                  className="w-4 h-4 text-purple-600"
                />
                <span>Search Spotify</span>
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  value="local"
                  checked={searchType === "local"}
                  onChange={(e) => setSearchType(e.target.value as "local")}
                  className="w-4 h-4 text-purple-600"
                />
                <span>Search Local Library</span>
              </label>
            </div>
          )}

          {!isSpotifyAvailable && searchType === "spotify" && (
            <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-400 text-sm">
              Connect to Spotify to search millions of songs
            </div>
          )}
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Search Results */}
        {tracks.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Results ({tracks.length})
            </h3>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <TrackListItem
                  key={track.id}
                  track={track}
                  index={index}
                  isPlaying={audioPlayer.isPlaying}
                  isCurrentTrack={audioPlayer.currentTrack?.id === track.id}
                  onPlay={() => handlePlayTrack(track)}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && query && tracks.length === 0 && !error && (
          <div className="text-center text-gray-400 py-12">
            No results found for "{query}"
          </div>
        )}

        {!query && (
          <div className="text-center text-gray-400 py-12">
            Enter a search query to find music
          </div>
        )}
      </div>
    </div>
  );
}


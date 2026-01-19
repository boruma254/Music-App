"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { spotifyService } from "@/services/spotifyService";

export default function ImportPlaylist() {
  const [jsonText, setJsonText] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<any[]>([]);
  const [selectedSpotifyPlaylist, setSelectedSpotifyPlaylist] = useState<string>("");
  const [loadingSpotifyPlaylists, setLoadingSpotifyPlaylists] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Auto-populate userId from localStorage if user is logged in
  useEffect(() => {
    const stored = localStorage.getItem("currentUserId");
    if (stored) {
      setUserId(stored);
    }
    loadSpotifyPlaylists();
  }, []);

  const loadSpotifyPlaylists = async () => {
    const token = spotifyService.getStoredAccessToken();
    if (!token) return;

    setLoadingSpotifyPlaylists(true);
    try {
      const playlists = await spotifyService.getPlaylists(token, 50);
      setSpotifyPlaylists(playlists);
    } catch (err) {
      console.error("Failed to load Spotify playlists:", err);
    } finally {
      setLoadingSpotifyPlaylists(false);
    }
  };

  const importFromJson = async () => {
    setMessage(null);
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e: any) {
      setMessage("Invalid JSON: " + e.message);
      return;
    }

    if (!userId) {
      setMessage("Please provide a userId to attribute the playlist to.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: parsed.name || "Imported Playlist",
        description: parsed.description || "",
        userId,
        isPublic: parsed.isPublic || false,
        tracks: parsed.tracks || [],
      };

      const res = await fetch(`${API_URL}/api/playlists/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import failed");
      }

      const data = await res.json();
      setMessage(
        "Imported playlist: " +
          data.name +
          " (" +
          data.trackIds.length +
          " tracks) — redirecting...",
      );
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const importFromUrl = async () => {
    setMessage(null);
    if (!remoteUrl) {
      setMessage("Enter a remote JSON URL");
      return;
    }
    try {
      setLoading(true);
      const r = await fetch(remoteUrl);
      if (!r.ok) throw new Error("Failed to fetch remote JSON");
      const json = await r.json();
      setJsonText(JSON.stringify(json, null, 2));
      setMessage("Loaded JSON from URL. Review and click Import.");
    } catch (err: any) {
      setMessage(err.message || "Failed to load URL");
    } finally {
      setLoading(false);
    }
  };

  const importFromSpotify = async () => {
    if (!selectedSpotifyPlaylist || !userId) {
      setMessage("Please select a playlist and ensure userId is set");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = spotifyService.getStoredAccessToken();
      if (!token) {
        throw new Error("Not connected to Spotify");
      }

      // Get playlist details and tracks
      const [playlistDetails, tracks] = await Promise.all([
        spotifyService.getPlaylists(token, 50).then((playlists) =>
          playlists.find((p: any) => p.id === selectedSpotifyPlaylist)
        ),
        spotifyService.getPlaylistTracks(token, selectedSpotifyPlaylist, 100),
      ]);

      if (!playlistDetails) {
        throw new Error("Playlist not found");
      }

      // Format tracks for import
      const formattedTracks = tracks.map((t: any) => ({
        title: t.track?.name || t.name,
        artist: t.track?.artists?.[0]?.name || t.artist || "Unknown",
        album: t.track?.album?.name || "",
        duration: t.track?.duration_ms || 0,
        url: t.track?.preview_url || "",
        previewUrl: t.track?.preview_url || "",
        image: t.track?.album?.images?.[0]?.url || "",
      }));

      // Import to MongoDB
      const payload = {
        name: playlistDetails.name,
        description: playlistDetails.description || "",
        userId,
        isPublic: playlistDetails.public || false,
        tracks: formattedTracks,
      };

      const res = await fetch(`${API_URL}/api/playlists/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import failed");
      }

      const data = await res.json();
      setMessage(
        `Imported Spotify playlist "${data.name}" (${data.trackIds.length} tracks) — redirecting...`
      );
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "Failed to import from Spotify");
    } finally {
      setLoading(false);
    }
  };

  const isSpotifyConnected = spotifyService.isAuthenticated();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">Import Playlist</h2>

      {/* Spotify Import Section */}
      {isSpotifyConnected && (
        <div className="mb-8 p-4 bg-gray-700 rounded-lg border border-green-600">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.56.3z" />
            </svg>
            Import from Spotify
          </h3>
          {loadingSpotifyPlaylists ? (
            <p className="text-gray-400">Loading playlists...</p>
          ) : spotifyPlaylists.length > 0 ? (
            <div className="space-y-3">
              <select
                value={selectedSpotifyPlaylist}
                onChange={(e) => setSelectedSpotifyPlaylist(e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 rounded text-white"
              >
                <option value="">Select a playlist...</option>
                {spotifyPlaylists.map((playlist: any) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name} ({playlist.tracks?.total || 0} tracks)
                  </option>
                ))}
              </select>
              <button
                onClick={importFromSpotify}
                disabled={loading || !selectedSpotifyPlaylist || !userId}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition"
              >
                {loading ? "Importing..." : "Import Selected Playlist"}
              </button>
            </div>
          ) : (
            <p className="text-gray-400">No playlists found</p>
          )}
        </div>
      )}

      {!isSpotifyConnected && (
        <div className="mb-6 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-400 text-sm">
          Connect to Spotify in Settings to import your playlists
        </div>
      )}

      <div className="mb-6 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold mb-4">Manual Import</h3>
      </div>

      <label className="block text-sm text-gray-300 mb-2">User ID</label>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="MongoDB user id (required)"
        className="w-full mb-4 px-3 py-2 bg-gray-700 rounded"
      />

      <label className="block text-sm text-gray-300 mb-2">
        Remote JSON URL
      </label>
      <div className="flex gap-2 mb-4">
        <input
          value={remoteUrl}
          onChange={(e) => setRemoteUrl(e.target.value)}
          placeholder="https://example.com/playlist.json"
          className="flex-1 px-3 py-2 bg-gray-700 rounded"
        />
        <button
          onClick={importFromUrl}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          Load
        </button>
      </div>

      <label className="block text-sm text-gray-300 mb-2">Playlist JSON</label>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        rows={10}
        className="w-full mb-4 px-3 py-2 bg-gray-700 rounded font-mono text-sm"
        placeholder='{ "name": "My Playlist", "tracks": [{"title":"T","artist":"A","url":"https://...mp3"}] }'
      />

      <div className="flex gap-2">
        <button
          onClick={importFromJson}
          disabled={loading}
          className="px-6 py-2 bg-green-600 rounded"
        >
          {loading ? "Importing..." : "Import Playlist"}
        </button>
      </div>

      {message && <div className="mt-4 p-3 bg-gray-700 rounded">{message}</div>}
    </div>
  );
}

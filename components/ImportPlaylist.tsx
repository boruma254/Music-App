"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { spotifyService } from "@/services/spotifyService";

export default function ImportPlaylist() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  /**
   * Extract playlist ID from a Spotify URL.
   *
   * Example:
   * https://open.spotify.com/playlist/37i9dQZF1DX...
   *
   * Returns:
   * 37i9dQZF1DX...
   */
  const extractPlaylistId = (url: string): string | null => {
    try {
      const cleanUrl = url.trim();

      // Support Spotify URI:
      // spotify:playlist:37i9dQZF1DX...
      if (cleanUrl.startsWith("spotify:playlist:")) {
        return cleanUrl.replace("spotify:playlist:", "").split("?")[0];
      }

      const parsedUrl = new URL(cleanUrl);

      if (parsedUrl.hostname !== "open.spotify.com") {
        return null;
      }

      const parts = parsedUrl.pathname.split("/").filter(Boolean);

      if (parts[0] !== "playlist" || !parts[1]) {
        return null;
      }

      return parts[1];
    } catch {
      return null;
    }
  };

  const importPlaylist = async () => {
    setMessage(null);

    // Check URL
    if (!spotifyUrl.trim()) {
      setMessage("Please paste a Spotify playlist URL.");
      return;
    }

    // Extract playlist ID
    const playlistId = extractPlaylistId(spotifyUrl);

    if (!playlistId) {
      setMessage(
        "Invalid Spotify playlist URL. Please paste a link such as https://open.spotify.com/playlist/...",
      );
      return;
    }

    // Get Spotify access token
    const token = spotifyService.getStoredAccessToken();

    if (!token) {
      setMessage("Please connect your Spotify account in Settings first.");
      return;
    }

    setLoading(true);

    try {
      /**
       * Get the user's Spotify playlists.
       *
       * This is currently used to find the playlist
       * and get its name/description.
       */
      const playlists = await spotifyService.getPlaylists(token, 50);

      const playlist = playlists.find((item: any) => item.id === playlistId);

      if (!playlist) {
        throw new Error(
          "This playlist could not be found in your connected Spotify account.",
        );
      }

      /**
       * Get tracks from Spotify.
       */
      const tracks = await spotifyService.getPlaylistTracks(
        token,
        playlistId,
        100,
      );

      if (!tracks || tracks.length === 0) {
        throw new Error(
          "This playlist does not contain any importable tracks.",
        );
      }

      /**
       * Convert Spotify tracks to your application's format.
       */
      const formattedTracks = tracks
        .map((item: any) => {
          const track = item.track || item;

          if (!track) {
            return null;
          }

          return {
            title: track.name || "Unknown Track",

            artist:
              track.artists?.map((artist: any) => artist.name).join(", ") ||
              "Unknown Artist",

            album: track.album?.name || "",

            duration: track.duration_ms || 0,

            url: track.external_urls?.spotify || "",

            previewUrl: track.preview_url || "",

            image: track.album?.images?.[0]?.url || "",
          };
        })
        .filter(Boolean);

      if (formattedTracks.length === 0) {
        throw new Error(
          "No valid tracks could be imported from this playlist.",
        );
      }

      /**
       * Send playlist to your backend.
       */
      const userId = localStorage.getItem("currentUserId");

      if (!userId) {
        throw new Error("You must be logged in before importing a playlist.");
      }

      const payload = {
        name: playlist.name || "Imported Spotify Playlist",

        description: playlist.description || "",

        userId,

        isPublic: playlist.public || false,

        tracks: formattedTracks,
      };

      const response = await fetch(`${API_URL}/api/playlists/import`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.error || "Failed to save the playlist.");
      }

      const data = await response.json();

      const importedCount = data.trackIds?.length || formattedTracks.length;

      setMessage(
        `Successfully imported "${data.name}" with ${importedCount} tracks.`,
      );

      /**
       * Return to home after successful import.
       */
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Spotify playlist import error:", error);

      setMessage(error.message || "Failed to import Spotify playlist.");
    } finally {
      setLoading(false);
    }
  };

  const isSpotifyConnected = !!spotifyService.getStoredAccessToken();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Import Spotify Playlist</h1>

        <p className="text-gray-400 mb-6">
          Paste a Spotify playlist link below to import the playlist into your
          Music App.
        </p>

        {!isSpotifyConnected && (
          <div className="mb-5 p-4 rounded-lg bg-yellow-900/30 border border-yellow-700 text-yellow-300">
            <p className="text-sm">
              Connect your Spotify account in Settings before importing a
              playlist.
            </p>
          </div>
        )}

        <label className="block text-sm font-medium text-gray-300 mb-2">
          Spotify Playlist URL
        </label>

        <input
          type="text"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              importPlaylist();
            }
          }}
          placeholder="https://open.spotify.com/playlist/..."
          disabled={loading}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={importPlaylist}
          disabled={loading || !spotifyUrl.trim()}
          className="w-full mt-4 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
        >
          {loading ? "Importing Playlist..." : "Import Playlist"}
        </button>

        {message && (
          <div
            className={`mt-5 p-4 rounded-lg ${
              message.toLowerCase().includes("successfully")
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-gray-700 border border-gray-600 text-gray-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">
              How to get your playlist link:
            </strong>
          </p>

          <ol className="mt-2 text-sm text-gray-400 space-y-1">
            <li>1. Open Spotify.</li>
            <li>2. Open the playlist you want to import.</li>
            <li>3. Click the three dots (•••).</li>
            <li>4. Choose Share → Copy link to playlist.</li>
            <li>5. Paste the link above.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

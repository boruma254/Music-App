"use client";

import { useState } from "react";

export default function ImportPlaylist() {
  const [jsonText, setJsonText] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
          " tracks)",
      );
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">Import Playlist</h2>

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

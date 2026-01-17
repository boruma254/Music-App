import { Playlist, Album, Artist } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const musicService = {
  async getPlaylists(userId?: string): Promise<Playlist[]> {
    try {
      const query = userId ? `?userId=${userId}` : "";
      const response = await fetch(`${API_URL}/api/playlists${query}`);

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data = await response.json();
      return data.map((playlist: any) => ({
        id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        tracks: playlist.trackIds?.length || 0,
      }));
    } catch (err) {
      console.error("Error fetching playlists:", err);
      // Return mock data if API fails
      return [
        {
          id: "1",
          name: "Chill Vibes",
          description: "Relaxing tracks for work",
          tracks: 45,
        },
        {
          id: "2",
          name: "Workout Mix",
          description: "High energy music",
          tracks: 32,
        },
      ];
    }
  },

  async getAlbums(): Promise<Album[]> {
    try {
      const response = await fetch(`${API_URL}/api/albums`);

      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }

      const data = await response.json();
      return data.map((album: any) => ({
        id: album._id,
        title: album.title,
        artist: album.artist,
        tracks: album.trackIds?.length || 0,
      }));
    } catch (err) {
      console.error("Error fetching albums:", err);
      // Return mock data if API fails
      return [
        {
          id: "1",
          title: "After Hours",
          artist: "The Weeknd",
          tracks: 14,
        },
        {
          id: "2",
          title: "Folklore",
          artist: "Taylor Swift",
          tracks: 16,
        },
      ];
    }
  },

  async getArtists(): Promise<Artist[]> {
    try {
      const response = await fetch(`${API_URL}/api/artists`);

      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }

      const data = await response.json();
      return data.map((artist: any) => ({
        id: artist._id,
        name: artist.name,
        albums: artist.albumIds?.length || 0,
      }));
    } catch (err) {
      console.error("Error fetching artists:", err);
      // Return mock data if API fails
      return [
        { id: "1", name: "The Weeknd", albums: 5 },
        { id: "2", name: "Taylor Swift", albums: 10 },
      ];
    }
  },

  async getTracks() {
    try {
      const response = await fetch(`${API_URL}/api/tracks`);

      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const data = await response.json();
      return data.map((track: any) => ({
        id: track._id,
        name: track.title,
        artist: track.artist,
        duration: Math.floor(track.duration / 1000) || 0,
        url: track.url,
      }));
    } catch (err) {
      console.error("Error fetching tracks:", err);
      // Return mock data if API fails
      return [
        {
          id: "1",
          name: "Blinding Lights",
          artist: "The Weeknd",
          duration: 200,
        },
        {
          id: "2",
          name: "Cardigan",
          artist: "Taylor Swift",
          duration: 238,
        },
      ];
    }
  },

  async getPlaylistTracks(playlistId: string) {
    try {
      const response = await fetch(`${API_URL}/api/playlists/${playlistId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch playlist tracks");
      }

      const data = await response.json();
      return (
        data.trackIds?.map((track: any) => ({
          id: track._id,
          name: track.title,
          artist: track.artist,
          duration: Math.floor(track.duration / 1000) || 0,
          url: track.url,
        })) || []
      );
    } catch (err) {
      console.error("Error fetching playlist tracks:", err);
      return [];
    }
  },
};

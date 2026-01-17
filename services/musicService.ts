import { Playlist, Album, Artist } from "@/types";

export const musicService = {
  async getPlaylists(): Promise<Playlist[]> {
    // Mock data - can be replaced with real API call
    return Promise.resolve([
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
      {
        id: "3",
        name: "Late Night Jazz",
        description: "Smooth jazz collection",
        tracks: 28,
      },
    ]);
  },

  async getAlbums(): Promise<Album[]> {
    return Promise.resolve([
      { id: "1", title: "Midnight Dreams", artist: "Luna Echo", tracks: 12 },
      { id: "2", title: "Electric Pulse", artist: "Neon Lights", tracks: 10 },
      {
        id: "3",
        title: "Acoustic Journey",
        artist: "Wooden Hills",
        tracks: 14,
      },
    ]);
  },

  async getArtists(): Promise<Artist[]> {
    return Promise.resolve([
      { id: "1", name: "Luna Echo", albums: 5 },
      { id: "2", name: "Neon Lights", albums: 3 },
      { id: "3", name: "Wooden Hills", albums: 7 },
    ]);
  },

  async getPlaylistTracks(playlistId: string) {
    return Promise.resolve([
      { id: "1", name: "Morning Light", artist: "Luna Echo", duration: 240 },
      {
        id: "2",
        name: "Electric Dreams",
        artist: "Neon Lights",
        duration: 210,
      },
      { id: "3", name: "Soft Whispers", artist: "Wooden Hills", duration: 180 },
    ]);
  },
};

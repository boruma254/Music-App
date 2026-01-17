/**
 * Frontend Spotify Service
 * Communicates with backend Spotify API routes
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const spotifyService = {
  /**
   * Get Spotify authorization URL
   */
  async getAuthorizationUrl() {
    const response = await fetch(`${API_URL}/api/spotify/auth-url`);
    if (!response.ok) throw new Error("Failed to get auth URL");
    return response.json();
  },

  /**
   * Handle Spotify callback and store tokens
   */
  async handleCallback(code: string, userId: string) {
    const response = await fetch(`${API_URL}/api/spotify/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, userId }),
    });

    if (!response.ok) throw new Error("Authentication failed");

    const data = await response.json();

    // Store tokens in localStorage
    localStorage.setItem("spotifyAccessToken", data.accessToken);
    localStorage.setItem("spotifyRefreshToken", data.refreshToken);

    return data;
  },

  /**
   * Get current user profile
   */
  async getProfile(accessToken: string) {
    const response = await fetch(`${API_URL}/api/spotify/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("Failed to get profile");
    return response.json();
  },

  /**
   * Get user's playlists
   */
  async getPlaylists(accessToken: string, limit: number = 20) {
    const response = await fetch(
      `${API_URL}/api/spotify/playlists?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error("Failed to get playlists");
    const data = await response.json();
    return data.playlists;
  },

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(
    accessToken: string,
    playlistId: string,
    limit: number = 50,
  ) {
    const response = await fetch(
      `${API_URL}/api/spotify/playlists/${playlistId}/tracks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error("Failed to get playlist tracks");
    const data = await response.json();
    return data.tracks;
  },

  /**
   * Search Spotify
   */
  async search(accessToken: string, query: string, limit: number = 20) {
    const response = await fetch(
      `${API_URL}/api/spotify/search?query=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error("Search failed");
    return response.json();
  },

  /**
   * Get user's top tracks
   */
  async getTopTracks(accessToken: string, limit: number = 20) {
    const response = await fetch(
      `${API_URL}/api/spotify/top-tracks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error("Failed to get top tracks");
    const data = await response.json();
    return data.tracks;
  },

  /**
   * Get user's saved tracks
   */
  async getSavedTracks(accessToken: string, limit: number = 50) {
    const response = await fetch(
      `${API_URL}/api/spotify/saved-tracks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error("Failed to get saved tracks");
    const data = await response.json();
    return data.tracks;
  },

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(accessToken: string, artistId: string) {
    const response = await fetch(
      `${API_URL}/api/spotify/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) throw new Error("Failed to get artist tracks");
    const data = await response.json();
    return data.tracks;
  },

  /**
   * Get stored access token from localStorage
   */
  getStoredAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("spotifyAccessToken");
  },

  /**
   * Clear stored tokens
   */
  clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyRefreshToken");
  },

  /**
   * Check if user is authenticated with Spotify
   */
  isAuthenticated(): boolean {
    return !!this.getStoredAccessToken();
  },
};

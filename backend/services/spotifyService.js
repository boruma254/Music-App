const axios = require("axios");

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_BASE = "https://accounts.spotify.com/api/token";

class SpotifyService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  /**
   * Get authorization URL for user login
   */
  getAuthorizationUrl() {
    const scopes = [
      "playlist-read-private",
      "playlist-read-collaborative",
      "user-library-read",
      "user-top-read",
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      scope: scopes.join(" "),
      show_dialog: "true",
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code) {
    try {
      const response = await axios.post(SPOTIFY_AUTH_BASE, null, {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error("Failed to get access token:", error.message);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(SPOTIFY_AUTH_BASE, null, {
        params: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error("Failed to refresh token:", error.message);
      throw error;
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUser(accessToken) {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        id: response.data.id,
        name: response.data.display_name,
        email: response.data.email,
        image: response.data.images?.[0]?.url,
      };
    } catch (error) {
      console.error("Failed to get current user:", error.message);
      throw error;
    }
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(accessToken, limit = 20) {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/me/playlists?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || "No description",
        tracks: playlist.tracks.total,
        image: playlist.images?.[0]?.url,
        uri: playlist.uri,
      }));
    } catch (error) {
      console.error("Failed to get playlists:", error.message);
      throw error;
    }
  }

  /**
   * Get playlist tracks
   */
  async getPlaylistTracks(accessToken, playlistId, limit = 50) {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.items
        .filter((item) => item.track) // Filter out null tracks
        .map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((a) => a.name).join(", "),
          album: item.track.album.name,
          duration: Math.floor(item.track.duration_ms / 1000),
          url: item.track.preview_url, // 30-second preview
          image: item.track.album.images?.[0]?.url,
          uri: item.track.uri,
          explicit: item.track.explicit,
        }));
    } catch (error) {
      console.error("Failed to get playlist tracks:", error.message);
      throw error;
    }
  }

  /**
   * Search for tracks
   */
  async search(accessToken, query, limit = 20) {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
        params: {
          q: query,
          type: "track,playlist,artist",
          limit,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        tracks: response.data.tracks?.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
          duration: Math.floor(track.duration_ms / 1000),
          url: track.preview_url,
          image: track.album.images?.[0]?.url,
          uri: track.uri,
        })),
        artists: response.data.artists?.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url,
          uri: artist.uri,
        })),
        playlists: response.data.playlists?.items.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.images?.[0]?.url,
          uri: playlist.uri,
        })),
      };
    } catch (error) {
      console.error("Failed to search:", error.message);
      throw error;
    }
  }

  /**
   * Get user's top tracks
   */
  async getUserTopTracks(accessToken, limit = 20) {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/me/top/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        album: track.album.name,
        duration: Math.floor(track.duration_ms / 1000),
        url: track.preview_url,
        image: track.album.images?.[0]?.url,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Failed to get top tracks:", error.message);
      throw error;
    }
  }

  /**
   * Get user's saved tracks (liked songs)
   */
  async getUserSavedTracks(accessToken, limit = 50) {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/me/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        album: item.track.album.name,
        duration: Math.floor(item.track.duration_ms / 1000),
        url: item.track.preview_url,
        image: item.track.album.images?.[0]?.url,
        uri: item.track.uri,
        addedAt: item.added_at,
      }));
    } catch (error) {
      console.error("Failed to get saved tracks:", error.message);
      throw error;
    }
  }

  /**
   * Get album tracks
   */
  async getAlbumTracks(accessToken, albumId, limit = 50) {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/albums/${albumId}/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        duration: Math.floor(track.duration_ms / 1000),
        url: track.preview_url,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Failed to get album tracks:", error.message);
      throw error;
    }
  }

  /**
   * Get artist details and top tracks
   */
  async getArtistTopTracks(accessToken, artistId, limit = 10) {
    try {
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        album: track.album.name,
        duration: Math.floor(track.duration_ms / 1000),
        url: track.preview_url,
        image: track.album.images?.[0]?.url,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Failed to get artist top tracks:", error.message);
      throw error;
    }
  }
}

module.exports = SpotifyService;

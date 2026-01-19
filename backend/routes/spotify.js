  const express = require("express");
const router = express.Router();
const SpotifyService = require("../services/spotifyService");

// Initialize Spotify Service
const spotifyService = new SpotifyService(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET,
  process.env.SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/api/auth/spotify/callback",
);

// Store tokens in memory (in production, use database/session storage)
const userTokens = {};

/**
 * GET /api/spotify/auth-url
 * Returns the Spotify authorization URL
 */
router.get("/auth-url", (req, res) => {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(500).json({ 
        error: "Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local" 
      });
    }
    const authUrl = spotifyService.getAuthorizationUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spotify/callback
 * Handles Spotify OAuth callback
 */
router.post("/callback", async (req, res) => {
  const { code, userId } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code required" });
  }

  try {
    const tokens = await spotifyService.getAccessToken(code);

    // Store tokens (in production, save to database)
    if (userId) {
      userTokens[userId] = tokens;
    }

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Spotify callback error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to authenticate with Spotify",
      details: error.response?.data?.error_description || error.message 
    });
  }
});

/**
 * GET /api/spotify/profile
 * Get current user profile
 */
router.get("/profile", async (req, res) => {
  const { accessToken } = req.headers;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const profile = await spotifyService.getCurrentUser(accessToken);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/playlists
 * Get user's playlists
 */
router.get("/playlists", async (req, res) => {
  const { accessToken } = req.headers;
  const limit = req.query.limit || 20;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const playlists = await spotifyService.getUserPlaylists(accessToken, limit);
    res.json({ playlists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/playlists/:playlistId/tracks
 * Get tracks from a playlist
 */
router.get("/playlists/:playlistId/tracks", async (req, res) => {
  const { accessToken } = req.headers;
  const { playlistId } = req.params;
  const limit = req.query.limit || 50;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const tracks = await spotifyService.getPlaylistTracks(
      accessToken,
      playlistId,
      limit,
    );
    res.json({ tracks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/search
 * Search for tracks, artists, playlists
 */
router.get("/search", async (req, res) => {
  const { accessToken } = req.headers;
  const { query, limit } = req.query;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  if (!query) {
    return res.status(400).json({ error: "Search query required" });
  }

  try {
    const results = await spotifyService.search(
      accessToken,
      query,
      limit || 20,
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/top-tracks
 * Get user's top tracks
 */
router.get("/top-tracks", async (req, res) => {
  const { accessToken } = req.headers;
  const limit = req.query.limit || 20;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const tracks = await spotifyService.getUserTopTracks(accessToken, limit);
    res.json({ tracks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/saved-tracks
 * Get user's saved (liked) tracks
 */
router.get("/saved-tracks", async (req, res) => {
  const { accessToken } = req.headers;
  const limit = req.query.limit || 50;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const tracks = await spotifyService.getUserSavedTracks(accessToken, limit);
    res.json({ tracks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/artists/:artistId/top-tracks
 * Get artist's top tracks
 */
router.get("/artists/:artistId/top-tracks", async (req, res) => {
  const { accessToken } = req.headers;
  const { artistId } = req.params;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token provided" });
  }

  try {
    const tracks = await spotifyService.getArtistTopTracks(
      accessToken,
      artistId,
    );
    res.json({ tracks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

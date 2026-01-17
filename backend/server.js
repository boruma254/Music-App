const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const { User, Playlist, Track, Album, Artist } = require("./models");

// const spotifyRoutes = require("./routes/spotify");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://music-app-swart-three.vercel.app",
      "music-app.railway.internal",
    ],
    credentials: true,
  })
);
app.use(express.json());

// ===== DATABASE CONNECTION =====
connectDB()
  .then(() => {
    console.log("✅ MongoDB connection successful");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ===== AUTH ROUTES WITH DATABASE =====

// Register new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      name,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// ===== PLAYLIST ROUTES =====

// Get all playlists for user
app.get("/api/playlists", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const playlists = await Playlist.find({ userId }).populate("trackIds");
    res.json(playlists);
  } catch (err) {
    console.error("Playlists error:", err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Get playlist by ID
app.get("/api/playlists/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate(
      "trackIds",
    );
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.json(playlist);
  } catch (err) {
    console.error("Playlist error:", err);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
});

// Create new playlist
app.post("/api/playlists", async (req, res) => {
  try {
    const { name, description, userId, isPublic } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "name and userId required" });
    }

    const playlist = new Playlist({
      name,
      description: description || "",
      userId,
      trackIds: [],
      isPublic: isPublic || false,
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error("Create playlist error:", err);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

// Add track to playlist
app.post("/api/playlists/:id/tracks", async (req, res) => {
  try {
    const { trackId } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: "trackId required" });
    }

    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { $push: { trackIds: trackId } },
      { new: true },
    ).populate("trackIds");

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json(playlist);
  } catch (err) {
    console.error("Add track error:", err);
    res.status(500).json({ error: "Failed to add track" });
  }
});

// ===== TRACK ROUTES =====

// Get all tracks
app.get("/api/tracks", async (req, res) => {
  try {
    const tracks = await Track.find().limit(50);
    res.json(tracks);
  } catch (err) {
    console.error("Tracks error:", err);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// Get track by ID
app.get("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(track);
  } catch (err) {
    console.error("Track error:", err);
    res.status(500).json({ error: "Failed to fetch track" });
  }
});

// ===== ALBUM ROUTES =====

// Get all albums
app.get("/api/albums", async (req, res) => {
  try {
    const albums = await Album.find().limit(50);
    res.json(albums);
  } catch (err) {
    console.error("Albums error:", err);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

// ===== ARTIST ROUTES =====

// Get all artists
app.get("/api/artists", async (req, res) => {
  try {
    const artists = await Artist.find().limit(50);
    res.json(artists);
  } catch (err) {
    console.error("Artists error:", err);
    res.status(500).json({ error: "Failed to fetch artists" });
  }
});

// ===== SPOTIFY API ROUTES =====

// app.use("/api/spotify", spotifyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: "MongoDB",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
      },
      playlists: "GET /api/playlists",
      tracks: "GET /api/tracks",
      albums: "GET /api/albums",
      artists: "GET /api/artists",
    },
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Backend server running on http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   Auth:`);
  console.log(
    `     POST http://localhost:${PORT}/api/auth/register (email, password, name)`,
  );
  console.log(
    `     POST http://localhost:${PORT}/api/auth/login (email, password)`,
  );
  console.log(`     POST http://localhost:${PORT}/api/auth/logout`);
  console.log(`   Data:`);
  console.log(`     GET http://localhost:${PORT}/api/playlists?userId=<id>`);
  console.log(`     GET http://localhost:${PORT}/api/tracks`);
  console.log(`     GET http://localhost:${PORT}/api/albums`);
  console.log(`     GET http://localhost:${PORT}/api/artists`);
  console.log(`\n💡 MongoDB is enabled. To seed database: npm run seed`);
});

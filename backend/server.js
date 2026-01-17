const express = require("express");
const cors = require("cors");
require("dotenv").config();

// const spotifyRoutes = require("./routes/spotify");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
const mockUsers = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "2", name: "Jordan Smith", email: "jordan@example.com" },
  { id: "3", name: "Taylor Brown", email: "taylor@example.com" },
];

// ===== LEGACY AUTH ROUTES (for non-Spotify login) =====

// Routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Mock authentication - accept any email/password in demo
  const user = mockUsers.find((u) => u.email === email) || {
    id: Math.random().toString(),
    name: email.split("@")[0],
    email: email,
  };

  // Simulate successful login
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// ===== SPOTIFY API ROUTES =====

// app.use("/api/spotify", spotifyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    endpoints: {
      auth: "/api/auth/login",
      // spotify: "/api/spotify/*",
    },
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Backend server running on http://localhost:${PORT}`);
  console.log(`   Auth endpoint: POST http://localhost:${PORT}/api/auth/login`);
  // console.log(`   Spotify endpoints: http://localhost:${PORT}/api/spotify/*`);

  // if (process.env.SPOTIFY_CLIENT_ID) {
  //   console.log(`✅ Spotify API configured`);
  // } else {
  //   console.log(
  //     `⚠️  Spotify API not configured. Set SPOTIFY_CLIENT_ID env var`,
  //   );
  // }
});

const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    favoritePlaylistIds: [String],
    favoriteTrackIds: [String],
  },
  { timestamps: true },
);

// Playlist Schema
const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
    image: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Track Schema
const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    previewUrl: String,
    image: String,
    genre: String,
    releaseDate: Date,
    plays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Album Schema
const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    image: String,
    releaseDate: Date,
    trackIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
    genre: String,
  },
  { timestamps: true },
);

// Artist Schema
const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    bio: String,
    genre: [String],
    followers: {
      type: Number,
      default: 0,
    },
    albumIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
  },
  { timestamps: true },
);

module.exports = {
  User: mongoose.model("User", userSchema),
  Playlist: mongoose.model("Playlist", playlistSchema),
  Track: mongoose.model("Track", trackSchema),
  Album: mongoose.model("Album", albumSchema),
  Artist: mongoose.model("Artist", artistSchema),
};

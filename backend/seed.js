const mongoose = require("mongoose");
const connectDB = require("./db");
const { User, Track, Album, Artist, Playlist } = require("./models");

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Track.deleteMany({});
    await Album.deleteMany({});
    await Artist.deleteMany({});
    await Playlist.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create artists
    const artists = await Artist.insertMany([
      {
        name: "The Weeknd",
        bio: "Grammy-winning Canadian artist",
        genre: ["R&B", "Hip-Hop", "Pop"],
        followers: 5000000,
      },
      {
        name: "Taylor Swift",
        bio: "American singer-songwriter",
        genre: ["Pop", "Country", "Alternative"],
        followers: 6000000,
      },
      {
        name: "Drake",
        bio: "Canadian rapper and singer",
        genre: ["Hip-Hop", "R&B", "Pop"],
        followers: 4500000,
      },
      {
        name: "Ariana Grande",
        bio: "American pop singer",
        genre: ["Pop", "R&B"],
        followers: 5500000,
      },
      {
        name: "Bad Bunny",
        bio: "Puerto Rican rapper and singer",
        genre: ["Reggaeton", "Trap", "Pop"],
        followers: 4000000,
      },
    ]);

    console.log("✅ Created 5 artists");

    // Create albums
    const albums = await Album.insertMany([
      {
        title: "After Hours",
        artist: "The Weeknd",
        releaseDate: new Date("2020-03-20"),
        genre: "R&B",
      },
      {
        title: "Folklore",
        artist: "Taylor Swift",
        releaseDate: new Date("2020-07-24"),
        genre: "Pop",
      },
      {
        title: "Certified Lover Boy",
        artist: "Drake",
        releaseDate: new Date("2021-09-03"),
        genre: "Hip-Hop",
      },
      {
        title: "Positions",
        artist: "Ariana Grande",
        releaseDate: new Date("2020-10-30"),
        genre: "Pop",
      },
      {
        title: "Un x100to",
        artist: "Bad Bunny",
        releaseDate: new Date("2022-10-10"),
        genre: "Reggaeton",
      },
    ]);

    console.log("✅ Created 5 albums");

    // Create tracks
    const tracks = await Track.insertMany([
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: 200,
        url: "https://example.com/audio/blinding-lights.mp3",
        previewUrl: "https://example.com/preview/blinding-lights.mp3",
        genre: "R&B",
        releaseDate: new Date("2019-11-29"),
        plays: 2500000,
      },
      {
        title: "Cardigan",
        artist: "Taylor Swift",
        album: "Folklore",
        duration: 238,
        url: "https://example.com/audio/cardigan.mp3",
        previewUrl: "https://example.com/preview/cardigan.mp3",
        genre: "Pop",
        releaseDate: new Date("2020-07-24"),
        plays: 1800000,
      },
      {
        title: "Certified Lover Boy",
        artist: "Drake",
        album: "Certified Lover Boy",
        duration: 253,
        url: "https://example.com/audio/clb.mp3",
        previewUrl: "https://example.com/preview/clb.mp3",
        genre: "Hip-Hop",
        releaseDate: new Date("2021-09-03"),
        plays: 1200000,
      },
      {
        title: "good 4 u",
        artist: "Ariana Grande",
        album: "Positions",
        duration: 178,
        url: "https://example.com/audio/good4u.mp3",
        previewUrl: "https://example.com/preview/good4u.mp3",
        genre: "Pop",
        releaseDate: new Date("2020-10-30"),
        plays: 950000,
      },
      {
        title: "Un x100to",
        artist: "Bad Bunny",
        album: "Un x100to",
        duration: 252,
        url: "https://example.com/audio/unx100to.mp3",
        previewUrl: "https://example.com/preview/unx100to.mp3",
        genre: "Reggaeton",
        releaseDate: new Date("2022-10-10"),
        plays: 1100000,
      },
      {
        title: "After Hours",
        artist: "The Weeknd",
        album: "After Hours",
        duration: 360,
        url: "https://example.com/audio/after-hours.mp3",
        previewUrl: "https://example.com/preview/after-hours.mp3",
        genre: "R&B",
        releaseDate: new Date("2020-03-20"),
        plays: 1400000,
      },
    ]);

    console.log("✅ Created 6 tracks");

    // Create users
    const users = await User.insertMany([
      {
        email: "demo@example.com",
        name: "Demo User",
        password: "demo123",
        favoriteTrackIds: [tracks[0]._id, tracks[1]._id],
      },
      {
        email: "test@example.com",
        name: "Test User",
        password: "test123",
        favoriteTrackIds: [tracks[2]._id, tracks[3]._id],
      },
    ]);

    console.log("✅ Created 2 users");

    // Create playlists
    const playlists = await Playlist.insertMany([
      {
        name: "My Favorites",
        description: "My favorite tracks",
        userId: users[0]._id,
        trackIds: [tracks[0]._id, tracks[1]._id, tracks[4]._id],
        isPublic: true,
      },
      {
        name: "Chill Vibes",
        description: "Relaxing music",
        userId: users[0]._id,
        trackIds: [tracks[1]._id, tracks[5]._id],
        isPublic: false,
      },
      {
        name: "Workout Mix",
        description: "High energy tracks",
        userId: users[1]._id,
        trackIds: [tracks[0]._id, tracks[2]._id, tracks[4]._id],
        isPublic: true,
      },
    ]);

    console.log("✅ Created 3 playlists");

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📊 Total data created:`);
    console.log(`   - Artists: 5`);
    console.log(`   - Albums: 5`);
    console.log(`   - Tracks: 6`);
    console.log(`   - Users: 2`);
    console.log(`   - Playlists: 3`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedDatabase();

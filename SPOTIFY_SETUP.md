# Spotify Integration Guide

## 🎵 Setting Up Spotify API

### Step 1: Create a Spotify Developer Account

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in or create a free account
3. Accept the terms and create an app
4. Name it "Music Browser" (or your preferred name)
5. Copy your **Client ID** and **Client Secret**

### Step 2: Add Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3: Configure Redirect URI

1. In Spotify Dashboard → Your App → Edit Settings
2. Add Redirect URI: `http://localhost:3000/api/auth/spotify/callback`
3. For production, add your actual domain: `https://yourdomain.com/api/auth/spotify/callback`

## 🔐 How It Works

### Authentication Flow

```
User clicks "Login with Spotify"
    ↓
Redirects to Spotify login
    ↓
User authorizes app
    ↓
Spotify redirects back with auth code
    ↓
Backend exchanges code for access token
    ↓
Token saved, user logged in
    ↓
App fetches real data from Spotify
```

### Data Flow

```
Frontend → Backend (Spotify Service)
         ↓
Backend → Spotify API
         ↓
Backend ← Spotify API (playlists, tracks, albums)
         ↓
Frontend ← Backend (formatted data)
         ↓
Audio Player (with real track URLs)
```

## 📊 What You Can Access

✅ **User Data**

- Current user profile
- Saved playlists
- Liked songs
- Top tracks/artists

✅ **Music Library**

- All Spotify playlists
- Albums and tracks
- Artist information
- Search functionality

✅ **Playback**

- Preview URLs (30-second clips)
- Track metadata
- Album artwork
- Artist details

⚠️ **Limitations**

- Preview URLs are 30-second clips only
- Full track playback requires Spotify Premium + Web Playback SDK
- Rate limiting: 429 responses (implement retry logic)

## 🛠️ File Structure

The integration uses:

```
backend/
├── routes/
│   └── spotify.js          # Spotify OAuth routes
├── services/
│   └── spotifyService.js   # Spotify API client
└── middleware/
    └── auth.js             # Token management

services/
└── spotifyService.ts       # Frontend Spotify integration
```

## 🚀 Next Steps

1. Install the Spotify integration files (see separate files)
2. Add environment variables
3. Update package.json with new dependencies
4. Test the login flow
5. Your app will fetch real Spotify data

## 📚 Spotify API Resources

- [Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization/)
- [API Reference](https://developer.spotify.com/documentation/web-api/reference)

## 💡 Preview URLs

Spotify provides 30-second preview URLs for most tracks:

```typescript
// Example from Spotify API response
{
  name: "Song Name",
  artist: "Artist Name",
  preview_url: "https://p.scdn.co/mp3-preview/...",  // 30-second clip
  url: "/song/123"
}
```

Use these preview_url values in your audio player!

## 🔄 Full Playback (Advanced)

For full-track playback, you need:

1. Spotify Premium account
2. Web Playback SDK integration
3. Larger backend implementation

See [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk) docs.

## ⚡ Quick Test

Once set up, your app will:

1. Show "Login with Spotify" button
2. Let users authorize
3. Display their real Spotify playlists
4. Play 30-second previews of tracks
5. Show album artwork and metadata

Ready to implement? Follow the files below!

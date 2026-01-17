# 🎵 Spotify Integration - Complete Setup Guide

## Quick Summary

Your music browser can now fetch REAL music from Spotify! You'll have access to:

- ✅ User's playlists
- ✅ Playlists tracks
- ✅ User's saved songs
- ✅ Top tracks
- ✅ Artist information
- ✅ Search functionality
- ✅ 30-second preview clips

## Step-by-Step Setup

### Step 1: Create Spotify Developer Account

1. Go to: **https://developer.spotify.com/dashboard**
2. Log in or create a free account
3. Agree to terms
4. Create an app (name it whatever you want)
5. Copy **Client ID** and **Client Secret**

### Step 2: Configure Redirect URI

1. In Spotify Dashboard → Your App Settings
2. Click **Edit Settings**
3. Add **Redirect URI**:
   ```
   http://localhost:3000/api/auth/spotify/callback
   ```
4. Save settings

### Step 3: Set Environment Variables

1. **Copy the example file**:

   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your credentials:

   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_actual_client_id
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Save the file**

### Step 4: Restart Your Servers

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend
```

The backend will check for your credentials and log:

```
✅ Spotify API configured
```

### Step 5: Test Spotify Login

1. Open http://localhost:3000
2. Click **"Login with Spotify"** button
3. Authorize your app
4. You're logged in with Spotify! 🎉

## What Happens Next?

Once logged in with Spotify:

### In Frontend

```typescript
// Your access token is stored
const token = localStorage.getItem("spotifyAccessToken");

// Use spotifyService to fetch data
import { spotifyService } from "@/services/spotifyService";

// Get user's playlists
const playlists = await spotifyService.getPlaylists(token);

// Get playlist tracks
const tracks = await spotifyService.getPlaylistTracks(token, playlistId);

// Search Spotify
const results = await spotifyService.search(token, "Drake");
```

### In Backend

```javascript
// API routes available at:
GET  /api/spotify/playlists
GET  /api/spotify/playlists/:id/tracks
GET  /api/spotify/search?query=...
GET  /api/spotify/top-tracks
GET  /api/spotify/saved-tracks
GET  /api/spotify/profile
```

## Integrate with Existing App

### Update HomeTab to Use Spotify Data

```typescript
// components/tabs/HomeTab.tsx
import { spotifyService } from "@/services/spotifyService";

export default function HomeTab() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("spotifyAccessToken");
    if (token) {
      spotifyService.getPlaylists(token).then(setPlaylists);
    }
  }, []);

  // Rest of component...
}
```

### Update Main Page to Store Token

```typescript
// app/page.tsx
const [spotifyToken, setSpotifyToken] = useState("");

const handleLogin = (name: string, isSpotify?: boolean, accessToken?: string) => {
  setUserName(name);
  if (isSpotify && accessToken) {
    setSpotifyToken(accessToken);
  }
  setIsLoggedIn(true);
};

// Pass token to MainContent
<MainContent audioPlayer={audioPlayer} spotifyToken={spotifyToken} />
```

## Preview URLs and Playback

Spotify provides **30-second preview URLs** for most tracks:

```typescript
{
  id: "track123",
  name: "Song Name",
  artist: "Artist Name",
  duration: 240,
  url: "https://p.scdn.co/mp3-preview/abc123..."  // ← 30-sec clip
}
```

These automatically work with your audio player! Just set the track's `url` field and click play.

## Full Playback (Advanced)

For FULL TRACK playback (not just 30-second previews), you need:

1. **Spotify Premium Account**
2. **Web Playback SDK Integration**
3. **User Authorization for STREAMING scope**

See [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk) for full implementation.

## Troubleshooting

### "Spotify is not configured" Error

- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is set
- Restart both servers (changes to env vars need restart)

### "Invalid Client ID" Error

- Copy Client ID again from Spotify Dashboard
- Make sure there are no extra spaces
- Restart the server

### "Redirect URI mismatch" Error

- In Spotify Dashboard, your Redirect URI must exactly match:
  - For local: `http://localhost:3000/api/auth/spotify/callback`
  - For production: `https://yourdomain.com/api/auth/spotify/callback`

### Playlists Not Loading

- Make sure you're logged in with Spotify
- Check browser console (F12) for errors
- Verify backend is running on port 3001
- Check access token in localStorage

### Preview URLs Not Playing

- Not all tracks have preview URLs (older/local content)
- Some regions may have different availability
- Check browser console for errors

## Environment Variables Reference

```env
# REQUIRED
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=abc123...
SPOTIFY_CLIENT_SECRET=xyz789...

# Optional (defaults shown)
NEXT_PUBLIC_API_URL=http://localhost:3001
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback
PORT=3001
```

## File Structure

```
services/
└── spotifyService.ts          # Frontend Spotify API client

backend/
├── services/
│   └── spotifyService.js      # Backend Spotify API wrapper
├── routes/
│   └── spotify.js             # Express routes
└── server.js                  # Updated with Spotify support
```

## Rate Limiting

Spotify API has rate limits. If you get `429` responses:

- Wait a few seconds before retrying
- Implement exponential backoff in production
- Cache results when possible

## Next Steps

1. ✅ Create Spotify app
2. ✅ Add environment variables
3. ✅ Test login
4. Update your components to use `spotifyService`
5. Add search functionality
6. Create playlist management UI
7. Implement advanced features (shuffle, queue, etc.)

## API Reference

See [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api) for:

- Complete endpoint reference
- Rate limits and quotas
- Authentication details
- Error handling

---

**Questions?** Check the Spotify API docs or troubleshooting section above!

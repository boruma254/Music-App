# Architecture: How Spotify Integration Works

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React)                     │  │
│  │  - LoginModal.tsx (Spotify OAuth button)             │  │
│  │  - HomeTab.tsx (Load playlists)                      │  │
│  │  - services/spotifyService.ts (API calls)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                   spotifyService                            │
│            (fetch from /api/spotify/*)                      │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    NODE.JS BACKEND                          │
│                    (port 3001)                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Express.js Server (server.js)                │  │
│  │  ├── /api/spotify/* routes                           │  │
│  │  └── Backend middleware                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Spotify Service (spotifyService.js)                │  │
│  │  - Exchange code for token                           │  │
│  │  - API wrapper functions                             │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                    axios/HTTP client                        │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               SPOTIFY API SERVERS                           │
│               (api.spotify.com)                             │
│                                                              │
│  - User playlists                                           │
│  - Playlist tracks                                          │
│  - User top tracks                                          │
│  - Search results                                           │
│  - Album & artist info                                      │
│  - 30-second preview URLs                                   │
└─────────────────────────────────────────────────────────────┘
```

## OAuth Flow (Initial Login)

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Clicks "Login with Spotify"
       ↓
┌──────────────────────────────┐
│  Frontend                    │
│  Calls getAuthorizationUrl() │
│  (requests /api/spotify/auth-url)
└──────┬───────────────────────┘
       │
       ↓ 2. Backend sends auth URL
┌──────────────────────────────┐
│  Spotify OAuth Page          │
│  (user.spotify.com/login)    │
└──────┬───────────────────────┘
       │ 3. User logs in & authorizes
       │
       ↓
┌──────────────────────────────┐
│  Frontend                    │
│  Receives auth CODE          │
└──────┬───────────────────────┘
       │ 4. Sends code to backend
       │
       ↓
┌──────────────────────────────┐
│  Backend                     │
│  POST /api/spotify/callback  │
│  (exchanges code for token)  │
└──────┬───────────────────────┘
       │
       ↓ 5. Spotify API issues token
┌──────────────────────────────┐
│  Spotify Auth Server         │
└──────┬───────────────────────┘
       │
       ↓ 6. Returns access token
┌──────────────────────────────┐
│  Backend                     │
│  Returns accessToken         │
└──────┬───────────────────────┘
       │
       ↓ 7. Saves token in localStorage
┌──────────────────────────────┐
│  Frontend                    │
│  ✅ User is logged in!       │
└──────────────────────────────┘
```

## Data Flow (After Login)

```
User clicks playlist
        ↓
Frontend calls spotifyService.getPlaylists(token)
        ↓
Sends HTTP GET to /api/spotify/playlists
        ↓
Backend receives request with token header
        ↓
Backend SpotifyService calls Spotify API
        ↓
Spotify API returns playlist data
        ↓
Backend formats and sends back to frontend
        ↓
Frontend receives and displays playlists
        ↓
User sees their real Spotify playlists! 🎉
```

## Code Flow Example: Getting Playlists

### 1. User Action (Frontend)

```typescript
// HomeTab.tsx
const token = spotifyService.getStoredAccessToken();
const playlists = await spotifyService.getPlaylists(token);
```

### 2. Frontend Service Call

```typescript
// services/spotifyService.ts
async getPlaylists(accessToken: string) {
  const response = await fetch(
    `http://localhost:3001/api/spotify/playlists`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
}
```

### 3. Network Request

```
GET http://localhost:3001/api/spotify/playlists
Headers: Authorization: Bearer ${accessToken}
```

### 4. Backend Route

```javascript
// backend/routes/spotify.js
router.get("/playlists", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const playlists = await spotifyService.getUserPlaylists(token);
  res.json({ playlists });
});
```

### 5. Backend Service

```javascript
// backend/services/spotifyService.js
async getUserPlaylists(accessToken) {
  const response = await axios.get(
    `https://api.spotify.com/v1/me/playlists`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.items.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks.total,
    // ... etc
  }));
}
```

### 6. Spotify API Call

```
GET https://api.spotify.com/v1/me/playlists
Authorization: Bearer ${accessToken}
```

### 7. Response Path

```
Spotify API
    ↓ (playlist data)
Backend SpotifyService
    ↓ (formatted)
Express Route
    ↓ (JSON)
Frontend spotifyService
    ↓ (data)
HomeTab Component
    ↓ (render)
User sees playlists! ✅
```

## Token Storage & Management

```
OAuth Flow:
Spotify sends access token
        ↓
Backend receives it
        ↓
Sends to Frontend
        ↓
Frontend stores in localStorage
    localStorage.setItem('spotifyAccessToken', token)
        ↓
Used for all future API calls
        ↓
Token lasts ~1 hour
(refresh token stored for extension)
```

## Security Notes

```
⚠️  TOKENS ARE SENSITIVE
- Access tokens are stored in localStorage
- Never expose Client Secret to frontend
- Client Secret only on backend
- HTTPS required in production
```

## API Endpoints Available

After authentication, these endpoints work:

```
GET    /api/spotify/profile              - Get user profile
GET    /api/spotify/playlists            - Get user playlists
GET    /api/spotify/playlists/:id/tracks - Get tracks
GET    /api/spotify/search               - Search
GET    /api/spotify/top-tracks           - User top tracks
GET    /api/spotify/saved-tracks         - User saved songs
GET    /api/spotify/artists/:id/top-tracks - Artist tracks
```

All require Authorization header with Bearer token.

## Error Handling

```
User makes request
        ↓
Could fail at multiple points:
├─ Frontend network error
├─ Backend network error
├─ Spotify API error
├─ Invalid/expired token
└─ Rate limiting
        ↓
Error caught and displayed
Try again or refresh login
```

## Scalability Notes

For production:

```
Current (Development):
└─ Tokens in localStorage
└─ Backend stores tokens in memory
└─ Single server

Production Improvements:
├─ Tokens in secure HTTP-only cookies
├─ Store tokens in database
├─ Token refresh mechanism
├─ Multiple backend instances
├─ Caching for API responses
└─ Rate limit handling
```

This architecture keeps your frontend clean and delegates all Spotify interaction to the backend!

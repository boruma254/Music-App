# Spotify Integration - Quick Test Checklist

## Before You Start

- [ ] Spotify Developer Account created
- [ ] App created in Spotify Dashboard
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Redirect URI added to app settings
- [ ] `.env.local` file created with credentials

## Setup Checklist

```bash
# 1. Copy environment template
cp .env.local.example .env.local

# 2. Edit .env.local with your credentials
nano .env.local
# OR
code .env.local

# 3. Install backend dependencies (if not done)
cd backend
npm install dotenv axios
cd ..

# 4. Restart servers
# Terminal 1
npm run dev

# Terminal 2
npm run backend
```

## Visual Verification

### Backend Should Show:

```
🎵 Backend server running on http://localhost:3001
   Auth endpoint: POST http://localhost:3001/api/auth/login
   Spotify endpoints: http://localhost:3001/api/spotify/*
✅ Spotify API configured
```

If you see ⚠️ instead of ✅, check your `.env.local`

### Frontend Should Show:

- Login page with TWO buttons:
  1. Standard "Login" button
  2. Green "Login with Spotify" button

## Testing Steps

### Test 1: Traditional Login (No Spotify)

1. Click "Login" button
2. Enter any email: `test@example.com`
3. Enter any password: `password`
4. Should see home page with playlists
5. **Result:** Mock data shown ✅

### Test 2: Spotify Login

1. Click "Login with Spotify" button
2. Browser opens Spotify login
3. Log in to your Spotify account
4. Click "Agree" to authorize app
5. Browser closes, app says "Connecting to Spotify..."
6. Should load your REAL Spotify data
7. **Result:** Your playlists shown ✅

### Test 3: Player with Real Music

1. After Spotify login, click a playlist
2. Click the play button on any track
3. Should show track info at bottom
4. Click play icon in player
5. **Result:** 30-second preview plays ✅

## Debugging

If something doesn't work:

### 1. Check Console (F12)

- Open DevTools (F12)
- Look for red errors
- Click error for details

### 2. Check Terminal Output

- Look for error messages
- Check "Spotify API configured" message

### 3. Verify Files Exist

```bash
# Should have all these files:
backend/services/spotifyService.js
backend/routes/spotify.js
services/spotifyService.ts
.env.local
```

### 4. Common Issues

**"Spotify is not configured"**

- Check `.env.local` exists and is readable
- Check `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is set
- Restart frontend (Ctrl+C then npm run dev)

**"Redirect URI mismatch"**

- In Spotify Dashboard, URI must be exactly:
  `http://localhost:3000/api/auth/spotify/callback`
- No typos, no trailing slash

**"Playlists not loading"**

- Check browser console for errors
- Make sure you're logged in with Spotify
- Check backend is running (`http://localhost:3001/api/health`)

**"No preview URLs"**

- Not all tracks have previews
- Try searching for popular artists like Drake
- Check browser console for the actual error

## Success Indicators

✅ You're done if:

- [ ] "Login with Spotify" button appears
- [ ] You can authorize the app
- [ ] Your playlists load
- [ ] You can click to play tracks
- [ ] Player shows track info
- [ ] Play button works with preview audio

## Next Phase

After verification, update your components:

```typescript
// HomeTab.tsx - Use real Spotify data
const token = localStorage.getItem("spotifyAccessToken");
if (token) {
  const playlists = await spotifyService.getPlaylists(token);
}
```

See `SPOTIFY_COMPLETE_GUIDE.md` for detailed integration instructions!

---

**Stuck?** Check:

1. `.env.local` file has correct values
2. Spotify Dashboard shows your app
3. Both servers are running
4. Browser console (F12) for error messages

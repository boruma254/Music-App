# 🎵 Spotify Setup for Localhost Testing

## Quick Setup Guide

### Step 1: Get Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in:
   - **App name**: Music Browser (or any name)
   - **App description**: Music browser app
   - **Redirect URI**: `http://localhost:3000/api/auth/spotify/callback`
   - **Website**: `http://localhost:3000`
5. Click **"Save"**
6. Copy your **Client ID** and **Client Secret**

### Step 2: Create Environment File

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Save the file**

### Step 3: Start the Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run backend
```

You should see:
```
✅ Spotify API configured
```

If you see `⚠️ Spotify API not configured`, check your `.env.local` file.

### Step 4: Test Spotify Login

1. Open http://localhost:3000
2. **Create an account first** (email/password)
3. Click **"Login with Spotify"** button
4. Authorize the app in Spotify
5. You should be redirected back and see your Spotify playlists!

## Troubleshooting

### "Failed to get auth URL" Error

- Check `.env.local` exists in project root
- Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set
- Restart both servers after adding env vars
- Check backend console for errors

### "Redirect URI mismatch" Error

- In Spotify Dashboard → Your App → Edit Settings
- Make sure Redirect URI is exactly: `http://localhost:3000/api/auth/spotify/callback`
- No trailing slash, no https

### "User session not found" Error

- Make sure you create/login to an account FIRST
- Then click "Login with Spotify"
- Check browser console (F12) for errors

### Backend Shows "Spotify API not configured"

- Check `.env.local` file exists
- Verify variable names are correct (case-sensitive)
- Restart backend server
- Check for typos in credentials

### Playlists Not Loading

- Check browser console (F12) for errors
- Verify backend is running on port 3001
- Check `localStorage.getItem("spotifyAccessToken")` in browser console
- Make sure you authorized the app in Spotify

## Testing Checklist

- [ ] `.env.local` file created with credentials
- [ ] Backend shows "✅ Spotify API configured"
- [ ] Can see "Login with Spotify" button
- [ ] Clicking button redirects to Spotify
- [ ] After authorization, redirects back to app
- [ ] Can see Spotify playlists in Home tab
- [ ] Can play 30-second previews

## Next Steps

Once working:
- Try searching for songs
- Import a Spotify playlist
- Play preview tracks
- Check favorites functionality


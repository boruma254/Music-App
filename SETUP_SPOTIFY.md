# 🎵 Quick Spotify Setup for Localhost

## Step 1: Get Spotify Credentials

1. Visit: https://developer.spotify.com/dashboard
2. Log in and click **"Create app"**
3. Fill in:
   - **App name**: Music Browser
   - **Redirect URI**: `http://localhost:3000/api/auth/spotify/callback`
4. Copy **Client ID** and **Client Secret**

## Step 2: Create .env.local File

Create a file named `.env.local` in the project root with:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 3: Restart Servers

```bash
# Terminal 1
npm run dev

# Terminal 2  
npm run backend
```

Look for: `✅ Spotify API configured`

## Step 4: Test

1. Go to http://localhost:3000
2. Create/login to an account
3. Click **"Login with Spotify"**
4. Authorize the app
5. See your Spotify playlists!

## Troubleshooting

- **"Spotify API not configured"**: Check `.env.local` exists and has correct values
- **"Redirect URI mismatch"**: Make sure URI in Spotify Dashboard matches exactly
- **No Spotify button**: Check browser console for errors


# Before & After: Integrating Real Spotify Data

This shows exactly how to update your components to use real Spotify data instead of mock data.

## Example 1: HomeTab Component

### BEFORE (Mock Data)

```typescript
// components/tabs/HomeTab.tsx
import { musicService } from "@/services/musicService";

export default function HomeTab() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Hardcoded mock playlists
    musicService.getPlaylists().then(setPlaylists);
  }, []);

  // Rest of component...
}
```

### AFTER (Real Spotify Data)

```typescript
// components/tabs/HomeTab.tsx
import { spotifyService } from "@/services/spotifyService";

interface HomeTabProps {
  audioPlayer: any;
  spotifyToken?: string;
}

export default function HomeTab({ audioPlayer, spotifyToken }: HomeTabProps) {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load real Spotify playlists if token exists
    if (spotifyToken) {
      spotifyService
        .getPlaylists(spotifyToken)
        .then(setPlaylists)
        .catch(err => {
          console.error("Failed to load playlists:", err);
          setError("Failed to load playlists");
        });
    }
  }, [spotifyToken]);

  if (error) {
    return <div className="p-8 text-red-400">{error}</div>;
  }

  // Rest of component...
}
```

### Key Changes

1. Import `spotifyService` instead of `musicService`
2. Add `spotifyToken` prop
3. Check if token exists before fetching
4. Use `spotifyService.getPlaylists(token)` instead of `musicService.getPlaylists()`
5. Add error handling
6. Component displays REAL user's playlists!

---

## Example 2: Getting Playlist Tracks

### BEFORE (Mock)

```typescript
const handleSelectPlaylist = (playlist: Playlist) => {
  setSelectedPlaylist(playlist);
  // Returns hardcoded tracks
  musicService.getPlaylistTracks(playlist.id).then(setTracks);
};
```

### AFTER (Real Spotify)

```typescript
const handleSelectPlaylist = (playlist: Playlist) => {
  setSelectedPlaylist(playlist);

  if (spotifyToken) {
    // Fetches actual tracks from Spotify
    spotifyService
      .getPlaylistTracks(spotifyToken, playlist.id)
      .then(setTracks)
      .catch((err) => console.error("Failed to load tracks:", err));
  }
};
```

### What's Different

- Passes `spotifyToken` as first parameter
- Spotify tracks include real `preview_url` (30-second clips)
- Metadata like album art, release date included
- Can see preview URLs in browser DevTools

---

## Example 3: Playlists Tab

### BEFORE (Mock)

```typescript
// components/tabs/PlaylistsTab.tsx
export default function PlaylistsTab() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    musicService.getPlaylists().then(setPlaylists);
  }, []);

  // Shows 3 hardcoded playlists
}
```

### AFTER (Real Spotify)

```typescript
// components/tabs/PlaylistsTab.tsx
interface PlaylistsTabProps {
  spotifyToken?: string;
}

export default function PlaylistsTab({ spotifyToken }: PlaylistsTabProps) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!spotifyToken) {
      return; // Not authenticated with Spotify
    }

    setLoading(true);
    spotifyService
      .getPlaylists(spotifyToken, 50) // Get first 50
      .then(setPlaylists)
      .finally(() => setLoading(false));
  }, [spotifyToken]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (playlists.length === 0) {
    return <div className="p-8">No playlists found</div>;
  }

  // Shows ALL user's Spotify playlists
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      {playlists.map(playlist => (
        <div key={playlist.id} className="...">
          {playlist.image && (
            <img
              src={playlist.image}
              alt={playlist.name}
              className="w-full h-40 object-cover rounded"
            />
          )}
          <h3>{playlist.name}</h3>
          <p className="text-sm text-gray-400">
            {playlist.tracks} tracks
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Improvements

- Shows album artwork (from Spotify API)
- Displays all user's playlists (not just 3)
- Loading state while fetching
- Real track count
- Empty state handling

---

## Example 4: Main Page Layout

### BEFORE (No token passing)

```typescript
// app/page.tsx
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const audioPlayer = useAudioPlayer();

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar {...props} />
      <MainContent activeTab={activeTab} audioPlayer={audioPlayer} />
      <AudioPlayer {...props} />
    </div>
  );
}
```

### AFTER (Pass Spotify token)

```typescript
// app/page.tsx
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [spotifyToken, setSpotifyToken] = useState("");
  const audioPlayer = useAudioPlayer();

  const handleLogin = (
    name: string,
    isSpotify?: boolean,
    accessToken?: string
  ) => {
    setUserName(name);
    setIsLoggedIn(true);

    // Store Spotify token if authenticated with Spotify
    if (isSpotify && accessToken) {
      setSpotifyToken(accessToken);
      localStorage.setItem('spotifyAccessToken', accessToken);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar {...props} />
        {/* Pass spotifyToken to MainContent */}
        <MainContent
          activeTab={activeTab}
          audioPlayer={audioPlayer}
          spotifyToken={spotifyToken}
        />
      </div>
      <AudioPlayer {...props} />
    </div>
  );
}
```

### Key Changes

1. Add `spotifyToken` state
2. Update `handleLogin` to accept `isSpotify` and `accessToken`
3. Store token when Spotify login succeeds
4. Pass token to `MainContent` prop
5. Components can now access real Spotify data!

---

## Example 5: MainContent Component

### BEFORE

```typescript
interface MainContentProps {
  activeTab: string;
  audioPlayer: any;
}

export default function MainContent({ activeTab, audioPlayer }: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden bg-gray-900">
      {activeTab === "home" && <HomeTab audioPlayer={audioPlayer} />}
      {activeTab === "playlists" && <PlaylistsTab />}
      {activeTab === "albums" && <AlbumsTab />}
      {activeTab === "artists" && <ArtistsTab />}
    </div>
  );
}
```

### AFTER

```typescript
interface MainContentProps {
  activeTab: string;
  audioPlayer: any;
  spotifyToken?: string;
}

export default function MainContent({
  activeTab,
  audioPlayer,
  spotifyToken
}: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden bg-gray-900">
      {activeTab === "home" && (
        <HomeTab audioPlayer={audioPlayer} spotifyToken={spotifyToken} />
      )}
      {activeTab === "playlists" && (
        <PlaylistsTab spotifyToken={spotifyToken} />
      )}
      {activeTab === "albums" && (
        <AlbumsTab spotifyToken={spotifyToken} />
      )}
      {activeTab === "artists" && (
        <ArtistsTab spotifyToken={spotifyToken} />
      )}
    </div>
  );
}
```

### What Changed

- Add `spotifyToken` prop
- Pass token to each tab component
- Tabs can now fetch real Spotify data!

---

## Example 6: Search Implementation

### NEW Feature (Not in Original)

```typescript
// components/Search.tsx
"use client";

import { useState } from "react";
import { spotifyService } from "@/services/spotifyService";
import { Track } from "@/types";

interface SearchProps {
  spotifyToken?: string;
  onTrackSelect?: (track: Track) => void;
}

export default function Search({ spotifyToken, onTrackSelect }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || !spotifyToken) return;

    setLoading(true);
    try {
      const results = await spotifyService.search(
        spotifyToken,
        query,
        20
      );
      setResults(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Spotify..."
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-green-600 rounded text-white"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results && (
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Tracks</h3>
            <div className="grid gap-2">
              {results.tracks?.map((track: Track) => (
                <div
                  key={track.id}
                  className="p-3 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => onTrackSelect?.(track)}
                >
                  {track.name} - {track.artist}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Artists</h3>
            <div className="grid grid-cols-3 gap-4">
              {results.artists?.map((artist: any) => (
                <div key={artist.id} className="p-3 bg-gray-800 rounded text-center">
                  {artist.image && (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-24 h-24 mx-auto rounded-full"
                    />
                  )}
                  <p className="mt-2 font-semibold">{artist.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Playlists</h3>
            <div className="grid grid-cols-4 gap-4">
              {results.playlists?.map((playlist: any) => (
                <div key={playlist.id} className="p-3 bg-gray-800 rounded">
                  {playlist.image && (
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full rounded"
                    />
                  )}
                  <p className="mt-2 text-sm font-semibold truncate">
                    {playlist.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

This shows how to implement search - completely new feature with Spotify!

---

## Migration Path

1. **Keep Mock Mode**: Keep mock data as fallback

   ```typescript
   if (spotifyToken) {
     // Use real Spotify data
   } else {
     // Fall back to mock data
   }
   ```

2. **Gradual Migration**: Update one tab at a time
   - Day 1: HomeTab
   - Day 2: PlaylistsTab
   - Day 3: AlbumsTab
   - etc.

3. **Test Each Change**: Verify with real Spotify login

4. **Remove Mock Data**: Once everything works, remove `musicService`

---

## Summary

The pattern is always:

1. Import `spotifyService`
2. Accept `spotifyToken` prop
3. Use `spotifyService.getPlaylists(token)` instead of `musicService.getPlaylists()`
4. Add error/loading states
5. Component displays REAL data!

All your UI code stays the same - just swap the data source! 🎵

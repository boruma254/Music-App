# 🎵 Music Playback Guide

## Overview

Your music browser now has a fully functional audio player at the bottom of the screen with playback controls, progress bar, and volume adjustment.

## Features

### Audio Player Controls

- **Play/Pause**: Click the circular play button to play or pause the currently selected track
- **Next Track**: Skip to the next track in the playlist
- **Previous Track**: Go back to the previous track
- **Progress Bar**: Click anywhere on the progress bar to seek to that position
- **Time Display**: Shows current time and total duration (format: M:SS)
- **Volume Control**: Click the speaker icon to show/hide the volume slider (0-100%)

### Track Selection

- Click the **play icon** next to any track in the track list to start playing it
- The **currently playing track** is highlighted with a purple border
- **Animated indicator** shows when a track is playing (green bouncing dots)

## How to Add Real Music

### Option 1: Use Local Audio Files

1. **Create a public folder structure**:

   ```
   public/
   └── music/
       ├── track1.mp3
       ├── track2.mp3
       └── track3.mp3
   ```

2. **Update the music service** in `services/musicService.ts`:

   ```typescript
   async getPlaylistTracks(playlistId: string) {
     return Promise.resolve([
       {
         id: "1",
         name: "Morning Light",
         artist: "Luna Echo",
         duration: 240,
         url: "/music/track1.mp3"  // Add this
       },
       // ... more tracks
     ]);
   }
   ```

3. **Update the audio player hook** in `hooks/useAudioPlayer.ts`:
   ```typescript
   const play = (track: Track, playlist: Track[] = [track]) => {
     const audio = audioRef.current!;
     // ... existing code ...

     // Use the track URL instead of mock data
     audio.src = track.url || "/music/default.mp3";
     audio.play();
   };
   ```

### Option 2: Use Streaming URLs

Update tracks with streaming URLs:

```typescript
{
  id: "1",
  name: "Track Name",
  artist: "Artist Name",
  duration: 240,
  url: "https://example.com/music/track.mp3"
}
```

### Option 3: Connect to a Backend API

Add a `url` field to your Track type and fetch it from your backend:

```typescript
// types/index.ts
export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  url?: string;  // Add this
}

// services/musicService.ts
async getPlaylistTracks(playlistId: string) {
  const response = await fetch(`${API_URL}/api/playlists/${playlistId}/tracks`);
  const data = await response.json();
  return data.tracks;  // Should include url field
}
```

## Current Behavior (Mock Mode)

The app is currently in **mock/demo mode** and plays a silent test audio when you click play. This allows you to:

- Test all player controls
- Test UI interactions
- Implement real audio without changing the player code

## Player Architecture

### `useAudioPlayer` Hook

- Manages audio playback state
- Handles play/pause/next/previous logic
- Tracks current time and duration
- Manages volume

### `AudioPlayer` Component

- Displays playback UI
- Shows progress bar and time
- Provides all control buttons
- Responsive design

### `TrackListItem` Component

- Individual track display
- Play button with animated indicator
- Shows track number, name, artist, and duration

## Type Definitions

```typescript
interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number; // in seconds
  url?: string; // audio file URL
}
```

## Troubleshooting

### Audio Not Playing

- Check browser console (F12) for errors
- Ensure audio file URLs are correct
- Check CORS headers if using external URLs
- Test with `https://` for secure contexts

### Progress Bar Not Working

- Audio file duration must be available (requires metadata)
- Some formats may not provide duration metadata

### Volume Not Persisting

- Volume is session-only (as per requirements)
- Add localStorage to persist across refreshes if needed

## Advanced: Adding Playlist Queue

Create a queue system in your audio player:

```typescript
const [queue, setQueue] = useState<Track[]>([]);

const addToQueue = (track: Track) => {
  setQueue([...queue, track]);
};

const playNext = () => {
  if (queue.length > 0) {
    const nextTrack = queue[0];
    audioPlayer.play(nextTrack);
    setQueue(queue.slice(1));
  }
};
```

## Browser Support

Audio playback supported in all modern browsers:

- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

## Future Enhancements

- [ ] Shuffle mode
- [ ] Repeat modes (off, one, all)
- [ ] Playlist queue display
- [ ] Lyrics display
- [ ] Equalizer controls
- [ ] Audio visualization
- [ ] Playback speed control
- [ ] Favourite/Like functionality

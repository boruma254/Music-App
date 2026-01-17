import { useState, useRef, useEffect } from "react";
import { Track } from "@/types";

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playlist: Track[];
  currentTrackIndex: number;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playlist: [],
    currentTrackIndex: -1,
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const play = (track: Track, playlist: Track[] = [track]) => {
    const audio = audioRef.current!;
    const trackIndex = playlist.findIndex((t) => t.id === track.id);

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      playlist,
      currentTrackIndex: trackIndex,
    }));

    // Use a mock audio URL - replace with real audio paths
    audio.src = `data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==`;
    audio.play().catch((err) => console.log("Playback error:", err));
  };

  const pause = () => {
    const audio = audioRef.current!;
    audio.pause();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  };

  const resume = () => {
    const audio = audioRef.current!;
    audio.play();
    setState((prev) => ({
      ...prev,
      isPlaying: true,
    }));
  };

  const playNext = () => {
    const { currentTrackIndex, playlist } = state;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      play(nextTrack, playlist);
    }
  };

  const playPrevious = () => {
    const { currentTrackIndex, playlist } = state;
    const prevIndex =
      currentTrackIndex <= 0 ? playlist.length - 1 : currentTrackIndex - 1;
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      play(prevTrack, playlist);
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current!;
    audio.currentTime = time;
    setState((prev) => ({
      ...prev,
      currentTime: time,
    }));
  };

  const setVolume = (volume: number) => {
    const audio = audioRef.current!;
    const normalized = Math.max(0, Math.min(1, volume));
    audio.volume = normalized;
    setState((prev) => ({
      ...prev,
      volume: normalized,
    }));
  };

  return {
    ...state,
    play,
    pause,
    resume,
    playNext,
    playPrevious,
    seek,
    setVolume,
  };
};

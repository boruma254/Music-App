import { useState, useRef, useEffect } from "react";
import { Track } from "@/types";

type RepeatMode = "off" | "one" | "all";

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playlist: Track[];
  currentTrackIndex: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
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
    shuffle: false,
    repeatMode: "all",
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
      if (state.repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch((err) => console.log("Playback error:", err));
        return;
      }
      playNext(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.repeatMode, state.shuffle, state.currentTrackIndex, state.playlist]);

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

    // Use the actual track URL from the database
    audio.src = track.url || "";
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

  const playNext = (fromEnded: boolean = false) => {
    const { currentTrackIndex, playlist, shuffle, repeatMode } = state;
    if (!playlist.length) return;

    // If repeat is off, stop at end when track finishes naturally
    if (fromEnded && repeatMode === "off" && currentTrackIndex === playlist.length - 1) {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
      return;
    }

    let nextIndex: number;
    if (shuffle) {
      if (playlist.length === 1) nextIndex = 0;
      else {
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentTrackIndex);
      }
    } else {
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= playlist.length) {
        nextIndex = repeatMode === "all" ? 0 : playlist.length - 1;
      }
    }

    const nextTrack = playlist[nextIndex];
    if (nextTrack) play(nextTrack, playlist);
  };

  const playPrevious = () => {
    const { currentTrackIndex, playlist, shuffle } = state;
    if (!playlist.length) return;

    let prevIndex: number;
    if (shuffle) {
      if (playlist.length === 1) prevIndex = 0;
      else {
        do {
          prevIndex = Math.floor(Math.random() * playlist.length);
        } while (prevIndex === currentTrackIndex);
      }
    } else {
      prevIndex = currentTrackIndex <= 0 ? playlist.length - 1 : currentTrackIndex - 1;
    }

    const prevTrack = playlist[prevIndex];
    if (prevTrack) play(prevTrack, playlist);
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

  const toggleShuffle = () => {
    setState((prev) => ({
      ...prev,
      shuffle: !prev.shuffle,
    }));
  };

  const cycleRepeatMode = () => {
    setState((prev) => {
      const next: RepeatMode =
        prev.repeatMode === "all" ? "one" : prev.repeatMode === "one" ? "off" : "all";
      return { ...prev, repeatMode: next };
    });
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
    toggleShuffle,
    cycleRepeatMode,
  };
};

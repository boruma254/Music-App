"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import LoginModal from "@/components/LoginModal";
import AudioPlayer from "@/components/AudioPlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [userName, setUserName] = useState("");
  const audioPlayer = useAudioPlayer();

  // Restore user session on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId");
    const storedUserName = localStorage.getItem("currentUserName");
    if (storedUserId && storedUserName) {
      setUserName(storedUserName);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
  };

  const handleLogoClick = () => {
    const tabs = ["home", "albums", "playlists", "artists"];
    const currentIndex = tabs.indexOf(activeTab);
    const nextTab = tabs[(currentIndex + 1) % tabs.length];
    setActiveTab(nextTab);
  };

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogoClick={handleLogoClick}
          userName={userName}
          onLogout={handleLogout}
        />
        <MainContent activeTab={activeTab} audioPlayer={audioPlayer} />
      </div>
      <AudioPlayer
        currentTrack={audioPlayer.currentTrack}
        isPlaying={audioPlayer.isPlaying}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        volume={audioPlayer.volume}
        onPlay={audioPlayer.resume}
        onPause={audioPlayer.pause}
        onNext={audioPlayer.playNext}
        onPrevious={audioPlayer.playPrevious}
        onSeek={audioPlayer.seek}
        onVolumeChange={audioPlayer.setVolume}
      />
    </div>
  );
}

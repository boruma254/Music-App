"use client";

import HomeTab from "./tabs/HomeTab";
import PlaylistsTab from "./tabs/PlaylistsTab";
import AlbumsTab from "./tabs/AlbumsTab";
import ArtistsTab from "./tabs/ArtistsTab";
import SettingsTab from "./tabs/SettingsTab";

interface MainContentProps {
  activeTab: string;
  audioPlayer: any;
}

export default function MainContent({
  activeTab,
  audioPlayer,
}: MainContentProps) {
  return (
    <div className="flex-1 overflow-hidden bg-gray-900">
      {activeTab === "home" && <HomeTab audioPlayer={audioPlayer} />}
      {activeTab === "playlists" && <PlaylistsTab audioPlayer={audioPlayer} />}
      {activeTab === "albums" && <AlbumsTab />}
      {activeTab === "artists" && <ArtistsTab />}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}

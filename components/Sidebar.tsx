"use client";

import { useState } from "react";
import Link from "next/link";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogoClick: () => void;
  userName: string;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogoClick,
  userName,
  onLogout,
}: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "search", label: "Search", icon: "🔍" },
    { id: "playlists", label: "Playlists", icon: "📋" },
    { id: "albums", label: "Albums", icon: "💿" },
    { id: "artists", label: "Artists", icon: "🎤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div
        onClick={onLogoClick}
        className="p-6 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          ♫ Music
        </h1>
        <p className="text-xs text-gray-400 mt-1">Click logo to cycle tabs</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-900 hover:text-white"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}

        {/* Import Button */}
        <Link href="/import">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white transition mt-4 border-t border-gray-800 pt-4">
            <span className="text-xl">📥</span>
            <span>Import Playlist</span>
          </button>
        </Link>
      </nav>

      {/* User Menu */}
      <div className="border-t border-gray-800 p-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-400">Account</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg">
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

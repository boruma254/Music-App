"use client";

import { useState, useEffect } from "react";

interface SettingsTabProps {
  settings?: {
    shuffleMode: boolean;
    repeatMode: "off" | "all" | "one";
    autoplayNextTrack: boolean;
    showAnimations: boolean;
    defaultVolume: number;
    theme: "dark" | "light";
  };
  onSettingsChange?: (settings: SettingsTabProps["settings"]) => void;
}

export default function SettingsTab({
  settings: initialSettings,
  onSettingsChange,
}: SettingsTabProps) {
  const [settings, setSettings] = useState(
    initialSettings || {
      shuffleMode: false,
      repeatMode: "off" as const,
      autoplayNextTrack: true,
      showAnimations: true,
      defaultVolume: 70,
      theme: "dark" as const,
    },
  );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("musicAppSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setSaved(false);

    if (key === "theme") {
      applyTheme(value);
    }
  };

  const applyTheme = (theme: "dark" | "light") => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem("musicAppSettings", JSON.stringify(settings));
    localStorage.setItem("appTheme", settings.theme);
    applyTheme(settings.theme);
    onSettingsChange?.(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      shuffleMode: false,
      repeatMode: "off" as const,
      autoplayNextTrack: true,
      showAnimations: true,
      defaultVolume: 70,
      theme: "dark" as const,
    };
    setSettings(defaultSettings);
    localStorage.removeItem("musicAppSettings");
    localStorage.removeItem("appTheme");
    applyTheme("dark");
    setSaved(false);
  };

  return (
    <div className="overflow-y-auto h-full bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="p-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

        {/* Playback Settings */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Playback</h2>

          {/* Shuffle Mode */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
            <div>
              <label className="text-white font-medium">Shuffle Mode</label>
              <p className="text-gray-400 text-sm">Randomize track order</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("shuffleMode", !settings.shuffleMode)
              }
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.shuffleMode ? "bg-purple-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.shuffleMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Repeat Mode */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
            <div>
              <label className="text-white font-medium">Repeat Mode</label>
              <p className="text-gray-400 text-sm">How tracks repeat</p>
            </div>
            <select
              value={settings.repeatMode}
              onChange={(e) =>
                handleSettingChange(
                  "repeatMode",
                  e.target.value as "off" | "all" | "one",
                )
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="off">Off</option>
              <option value="all">Repeat All</option>
              <option value="one">Repeat One</option>
            </select>
          </div>

          {/* Autoplay Next Track */}
          <div className="flex items-center justify-between pb-6">
            <div>
              <label className="text-white font-medium">Autoplay Next Track</label>
              <p className="text-gray-400 text-sm">Auto-play next track</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("autoplayNextTrack", !settings.autoplayNextTrack)
              }
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.autoplayNextTrack ? "bg-purple-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.autoplayNextTrack ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Audio</h2>

          {/* Default Volume */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="text-white font-medium">Default Volume</label>
              <p className="text-gray-400 text-sm">Initial volume (0-100)</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.defaultVolume}
                onChange={(e) =>
                  handleSettingChange("defaultVolume", parseInt(e.target.value))
                }
                className="w-32"
              />
              <span className="text-white font-semibold w-12 text-right">
                {settings.defaultVolume}%
              </span>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Display</h2>

          {/* Theme Selection */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
            <div>
              <label className="text-white font-medium">Theme</label>
              <p className="text-gray-400 text-sm">Choose dark or light mode</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) =>
                handleSettingChange("theme", e.target.value as "dark" | "light")
              }
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="dark">🌙 Dark Mode</option>
              <option value="light">☀️ Light Mode</option>
            </select>
          </div>

          {/* Show Animations */}
          <div className="flex items-center justify-between pb-6">
            <div>
              <label className="text-white font-medium">Show Animations</label>
              <p className="text-gray-400 text-sm">Enable UI animations</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("showAnimations", !settings.showAnimations)
              }
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.showAnimations ? "bg-purple-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.showAnimations ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">About</h2>
          <div className="text-gray-300">
            <p className="mb-2">
              <span className="font-semibold">Music Browser</span> v1.0.0
            </p>
            <p className="text-gray-400 text-sm mb-4">A modern music player built with Next.js</p>
            <div className="text-sm text-gray-400">
              <p>🎵 Stream your favorite tracks</p>
              <p>🎨 Dark and light theme support</p>
              <p>⚙️ Customizable playback options</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSaveSettings}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition"
          >
            {saved ? "✓ Settings Saved" : "Save Settings"}
          </button>
          <button
            onClick={handleResetSettings}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
          >
            Reset to Defaults
          </button>
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg text-green-200">
            ✓ Settings saved successfully
          </div>
        )}
      </div>
    </div>
  );
}

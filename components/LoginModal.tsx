"use client";

import { useState, useEffect } from "react";
import { spotifyService } from "@/services/spotifyService";
import { authService } from "@/services/authService";

interface LoginModalProps {
  onLogin: (name: string, userId?: string, isSpotify?: boolean, accessToken?: string) => void;
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [spotifyLoading, setSpotifyLoading] = useState(false);

  // Check for Spotify callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code") || urlParams.get("spotify_code");
    const error = urlParams.get("error");

    if (error) {
      setError("Spotify authorization was cancelled or failed");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      // Try to get userId from sessionStorage first, then localStorage
      const userId = sessionStorage.getItem("spotifyCallbackUserId") || localStorage.getItem("currentUserId");
      
      if (userId) {
        handleSpotifyCallback(code, userId);
      } else {
        setError("User session not found. Please login first.");
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      // Store user ID in localStorage for import page
      localStorage.setItem("currentUserId", user.id);
      localStorage.setItem("currentUserName", user.name);
      onLogin(user.name, user.id);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!email || !password || !name || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const user = await authService.register(email, password, name);
      setSuccess("Account created successfully! You can now login.");

      // Also store the new user ID
      localStorage.setItem("currentUserId", user.id);
      localStorage.setItem("currentUserName", user.name);
      // Auto-login after signup
      onLogin(user.name, user.id);

      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");

      // Switch to login after 2 seconds
      setTimeout(() => {
        setIsSignup(false);
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifyLogin = async () => {
    setSpotifyLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem("currentUserId");
      if (!userId) {
        setError("Please create an account first, then connect Spotify");
        setSpotifyLoading(false);
        return;
      }

      // Store userId in sessionStorage for callback
      sessionStorage.setItem("spotifyCallbackUserId", userId);
      
      const { authUrl } = await spotifyService.getAuthorizationUrl();
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || "Failed to initiate Spotify login");
      setSpotifyLoading(false);
    }
  };

  const handleSpotifyCallback = async (code: string, userId: string) => {
    setSpotifyLoading(true);
    setError("");
    try {
      const data = await spotifyService.handleCallback(code, userId);
      const profile = await spotifyService.getProfile(data.accessToken);
      
      // Store user info if not already stored
      if (!localStorage.getItem("currentUserName")) {
        localStorage.setItem("currentUserName", profile.display_name || "Spotify User");
      }
      
      // Clean up sessionStorage
      sessionStorage.removeItem("spotifyCallbackUserId");
      
      onLogin(profile.display_name || "Spotify User", userId, true, data.accessToken);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Spotify");
      setSpotifyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      <div className="w-full max-w-md p-8 rounded-lg bg-gray-800 shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Music Browser
        </h1>

        {isSignup ? (
          // SIGNUP FORM
          <form onSubmit={handleSignup} className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-purple-400 mb-6">
              Create Account
            </h2>

            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="signup-confirm"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                  setSuccess("");
                  setEmail("");
                  setPassword("");
                  setName("");
                  setConfirmPassword("");
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition"
              >
                Login
              </button>
            </p>
          </form>
        ) : (
          // LOGIN FORM
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-purple-400 mb-6">
              Welcome Back
            </h2>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setError("");
                  setSuccess("");
                  setEmail("");
                  setPassword("");
                  setName("");
                  setConfirmPassword("");
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* Spotify Login Section */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-400 mb-2">Or connect with</p>
            <button
              onClick={handleSpotifyLogin}
              disabled={spotifyLoading || loading}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {spotifyLoading ? (
                "Connecting..."
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.56.3z" />
                  </svg>
                  Login with Spotify
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Requires an account first
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

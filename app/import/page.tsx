"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ImportPlaylist from "../../components/ImportPlaylist";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      // Not logged in – send to home page, which will show the login modal
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <ImportPlaylist />
      </div>
    </main>
  );
}

import ImportPlaylist from "../../components/ImportPlaylist";

export const metadata = {
  title: "Import Playlist",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <ImportPlaylist />
      </div>
    </main>
  );
}

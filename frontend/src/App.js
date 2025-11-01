import React, { useState } from "react";
import Landing from "./components/Landing";
import Mixer from "./components/Mixer";
import SongList from "./components/SongList";
import HelpModal from "./components/HelpModal";
import AboutModal from "./components/AboutModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [songsByUser, setSongsByUser] = useState({}); // { user: [{title, artist, details}] }

  const handleSaveMix = (mix) => {
    setSongsByUser((prev) => {
      const list = prev[user] || [];
      const duplicate = list.some(
        (s) => s.title === mix.title && s.details === mix.details
      );
      if (duplicate) return prev;
      return { ...prev, [user]: [...list, mix] };
    });
  };

  if (!user) {
    return <Landing onSelect={setUser} />;
  }

  const songs = songsByUser[user] || [];

  return (
    <div className="max-w-6xl mx-auto text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{user}'s Dashboard</h2>
        <div className="flex gap-4 items-center">
          <button onClick={() => setShowHelp(true)} title="Help">❔</button>
          <button onClick={() => setShowAbout(true)} title="About">ℹ️</button>
          <button onClick={() => setUser(null)} className="text-blue-400">← Back</button>
        </div>
      </div>

      <Mixer onSave={handleSaveMix} />

      <SongList songs={songs} />

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <footer className="text-center text-sm text-gray-400 mt-8">
        Human–Audio Interaction Prototype © 2025 · Interactive Music Perception & Co-Creation Study
      </footer>
    </div>
  );
}
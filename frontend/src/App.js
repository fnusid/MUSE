// import React, { useState } from "react";
// import Landing from "./components/Landing";
// import Mixer from "./components/Mixer";
// import SongList from "./components/SongList";
// import HelpModal from "./components/HelpModal";
// import AboutModal from "./components/AboutModal";

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [showHelp, setShowHelp] = useState(false);
//   const [showAbout, setShowAbout] = useState(false);
//   const [songsByUser, setSongsByUser] = useState({}); // { user: [{title, artist, details}] }

//   const handleSaveMix = (mix) => {
//     setSongsByUser((prev) => {
//       const list = prev[user] || [];
//       const duplicate = list.some(
//         (s) => s.title === mix.title && s.details === mix.details
//       );
//       if (duplicate) return prev;
//       return { ...prev, [user]: [...list, mix] };
//     });
//   };

//   if (!user) {
//     return <Landing onSelect={setUser} />;
//   }

//   const songs = songsByUser[user] || [];

//   return (
//     <div className="max-w-6xl mx-auto text-white p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">{user}'s Dashboard</h2>
//         <div className="flex gap-4 items-center">
//           <button onClick={() => setShowHelp(true)} title="Help">❔</button>
//           <button onClick={() => setShowAbout(true)} title="About">ℹ️</button>
//           <button onClick={() => setUser(null)} className="text-blue-400">← Back</button>
//         </div>
//       </div>

//       <Mixer onSave={handleSaveMix} />

//       <SongList songs={songs} />

//       {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
//       {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

//       <footer className="text-center text-sm text-gray-400 mt-8">
//         Human–Audio Interaction Prototype © 2025 · Interactive Music Perception & Co-Creation Study
//       </footer>
//     </div>
//   );
// }

import React, { useState } from "react";
import Mixer from "./components/Mixer";
import MySongs from "./components/MySongs";
import AboutModal from "./components/AboutModal";
import HelpModal from "./components/HelpModal";
import Landing from "./components/Landing";

export default function App() {
  const [user, setUser] = useState(null); // ✅ current user
  const [tab, setTab] = useState("landing");
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [songsByUser, setSongsByUser] = useState({}); // ✅ { username: [songs] }

  // ✅ Save mix per user
  const handleSaveMix = (mix) => {
    if (!user) return alert("Select a user first!");
    setSongsByUser((prev) => {
      const list = prev[user] || [];
      const duplicate = list.some(
        (s) => s.title === mix.title && s.details === mix.details
      );
      if (duplicate) return prev;
      return { ...prev, [user]: [...list, mix] };
    });
    setTab("mysongs");
  };

  // ✅ Song play (from MySongs)
  const handleSongSelect = (song) => {
    console.log("▶ Selected song:", song.title);
    alert(`Playing "${song.title}" by ${song.artist}`);
    setTab("mixer");
  };

  // ✅ If no user selected, show Landing
  if (!user) {
    return (
      <Landing
        onSelectUser={(selectedUser) => {
          console.log("User selected:", selectedUser);
          setUser(selectedUser);
          setTab("mixer");
        }}
      />
    );
  }

  const songs = songsByUser[user] || [];

  // ✅ Main UI after user is logged in
  return (
    <div className="min-h-screen bg-[#0d1020] text-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        🎧 {user}'s Human Audio Mixer (MUSE)
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {[
          { key: "mixer", label: "Mixer" },
          { key: "mysongs", label: "My Songs" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-md ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}

        <button
          onClick={() => setShowHelp(true)}
          className="px-5 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          ❓ Help
        </button>

        <button
          onClick={() => setShowAbout(true)}
          className="px-5 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          ℹ️ About
        </button>

        <button
          onClick={() => {
            setUser(null);
            setTab("landing");
          }}
          className="px-5 py-2 rounded-md bg-gray-700 text-blue-300 hover:bg-gray-600"
        >
          ← Switch User
        </button>
      </div>

      {/* Render Active Tab */}
      <div className="max-w-6xl mx-auto">
        {tab === "mixer" && <Mixer onSave={handleSaveMix} />}
        {tab === "mysongs" && <MySongs onSelect={handleSongSelect} songs={songs} />}
      </div>

      {/* Modals */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 mt-8">
        Have feedback? Write to us at muse_io@gmail.com
      </footer>
    </div>
  );
}

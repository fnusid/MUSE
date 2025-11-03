import React from "react";

// ✅ Helper for rendering song cards
function SongList({ songs = [], onSelect }) {
  return (
    <div className="flex flex-col gap-4">
      {songs.map((song, idx) => (
        <div
          key={idx}
          className="bg-[#1a1f3c] border border-[#2a2f4a] p-4 rounded-xl flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
            <p className="text-xs text-gray-500 mt-1">{song.details}</p>
          </div>

          {/* ✅ Safe optional call to prevent "onSelect is not a function" */}
          <button
            onClick={() => typeof onSelect === "function" && onSelect(song)}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            ▶ Play
          </button>
        </div>
      ))}
    </div>
  );
}

// ✅ Single default export for the component
export default function MySongs({ onSelect }) {
  const songs = [
    {
      title: "Sunset Groove",
      artist: "DJ Solis",
      details: "Vocals +2 dB, Bass +1 dB, Drums -3 dB",
    },
    {
      title: "Rainy Lo-Fi",
      artist: "SynthCloud",
      details: "Drums -2 dB, Other +4 dB",
    },
    {
      title: "Electric Flow",
      artist: "Beatwave",
      details: "Bass +3 dB, Vocals -1 dB",
    },
  ];

  return (
    <div className="relative bg-[#151931]/70 backdrop-blur-lg border border-[#2a2f4a] rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">🎵 My Songs</h2>
      <SongList songs={songs} onSelect={onSelect} />
    </div>
  );
}

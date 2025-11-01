import React from "react";

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#171b2e] rounded-xl p-6 max-w-lg text-white shadow-lg modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-2">❔ How to Use</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>🎧 Upload a music file (WAV, MP3, FLAC)</li>
          <li>🎚 Adjust sliders for Vocals, Guitar, Bass, Drums, and Piano</li>
          <li>💾 Save your custom mix (avoids duplicates)</li>
          <li>🎵 Access saved mixes under “My Songs”</li>
        </ul>
        <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-black font-semibold">
          OK
        </button>
      </div>
    </div>
  );
}
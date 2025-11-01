import React from "react";

export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#171b2e] rounded-xl p-6 max-w-lg text-white shadow-lg modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-2">ℹ️ About</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          This prototype explores <b>Human–Audio Interaction (HAI)</b> for interactive music
          source separation and remixing. The backend uses <b>Demucs</b> to decompose songs
          into stems — vocals, drums, bass, etc. — enabling perceptual testing and creative control.
        </p>
        <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-black font-semibold">
          OK
        </button>
      </div>
    </div>
  );
}
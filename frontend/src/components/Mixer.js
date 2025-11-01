import React, { useState, useRef } from "react";

const channels = [
  { key: "vocals", label: "🎤 Vocals", color: "from-blue-400 to-blue-600" },
  { key: "drums", label: "🥁 Drums", color: "from-yellow-400 to-yellow-600" },
  { key: "bass", label: "🎶 Bass", color: "from-green-400 to-green-600" },
  { key: "other", label: "🎧 Other", color: "from-purple-400 to-purple-600" },
];

const fmt = (db) => (db > 0 ? `+${db}` : `${db}`) + " dB";

export default function Mixer({ onSave }) {
  const [file, setFile] = useState(null);
  const [gains, setGains] = useState(Object.fromEntries(channels.map((c) => [c.key, 0])));
  const [separating, setSeparating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  const audioRef = useRef(null);

  // ------------------------
  // Handle slider change
  // ------------------------
  const handleChange = (key, val) => setGains((prev) => ({ ...prev, [key]: parseInt(val) }));

  // ------------------------
  // Upload and trigger Demucs
  // ------------------------
  const handleUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setSeparating(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", f);

    try {
      const resp = await fetch("http://127.0.0.1:8000/start_separation", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) throw new Error("Separation failed");
      const data = await resp.json();

      if (data.status === "completed") {
        setProgress(100);
        setSeparating(false);
        alert("✅ Separation complete!");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error(err);
      alert("Error starting separation");
      setSeparating(false);
    }
  };

  // ------------------------
  // Play / Pause / Resume / Stop
  // ------------------------
  const playMix = async () => {
    try {
      const formData = new FormData();
      formData.append("vocals_gain", gains.vocals);
      formData.append("drums_gain", gains.drums);
      formData.append("bass_gain", gains.bass);
      formData.append("other_gain", gains.other);

      const resp = await fetch("http://127.0.0.1:8000/mix", { method: "POST", body: formData });
      const data = await resp.json();

      const audio = new Audio(`http://127.0.0.1:8000${data.path}`);
      audioRef.current = audio;
      audio.play();
      setPlaying(true);
      setPaused(false);

      audio.onended = () => {
        setPlaying(false);
        setPaused(false);
      };
    } catch (err) {
      console.error("Mix playback error:", err);
      alert("Error playing mix");
    }
  };

  const pauseMix = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPaused(true);
  };

  const resumeMix = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setPaused(false);
  };

  const stopMix = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setPaused(false);
  };

  // ------------------------
  // Save metadata
  // ------------------------
  const handleSave = () => {
    if (!file) return alert("Upload a file first");
    const title = file.name.replace(/\.[^/.]+$/, "");
    const details = channels.map((c) => `${c.label}: ${fmt(gains[c.key])}`).join("\n");
    onSave?.({ title, artist: "Custom Mix", details });
  };

  // ------------------------
  // Render UI
  // ------------------------
  return (
    <div className="relative bg-[#151931]/70 backdrop-blur-lg border border-[#2a2f4a] rounded-2xl p-6 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#243066]/20 to-[#0f1220]/10 pointer-events-none rounded-2xl"></div>

      {/* Upload */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <label className="text-sm font-semibold text-gray-300">
          🎧 Choose Audio File:
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          className="text-sm bg-[#0e1226]/80 border border-[#2a2f4a] p-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        {file && <p className="text-xs text-gray-400 truncate max-w-[200px]">{file.name}</p>}
      </div>

      {/* Progress */}
      {separating && (
        <div className="w-full mb-6">
          <div className="w-full bg-[#0a0d1c]/50 rounded-md h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">{progress}%</p>
        </div>
      )}

      {/* Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
        {channels.map((ch) => (
          <div
            key={ch.key}
            className="flex flex-col items-center bg-[#0e1226]/60 px-4 py-5 rounded-xl border border-[#2a2f4a] w-[140px]"
          >
            <span
              className={`text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r ${ch.color} font-semibold`}
            >
              {ch.label}
            </span>

            {/* Slider */}
            <div className="relative h-[180px] flex items-center justify-center">
              <input
                type="range"
                min="-24"
                max="12"
                step="1"
                value={gains[ch.key]}
                onChange={(e) => handleChange(ch.key, e.target.value)}
                className="appearance-none h-[180px] w-[6px] bg-gray-700 rounded-full cursor-pointer"
                style={{
                  writingMode: "bt-lr",
                  WebkitAppearance: "slider-vertical",
                  appearance: "slider-vertical",
                }}
              />
            </div>

            <p className="text-xs mt-3 text-gray-300 tracking-wide">{fmt(gains[ch.key])}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {!playing && (
          <button
            onClick={playMix}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded-md"
          >
            ▶ Play Mix
          </button>
        )}
        {playing && !paused && (
          <button
            onClick={pauseMix}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md"
          >
            ⏸ Pause
          </button>
        )}
        {paused && (
          <button
            onClick={resumeMix}
            className="px-5 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-md"
          >
            ▶ Resume
          </button>
        )}
        {playing && (
          <button
            onClick={stopMix}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
          >
            ⏹ Stop
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-black font-semibold rounded-md"
        >
          💾 Save Mix
        </button>
      </div>
    </div>
  );
}

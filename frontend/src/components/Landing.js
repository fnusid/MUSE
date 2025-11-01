import React, { useState, useEffect } from "react";

export default function Landing({ onSelect }) {
  const [users, setUsers] = useState(["Alex", "Sam", "Jamie"]);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("users");
    if (stored) {
      try { setUsers(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    const name = newUser.trim();
    if (name && !users.includes(name)) {
      setUsers([...users, name]);
      setNewUser("");
      setShowAdd(false);
    } else {
      alert("Invalid or duplicate user name.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">🎧 AudioMix Profiles</h1>

      <div className="flex gap-6 flex-wrap justify-center mb-6">
        {users.map((name) => (
          <div
            key={name}
            onClick={() => onSelect(name)}
            className="cursor-pointer w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center rounded-xl font-semibold text-black hover:scale-105 transition"
          >
            {name}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="mt-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-black font-semibold"
      >
        ➕ Add User
      </button>

      {showAdd && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-[#171b2e] p-6 rounded-xl shadow-lg modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">Add New User</h2>
            <input
              type="text"
              placeholder="Enter name"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              className="w-full p-2 rounded-md text-black mb-3"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="bg-gray-500 px-3 py-1 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm text-black font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
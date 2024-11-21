import React, { useState, useEffect } from "react";

function AddText({ user, onClose, refreshTexts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [friends, setFriends] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For friend search

  useEffect(() => {
    fetch(`https://lecotes-backend.onrender.com/api/friends/list?userId=${user.userId}`)
      .then((response) => response.json())
      .then((data) => setFriends(data))
      .catch((error) => console.error("Error fetching friends:", error));
  }, [user.userId]);

  const handleCheckboxChange = (email) => {
    setSharedWith((prevSharedWith) =>
      prevSharedWith.includes(email)
        ? prevSharedWith.filter((e) => e !== email)
        : [...prevSharedWith, email]
    );
  };

  const handleSubmit = () => {
    fetch("https://lecotes-backend.onrender.com/api/texts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: user.userId,
        title,
        content,
        sharedWith,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Text added successfully");
          setTitle("");
          setContent("");
          setSharedWith([]);
          refreshTexts();
          onClose();
        } else {
          alert("Error adding text");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  // Filter friends based on the search query
  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 animate-fade-in-up">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Add New Text</h3>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-300"
          />
        </div>
        <div className="relative mb-4">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-300"
          />
        </div>

        {/* Share with Friends */}
        <h4 className="text-lg font-semibold text-purple-600 mb-2">
          Share with Friends
        </h4>
        <div className="relative mb-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400"
          />
        </div>

        {/* Friend List */}
        <div className="overflow-y-auto max-h-32 border border-purple-300 rounded-lg p-3">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend.email}
                className="flex items-center justify-between mb-2"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sharedWith.includes(friend.email)}
                    onChange={() => handleCheckboxChange(friend.email)}
                    className="mr-2 accent-purple-500"
                  />
                  <span className="text-sm text-purple-700 font-medium">
                    {friend.username}
                  </span>
                </label>
                <span className="text-xs text-gray-500">{friend.email}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No friends found</p>
          )}
        </div>

        {/* Selected Friends Summary */}
        {sharedWith.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-purple-600 mb-2">
              Shared With:
            </h5>
            <div className="flex flex-wrap gap-2">
              {sharedWith.map((email) => (
                <span
                  key={email}
                  className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg text-sm"
                >
                  {email}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-transform duration-300 hover:scale-105"
          >
            Add Text
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-transform duration-300 hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddText;

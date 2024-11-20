import React, { useState } from "react";

function AddFriendModal({ user, onClose }) {
  const [email, setEmail] = useState("");

  const handleAddFriend = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/friends/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: user.userId, receiverEmail: email }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Friend request sent!");
          setEmail(""); // Clear the input
          onClose(); // Close the modal
        } else {
          alert("Error sending friend request.");
        }
      })
      .catch((error) => console.error("Error sending friend request:", error));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 animate-fade-in-down">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Add a Friend</h3>
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Friend's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-300"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-purple-400">
            <i className="heroicons-envelope"></i>
          </span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddFriend}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-transform duration-300 hover:scale-105"
          >
            Send Request
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

export default AddFriendModal;

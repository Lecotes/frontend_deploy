import React, { useEffect, useState } from "react";
import { UserAddIcon } from "@heroicons/react/solid"; 
import AddFriendModal from "./AddFriend";

function FriendsList({ user }) {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false); // State for modal visibility

  const fetchFriends = () => {
    fetch(`/api/friends/list?userId=${user.userId}`)
      .then((response) => response.json())
      .then((data) => setFriends(data))
      .catch((error) => console.error("Error fetching friends list:", error));
  };

  useEffect(() => {
    fetchFriends();
  }, [user.userId]);

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header with Add Friend Icon */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Friends</h2>
        <button
          onClick={() => setIsAddFriendModalOpen(true)} // Open the modal
          className="flex items-center justify-center w-10 h-10 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-transform duration-300 hover:scale-105"
          aria-label="Add Friend"
        >
          <UserAddIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
        />
      </div>

      {/* Scrollable Friends List */}
      <div className="overflow-y-auto max-h-64">
        {filteredFriends.length > 0 ? (
          <ul className="divide-y divide-purple-200">
            {filteredFriends.map((friend) => (
              <li
                key={friend.email}
                className="p-2 flex justify-between items-center hover:bg-purple-50 transition duration-200 rounded-md"
              >
                <span className="text-purple-700 font-medium">
                  {friend.username}
                </span>
                <span className="text-gray-500 text-sm">{friend.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">No friends found.</div>
        )}
      </div>

      {/* Add Friend Modal */}
      {isAddFriendModalOpen && (
        <AddFriendModal
          user={user}
          onClose={() => setIsAddFriendModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
}

export default FriendsList;
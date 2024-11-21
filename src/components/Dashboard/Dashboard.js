import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FriendsList from "./FriendsList";
import Notifications from "./Notifications";
import AddFriendModal from "./AddFriend";
import AddText from "./AddText";

function Dashboard({ user, setUser }) {
  const [texts, setTexts] = useState({ owned: [], shared: [] });
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isAddTextModalOpen, setIsAddTextModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  const fetchTexts = useCallback(() => {
    fetch(`https://lecotes-backend.onrender.com/api/texts?userId=${user.userId}`)
      .then((response) => response.json())
      .then((data) => setTexts(data))
      .catch((error) => console.error("Error fetching texts:", error));
  }, [user.userId]);

  useEffect(() => {
    fetchTexts();
  }, [fetchTexts]);

  const handleLogout = () => {
    fetch("https://lecotes-backend.onrender.com/api/auth/logout", { method: "POST" })
      .then(() => setUser(null))
      .catch((error) => console.error("Error logging out:", error));
  };

  const handleOpenText = (id) => {
    navigate(`/text/${id}`);
  };

  const handleDeleteText = (id) => {
    fetch(`https://lecotes-backend.onrender.com/api/texts/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          alert('Text deleted successfully');
          fetchTexts(); // Refresh the texts after deletion
        } else {
          // You can log the response for more insight on why it's failing
          response.json().then((data) => {
            console.error(data);
            alert('Error deleting text');
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting text:', error);
        alert('Error deleting text');
      });
  };
  

  // Filtered texts based on the search query
  const filteredOwnedTexts = texts.owned.filter((text) =>
    text.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSharedTexts = texts.shared.filter((text) =>
    text.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <div className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-purple-700 font-poppins">
            Welcome, {user.username}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-transform duration-300 hover:scale-105"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section - Owned and Shared Files */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-600">My Files</h2>
              <button
                onClick={() => setIsAddTextModalOpen(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-transform duration-300 hover:scale-105"
              >
                Add New Text
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
              />
            </div>

            {/* Owned Files Table */}
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Owned Files
            </h3>
            <table className="w-full border-collapse border border-purple-300 rounded-md overflow-hidden">
              <thead>
                <tr className="bg-purple-100">
                  <th className="px-4 py-2 text-left font-semibold text-purple-700">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-purple-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOwnedTexts.map((text) => (
                  <tr key={text.id} className="border-t hover:bg-purple-50">
                    <td className="px-4 py-2">{text.title}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleOpenText(text.id)}
                        className="text-purple-500 hover:underline"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDeleteText(text.id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Shared Files Table */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">
                Shared with Me
              </h3>
              <table className="w-full border-collapse border border-purple-300 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="px-4 py-2 text-left font-semibold text-purple-700">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-purple-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSharedTexts.map((text) => (
                    <tr key={text.id} className="border-t hover:bg-purple-50">
                      <td className="px-4 py-2">{text.title}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleOpenText(text.id)}
                          className="text-purple-500 hover:underline"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Section - Friends & Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FriendsList user={user} />
            <h2 className="text-2xl font-bold text-purple-600 mt-6 mb-4">
              Notifications
            </h2>
            <Notifications user={user} />
          </div>
        </div>
      </div>

      {isAddTextModalOpen && (
        <AddText user={user} onClose={() => setIsAddTextModalOpen(false)} refreshTexts={fetchTexts} />
      )}
      {isAddFriendModalOpen && (
        <AddFriendModal user={user} onClose={() => setIsAddFriendModalOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;

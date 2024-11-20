import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, UserIcon } from "@heroicons/react/solid";

function Notifications({ user }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    fetch(`/api/friends/requests?userId=${user.userId}`)
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error fetching friend requests:", error));
  };

  useEffect(() => {
    fetchRequests();
  }, [user.userId]);

  const handleRequest = (requestId, status) => {
    fetch(`/api/friends/request/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    })
      .then(() => {
        fetchRequests(); // Refresh requests after handling
      })
      .catch((error) => console.error("Error updating request:", error));
  };

  return (
    <div className="w-full">
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between bg-white border border-purple-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Sender Info */}
              <div className="flex items-center space-x-3">
                <UserIcon className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-purple-700 font-medium">
                    {request.senderusername || "Unknown User"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {request.senderemail || "No Email"}
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequest(request.id, "approved")}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-transform duration-200 hover:scale-110"
                  aria-label="Approve"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRequest(request.id, "denied")}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform duration-200 hover:scale-110"
                  aria-label="Deny"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">
          No new friend requests.
        </div>
      )}
    </div>
  );
}

export default Notifications;

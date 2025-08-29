"use client";

import { useEffect, useState } from "react";

export default function Collaborators() {
  const [users, setUsers] = useState([
    { id: 1, name: "Arhan", color: "bg-green-500" },
    { id: 2, name: "Guest", color: "bg-blue-500" },
  ]);

  // In a real app, fetch from WebRTC awareness
  useEffect(() => {
    // fake collaborator updates
  }, []);

  return (
    <div className="flex space-x-2 items-center">
      {users.map((user) => (
        <div
          key={user.id}
          className={`${user.color} text-white rounded-full px-3 py-1 text-sm`}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

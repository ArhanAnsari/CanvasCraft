"use client";

import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-60 bg-gray-100 dark:bg-gray-900 p-4 shadow-md h-screen">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Workspace
      </h2>
      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard"
            className="block p-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/editor"
            className="block p-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700"
          >
            Code Editor
          </Link>
        </li>
        <li>
          <Link
            href="/api-docs"
            className="block p-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700"
          >
            API Docs
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
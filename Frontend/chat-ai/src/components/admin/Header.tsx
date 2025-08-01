'use client';

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white border-b px-6 py-3 shadow-sm flex items-center justify-between">
      <h1 className="text-lg font-medium text-gray-800">Admin Panel</h1>

      <button
        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
        onClick={() => {
          // TODO: Add logout logic here (clear auth, redirect, etc.)
          console.log('Logout clicked');
        }}
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}

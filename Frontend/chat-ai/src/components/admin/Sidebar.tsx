'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  UserCircleIcon,
  PlusIcon,
  ListBulletIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

export default function Sidebar() {
  const pathname = usePathname();
  const [charOpen, setCharOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 shadow-md">
      <div className="p-6 text-2xl font-bold border-b border-gray-700 tracking-wide">
        Admin Panel
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive('/admin') ? 'bg-gray-800 text-blue-400 font-semibold' : 'hover:bg-gray-700'
              }`}
            >
              <UserCircleIcon className="w-5 h-5" />
              Dashboard
            </Link>
          </li>

          {/* Manage Characters */}
          <li>
            <button
              className="flex items-center w-full gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setCharOpen(!charOpen)}
            >
              {charOpen ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              )}
              <span className="font-semibold text-white">Manage Characters</span>
            </button>
            {charOpen && (
              <ul className="ml-6 mt-2 space-y-1">
                <li>
                  <Link
                    href="/admin/characters/add"
                    className={`block px-4 py-1 rounded hover:bg-gray-700 ${
                      isActive('/admin/characters/add') ? 'text-blue-400 font-semibold' : ''
                    }`}
                  >
                    ➕ Add Character
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/characters"
                    className={`block px-4 py-1 rounded hover:bg-gray-700 ${
                      isActive('/admin/characters') ? 'text-blue-400 font-semibold' : ''
                    }`}
                  >
                    📄 List Characters
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

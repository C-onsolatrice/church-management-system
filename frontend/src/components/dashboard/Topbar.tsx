"use client";

import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import NotificationBell from "./NotificationBell";

interface UserData {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({
  onMenuClick,
}: TopbarProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Admin User";

  const displayRole = user?.role || "Super Admin";

  const initial =
    displayName.charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6 lg:px-8">
      <div className="flex w-full items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden min-w-0 md:block">
          <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
            Church Management
          </h2>

          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            Manage your church activities
          </p>
        </div>

        <div className="ml-auto hidden w-full max-w-md md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              placeholder="Search..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-slate-100 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />

          <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen((value) => !value)
              }
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {mounted ? initial : "A"}
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {mounted ? displayName : "Admin User"}
                </p>

                <p className="max-w-32 truncate text-xs text-slate-500 dark:text-slate-400">
                  {mounted ? displayRole : "Super Admin"}
                </p>
              </div>

              <ChevronDown
                className={[
                  "hidden h-4 w-4 text-slate-400 transition sm:block",
                  profileOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || "admin@example.com"}
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {displayRole}
                  </span>
                </div>

                <div className="p-2">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile & Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
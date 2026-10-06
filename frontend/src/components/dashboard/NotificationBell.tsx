"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 className="font-semibold">Notifications</h3>

          <p className="mt-3 text-sm text-gray-500">
            No notifications yet.
          </p>
        </div>
      )}
    </div>
  );
}
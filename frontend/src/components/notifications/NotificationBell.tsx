"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";
import socket from "@/lib/socket";

export default function NotificationBell() {
  const [count, setCount] =
    useState(0);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    async function load() {
      try {
        const response =
          await api.get(
            "/notifications/unread",
          );

        setCount(
          Number(response.data) || 0,
        );
      } catch (error) {
        console.error(
          "Notification error:",
          error,
        );
      }
    }

    load();

    socket.on(
      "newNotification",
      () => {
        setCount(
          (current) => current + 1,
        );
      },
    );

    return () => {
      socket.off(
        "newNotification",
      );
    };
  }, []);

  return (
    <button
      type="button"
      className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span className="text-xl">
        🔔
      </span>

      {mounted && count > 0 && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      )}
    </button>
  );
}
"use client";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Members",
    path: "/dashboard/members",
  },
  {
    name: "Attendance",
    path: "/dashboard/attendance",
  },
  {
    name: "Tithes",
    path: "/dashboard/tithes",
  },
  {
    name: "Events",
    path: "/dashboard/events",
  },
  {
    name: "Reports",
    path: "/dashboard/reports",
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.cookie =
      "token=; path=/; max-age=0";

    router.push("/login");
  }

  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white p-5 md:block dark:border-gray-800 dark:bg-gray-900">
      <h1 className="mb-8 text-2xl font-bold">
        ⛪ ConsolaCMS
      </h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="block rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-8 w-full rounded-lg bg-red-600 px-4 py-3 text-white"
      >
        Logout
      </button>
    </aside>
  );
}
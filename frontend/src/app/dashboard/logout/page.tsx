"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.cookie =
      "token=; path=/; max-age=0";

    router.replace("/login");
  }, [router]);

  return (
    <div className="p-10 text-center">
      Logging out...
    </div>
  );
}
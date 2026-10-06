"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data?.access_token;

      if (!token) {
        throw new Error("Access token was not returned by the server.");
      }

      localStorage.setItem("token", token);

      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user),
        );
      }

      document.cookie = `token=${token}; path=/`;

      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err?.response?.status === 404) {
        setError(
          "Login API ntiboneka. Reba /api/v1/auth/login kuri backend.",
        );
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Login failed",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-3xl font-bold">Login</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
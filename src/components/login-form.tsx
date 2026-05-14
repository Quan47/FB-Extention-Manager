"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl">
      <h1 className="text-2xl font-semibold">Ads Manager</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Sign in to manage extension users</p>

      <label className="mt-6 block text-sm font-medium">Username</label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none ring-[var(--brand)] transition focus:ring"
        placeholder="your_username"
      />

      <label className="mt-4 block text-sm font-medium">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none ring-[var(--brand)] transition focus:ring"
        placeholder="••••••••"
      />

      {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-[var(--brand)] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

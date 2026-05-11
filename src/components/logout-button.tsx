"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  className?: string;
  label?: string;
};

export function LogoutButton({ className = "", label = "Logout" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      disabled={loading}
      className={`rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 ${className}`}
    >
      {loading ? "Logging out..." : label}
    </button>
  );
}

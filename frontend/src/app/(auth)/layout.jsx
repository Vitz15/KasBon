"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AuthLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);
  return <div className="min-h-screen">{children}</div>;
}

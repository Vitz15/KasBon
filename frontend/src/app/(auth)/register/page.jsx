"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  User,
  Mail,
  Lock,
  Shield,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("kasir");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await register(
      name,
      email,
      password,
      passwordConfirmation,
      role,
    );
    if (res.success) {
      router.push("/login");
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ShoppingBag className="h-3.5 w-3.5" />,
      title: "Manajemen Stok Barang",
      desc: "Pantau stok dan notifikasi barang menipis",
    },
    {
      icon: <Users className="h-3.5 w-3.5" />,
      title: "Buku KasBon Digital",
      desc: "Catat dan kelola hutang pelanggan otomatis",
    },
    {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      title: "Laporan Keuangan",
      desc: "Ekspor laporan penjualan harian dan bulanan",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute -top-20 -left-10 w-96 h-96 rounded-full bg-primary-600 opacity-[0.18] blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-10 w-96 h-96 rounded-full bg-primary-500 opacity-[0.12] blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="KasBon Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-semibold text-[15px] tracking-tight">
            KasBon Digital
          </span>
        </div>

        {/* Tagline + Features */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white leading-snug">
              Mulai Kelola
              <br />
              <span className="text-primary-400">Warung Anda.</span>
            </h1>
            <p className="mt-3 text-slate-400 text-[13px] leading-relaxed max-w-sm">
              Daftar sekarang dan nikmati kemudahan mengelola stok, hutang
              pelanggan, dan laporan keuangan dalam satu platform.
            </p>
          </div>

          <div className="space-y-2">
            {features.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3.5 py-2.5"
              >
                <div className="w-7 h-7 rounded-md bg-primary-500/15 flex items-center justify-center flex-shrink-0 text-primary-400">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white text-[12.5px] font-medium">{item.title}</p>
                  <p className="text-slate-500 text-[11.5px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-slate-600 text-[11px]">© 2026 KasBon Digital</p>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-10 py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-7">
            <img
              src="/logo.png"
              alt="KasBon Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-slate-900 font-semibold text-[15px]">
              KasBon Digital
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider mb-1.5">
              Buat Akun
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Daftar Akun Warung
            </h2>
            <p className="mt-1.5 text-[13px] text-slate-500">
              Mulai integrasikan buku hutang dan stok barang toko
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-1" onSubmit={handleSubmit}>
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Nama Pemilik / Kasir"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label="Alamat Email"
              type="email"
              placeholder="contoh@warung.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Hak Akses / Peran
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-4 w-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full text-sm rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="kasir">Kasir</option>
                  <option value="owner">Pemilik Toko (Owner)</option>
                </select>
              </div>
            </div>

            <Input
              label="Kata Sandi"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
            />

            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" loading={loading}>
                <span>Daftar Sekarang</span>
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-[13px]">
            <span className="text-slate-400">Sudah punya akun warung? </span>
            <Link
              href="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

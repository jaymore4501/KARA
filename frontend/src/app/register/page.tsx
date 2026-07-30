"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-15%] w-[500px] h-[500px] rounded-full bg-brand-secondary/5 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-[170px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-brand-primary/20 blur-sm" />
            <div className="relative w-full h-full rounded-xl bg-brand-bg flex items-center justify-center overflow-hidden">
              <img src="/KARA-LOGO.png" alt="KARA Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          <span className="font-display font-bold text-2xl tracking-wider bg-gradient-to-r from-white via-brand-highlight to-brand-primary bg-clip-text text-transparent">
            KARA
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-white mb-2">Create Your Account</h1>
            <p className="text-xs text-brand-text-secondary font-light">
              Deploy your first autonomous startup in minutes
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl text-xs text-brand-danger text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 pl-11 pr-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 pl-11 pr-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 pl-11 pr-12 rounded-xl text-sm text-white placeholder-white/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 pl-11 pr-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative group overflow-hidden w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-brand-primary to-brand-highlight transition-transform duration-500 ease-out" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-brand-text-secondary mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-highlight hover:text-white transition-colors font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

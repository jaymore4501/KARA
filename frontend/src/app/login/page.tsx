"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getAssetUrl } from "@/lib/assets";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-brand-secondary/5 blur-[170px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-brand-primary/20 blur-sm" />
            <div className="relative w-full h-full rounded-xl bg-brand-bg flex items-center justify-center overflow-hidden">
              <img src={getAssetUrl("/KARA-LOGO.png")} alt="KARA Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          <span className="font-display font-bold text-2xl tracking-wider bg-gradient-to-r from-white via-brand-highlight to-brand-primary bg-clip-text text-transparent">
            KARA
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-white mb-2">Welcome Back</h1>
            <p className="text-xs text-brand-text-secondary font-light">
              Sign in to your autonomous startup workspace
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl text-xs text-brand-danger text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  placeholder="••••••••"
                  required
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative group overflow-hidden w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Authenticating..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-brand-primary to-brand-highlight transition-transform duration-500 ease-out" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow h-[1px] bg-white/5" />
            <span className="text-[10px] font-mono text-brand-text-secondary uppercase">or</span>
            <div className="flex-grow h-[1px] bg-white/5" />
          </div>

          {/* OAuth Buttons (placeholders for now) */}
          <div className="flex flex-col gap-3">
            <button className="w-full py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-primary/30 text-white transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button className="w-full py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-primary/30 text-white transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-brand-text-secondary mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-highlight hover:text-white transition-colors font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

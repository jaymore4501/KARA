"use client";

import React, { useState } from "react";
import { Settings, User, CreditCard, Bell, Shield, Palette } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-primary" />
          Settings
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-brand-primary/10 text-brand-highlight border border-brand-primary/20"
                : "text-brand-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="glass-card rounded-2xl p-8 animate-fadeIn">
          <h2 className="text-sm font-semibold text-white mb-6">Profile Information</h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-secondary to-brand-primary flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{user?.name || "User"}</h3>
                <p className="text-[10px] text-brand-text-secondary">{user?.email || ""}</p>
                <p className="text-[9px] font-mono text-brand-primary uppercase mt-1">{user?.plan || "Free"} Plan</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3 px-4 rounded-xl text-sm text-white transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3 px-4 rounded-xl text-sm text-white transition-all"
              />
            </div>

            <button className="self-start flex items-center gap-2 rounded-xl text-xs font-semibold px-6 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all mt-2">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab !== "profile" && (
        <div className="glass-card rounded-2xl p-12 text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-brand-text-secondary mb-4">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Coming Soon</h3>
          <p className="text-[10px] text-brand-text-secondary max-w-sm mx-auto">
            The {tabs.find((t) => t.id === activeTab)?.label} settings will be available in a future update.
          </p>
        </div>
      )}
    </div>
  );
}

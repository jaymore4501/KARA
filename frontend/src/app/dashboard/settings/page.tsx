"use client";

import React, { useState } from "react";
import { Settings, User, CreditCard, Bell, Shield, Palette, Lock, Check, AlertCircle, Info } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api";

export default function SettingsPage() {
  const { 
    user, 
    accessToken,
    notifications,
    notificationsRead,
    markAllNotificationsAsRead,
    markNotificationAsRead
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    
    setIsChanging(true);
    setMessage(null);
    try {
      if (!accessToken) throw new Error("No access token found. Please re-login.");
      await authApi.changePassword(accessToken, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to change password" });
    } finally {
      setIsChanging(false);
    }
  };

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

      {activeTab === "security" && (
        <div className="glass-card rounded-2xl p-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Security Settings</h2>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Update your account credentials</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
            {message && (
              <div className={`p-3.5 rounded-xl text-xs font-medium border ${
                message.type === "success" 
                  ? "bg-brand-success/10 text-brand-success border-brand-success/20 animate-fadeIn" 
                  : "bg-brand-danger/10 text-brand-danger border-brand-danger/20 animate-fadeIn"
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#0E0B16] border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3 px-4 rounded-xl text-sm text-white placeholder-white/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className="w-full bg-[#0E0B16] border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3 px-4 rounded-xl text-sm text-white placeholder-white/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full bg-[#0E0B16] border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3 px-4 rounded-xl text-sm text-white placeholder-white/20 transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isChanging}
              className="self-start flex items-center gap-2 rounded-xl text-xs font-semibold px-6 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {isChanging ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="glass-card rounded-2xl p-8 animate-fadeIn flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white font-display">Workspace Notifications</h2>
                <p className="text-[10px] text-brand-text-secondary mt-0.5">Stay updated with your autonomous agent updates</p>
              </div>
            </div>

            {!notificationsRead && (
              <button 
                onClick={() => markAllNotificationsAsRead()}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono text-brand-highlight transition-all uppercase tracking-wider font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 bg-brand-bg/20">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-brand-text-secondary font-mono text-[10px]">
                NO NOTIFICATIONS TO REPORT.
              </div>
            ) : (
              notifications.map((notif) => {
                let Icon = Info;
                let notifColor = "text-brand-primary bg-brand-primary/10 border-brand-primary/20";
                if (notif.type === "success") {
                  Icon = Check;
                  notifColor = "text-brand-success bg-brand-success/10 border-brand-success/20";
                } else if (notif.type === "warning") {
                  Icon = AlertCircle;
                  notifColor = "text-brand-highlight bg-brand-highlight/10 border-brand-highlight/20";
                }

                return (
                  <div key={notif.id} className="p-4 hover:bg-white/[0.01] transition-colors flex gap-4 items-start relative group">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${notifColor} ${notif.read ? "opacity-40" : ""}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-highlight shrink-0 animate-pulse" />
                          )}
                          <h4 className={`text-xs font-semibold text-white truncate ${notif.read ? "text-brand-text-secondary/70 line-through" : ""}`}>
                            {notif.title}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono text-brand-text-secondary">{notif.time}</span>
                      </div>
                      <p className={`text-xs leading-normal font-light max-w-2xl ${notif.read ? "text-brand-text-secondary/40" : "text-brand-text-secondary"}`}>
                        {notif.message}
                      </p>
                    </div>

                    {/* Individual Mark as Read */}
                    {!notif.read && (
                      <button 
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="opacity-0 group-hover:opacity-100 flex items-center justify-center px-3 py-1.5 bg-brand-highlight/10 border border-brand-highlight/20 rounded-lg text-[9px] font-mono text-brand-highlight hover:bg-brand-highlight/20 transition-all uppercase tracking-wider cursor-pointer"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab !== "profile" && activeTab !== "security" && activeTab !== "notifications" && (
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

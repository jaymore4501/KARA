"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  FileText,
  BarChart3,
  Download,
  Settings,
  Sparkles,
  Search,
  Bell,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  Menu,
  X,
  Check,
  AlertCircle,
  Info,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getAssetUrl } from "@/lib/assets";
import { analyticsApi } from "@/lib/api";
import { fetchGitHubStars, formatStarCount } from "@/lib/github";

const sidebarNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "AI Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Exports", href: "/dashboard/exports", icon: Download },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    fetchUser, 
    logout, 
    accessToken,
    notifications,
    notificationsRead,
    markAllNotificationsAsRead,
  } = useAuthStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [creditsHovered, setCreditsHovered] = useState(false);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    fetchGitHubStars("jaymore4501/KARA").then((count) => setStarCount(count));
  }, []);

  const getNotifDetails = (type: string) => {
    switch (type) {
      case "success":
        return { icon: Check, color: "text-brand-success bg-brand-success/10 border-brand-success/20" };
      case "warning":
        return { icon: AlertCircle, color: "text-brand-highlight bg-brand-highlight/10 border-brand-highlight/20" };
      default:
        return { icon: Info, color: "text-brand-primary bg-brand-primary/10 border-brand-primary/20" };
    }
  };

  useEffect(() => {
    fetchUser().then(() => {
      const { isAuthenticated: isAuth } = useAuthStore.getState();
      if (!isAuth) {
        router.push("/login");
      }
    });
  }, [fetchUser, router]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      analyticsApi.getSummary(accessToken)
        .then((summary) => {
          setTotalTokensUsed(summary.total_tokens_used);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, accessToken]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          <span className="text-xs text-brand-text-secondary font-mono">INITIALIZING WORKSPACE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-brand-bg relative">
      {/* ─── Sidebar ──────────────────────────────────── */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-white/5 bg-brand-surface/80 backdrop-blur-xl transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        } hidden lg:flex`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-5 py-5 border-b border-white/5 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shadow-lg shrink-0">
            <div className="absolute inset-0 rounded-xl bg-brand-primary/20 blur-sm" />
            <div className="relative w-full h-full rounded-xl bg-brand-bg flex items-center justify-center overflow-hidden">
              <img src={getAssetUrl("/KARA-LOGO.png")} alt="KARA Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-white via-brand-highlight to-brand-primary bg-clip-text text-transparent">
              KARA
            </span>
          )}
        </div>

        {/* New Project Button */}
        <div className={`px-4 pt-5 pb-3 ${sidebarCollapsed ? "px-3" : ""}`}>
          <Link
            href="/dashboard/projects/new"
            className={`flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 ${
              sidebarCollapsed
                ? "w-10 h-10 justify-center mx-auto"
                : "px-4 py-3 w-full justify-center"
            }`}
          >
            <Plus className="w-4 h-4" />
            {!sidebarCollapsed && <span>New Startup</span>}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-2 overflow-y-auto scrollbar-none">
          <span className={`text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest px-2 mb-2 ${sidebarCollapsed ? "hidden" : ""}`}>
            WORKSPACE
          </span>
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                  sidebarCollapsed
                    ? "w-10 h-10 justify-center mx-auto"
                    : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-highlight border border-brand-primary/20"
                    : "text-brand-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle + User */}
        <div className="border-t border-white/5 p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-brand-text-secondary hover:text-white hover:bg-white/5 transition-all text-xs"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>

          {/* User Profile */}
          <div className={`mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user?.name || "User"}</div>
                <div className="text-[9px] text-brand-text-secondary truncate">{user?.email || ""}</div>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="text-brand-text-secondary hover:text-brand-danger transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Mobile Menu Overlay ──────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-brand-surface border-r border-white/5 flex flex-col animate-slideInRight">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] overflow-hidden shrink-0">
                  <img src={getAssetUrl("/KARA-LOGO.png")} alt="KARA Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="font-display font-bold text-lg text-white">KARA</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-brand-text-secondary hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-highlight"
                        : "text-brand-text-secondary hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ─── Main Content Area ────────────────────────── */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        {/* ─── Topbar ─────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3.5 border-b border-white/5 bg-brand-bg/80 backdrop-blur-xl">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-brand-text-secondary hover:text-white p-1.5"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, agents, documents..."
              className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/30 focus:outline-none py-2.5 pl-10 pr-4 rounded-xl text-xs text-white placeholder-white/30 transition-all"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 relative">
            
            {/* Star on GitHub Pill Badge */}
            <a
              href="https://github.com/jaymore4501/KARA"
              target="_blank"
              rel="noreferrer"
              className="group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 text-xs transition-all shadow-sm hover:shadow-amber-500/10 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current text-white/80 group-hover:text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="font-medium text-white/90 group-hover:text-white text-[11px]">Star</span>
              <span className="flex items-center gap-0.5 font-mono text-[9px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20 font-bold">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{formatStarCount(starCount !== null ? starCount : 2)}</span>
              </span>
            </a>
            
            {/* Credits Badge with Hover Tooltip */}
            <div 
              className="relative hidden md:flex items-center gap-1.5 bg-white/5 border border-white/5 py-1.5 px-3 rounded-full cursor-pointer transition-all hover:bg-white/10"
              onMouseEnter={() => setCreditsHovered(true)}
              onMouseLeave={() => setCreditsHovered(false)}
            >
              <CreditCard className="w-3.5 h-3.5 text-brand-highlight" />
              <span className="text-[10px] font-mono text-brand-highlight font-semibold">
                {user?.credits?.toLocaleString() || "1,000"}
              </span>

              {/* Credits hover tooltip card */}
              {creditsHovered && (
                <div className="absolute top-10 right-0 z-50 w-60 bg-[#161320] border border-white/10 p-4 rounded-2xl shadow-2xl animate-fadeIn text-left cursor-default">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                    <CreditCard className="w-4 h-4 text-brand-highlight" />
                    <span className="text-xs font-semibold text-white">Credits Allocation</span>
                  </div>
                  <div className="space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Initial Balance:</span>
                      <span className="text-white">1,000 CR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Tokens Consumed:</span>
                      <span className="text-brand-highlight">{(totalTokensUsed || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-brand-text-secondary font-bold">Remaining:</span>
                      <span className="text-brand-success font-bold">{(user?.credits || 1000).toLocaleString()} CR</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-brand-text-secondary/60 leading-normal mt-3">
                    * 1 Credit is charged per 1,000 API input/output tokens processed by KARA swarm agents.
                  </p>
                </div>
              )}
            </div>

            {/* Notifications Button + Dropdown Container */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-brand-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Bell className="w-4 h-4" />
                {!notificationsRead && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-danger animate-pulse border border-brand-bg" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute top-10 right-0 z-50 w-80 bg-[#161320] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-brand-primary" />
                      <span className="text-xs font-semibold text-white">Recent Notifications</span>
                    </div>
                    {!notificationsRead && (
                      <button 
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-[9px] font-mono text-brand-highlight hover:underline uppercase tracking-wider"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => {
                      const { icon: Icon, color } = getNotifDetails(notif.type);
                      return (
                        <div key={notif.id} className="p-3.5 hover:bg-white/[0.02] transition-colors flex gap-3 items-start text-left">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${color} ${notif.read ? "opacity-40" : ""}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-center gap-1">
                              <div className="flex items-center gap-1.5">
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-highlight shrink-0 animate-pulse" />
                                )}
                                <h4 className={`text-[10px] font-semibold text-white truncate ${notif.read ? "text-brand-text-secondary/70 line-through" : ""}`}>
                                  {notif.title}
                                </h4>
                              </div>
                              <span className="text-[8px] font-mono text-brand-text-secondary shrink-0">{notif.time}</span>
                            </div>
                            <p className={`text-[9px] leading-normal font-light ${notif.read ? "text-brand-text-secondary/40" : "text-brand-text-secondary"}`}>
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2 border-t border-white/5 bg-white/[0.01] text-center">
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="w-full py-1.5 text-[9px] font-mono text-brand-text-secondary hover:text-white uppercase tracking-wider transition-all"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar (mobile) */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

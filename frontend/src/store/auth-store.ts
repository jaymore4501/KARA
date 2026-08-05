/**
 * KARA Frontend - Auth Store (Zustand)
 * Global authentication state management.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type UserResponse } from "@/lib/api";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

interface AuthState {
  // State
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  notifications: NotificationItem[];
  notificationsRead: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      notifications: [
        {
          id: 1,
          title: "Nova CEO Agent completed task",
          message: "Business plan draft has been completed and added to project documents.",
          time: "2 mins ago",
          type: "success",
          read: false,
        },
        {
          id: 2,
          title: "Atlas Market Agent alert",
          message: "Competitor research analysis finished. Startup score computed at 88.",
          time: "15 mins ago",
          type: "info",
          read: false,
        },
        {
          id: 3,
          title: "Credits consumed",
          message: "Forge Software Architect consumed 12,000 tokens during workspace compilation.",
          time: "1 hour ago",
          type: "warning",
          read: false,
        },
      ],
      notificationsRead: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const tokens = await authApi.login({ email, password });
          set({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            isAuthenticated: true,
          });
          // Fetch user profile
          const user = await authApi.getMe(tokens.access_token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const tokens = await authApi.register({ name, email, password });
          set({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            isAuthenticated: true,
          });
          const user = await authApi.getMe(tokens.access_token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      fetchUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          const user = await authApi.getMe(accessToken);
          set({ user, isAuthenticated: true });
        } catch {
          // Token expired — try refresh
          const { refreshToken } = get();
          if (refreshToken) {
            try {
              const tokens = await authApi.refresh(refreshToken);
              set({
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
              });
              const user = await authApi.getMe(tokens.access_token);
              set({ user, isAuthenticated: true });
            } catch {
              get().logout();
            }
          } else {
            get().logout();
          }
        }
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      markAllNotificationsAsRead: () => {
        const updated = get().notifications.map(n => ({ ...n, read: true }));
        set({ notifications: updated, notificationsRead: true });
      },

      markNotificationAsRead: (id: number) => {
        const updated = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
        const allRead = updated.every(n => n.read);
        set({ notifications: updated, notificationsRead: allRead });
      },
    }),
    {
      name: "kara-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

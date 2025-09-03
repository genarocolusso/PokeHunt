// src/stores/useAuthStore.ts
import { create } from "zustand";
import { supabase } from "../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize user from Supabase session
  supabase.auth.getSession().then(({ data }) => {
    set({ user: data.session?.user ?? null, loading: false });
  });

  // Listen to auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null });
  });

  return {
    user: null,
    loading: true,

    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ user: data.user });
    },

    signUp: async (email, password, displayName) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: displayName } },
      });
      if (error) throw error;
      set({ user: data.user });
    },

    signOut: async () => {
      await supabase.auth.signOut();

      set({ user: null });
    },
  };
});

import { createClient } from "@supabase/supabase-js";

// AI Studio Note: The user hasn't provided real keys yet, so we'll gracefully handle it.
// Replace these with actual Supabase project URL and anon key in production.
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isAdmin = (email?: string) => {
  // Simple check for the demo
  return email === "admin@growthuper.com";
};

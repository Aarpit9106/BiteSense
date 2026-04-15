"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type AuthState = "idle" | "loading" | "sent" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!isSupabaseConfigured) {
      // Dev mode: skip auth, go straight to dashboard
      toast("Dev mode — skipping auth", { description: "Supabase is not configured." });
      router.push("/dashboard");
      return;
    }

    setAuthState("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthState("error");
        setErrorMsg(error.message);
        toast.error("Login failed", { description: error.message });
      } else {
        setAuthState("sent");
        toast.success("Magic link sent!", { description: "Check your email inbox." });
      }
    } catch {
      setAuthState("error");
      setErrorMsg("An unexpected error occurred. Please try again.");
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background bio-luminous-bg relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-600/20">
            <span className="text-white font-bold text-xl tracking-tighter">B</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your BiteSense account
          </p>
        </div>

        {/* Card */}
        <GlassCard variant="elevated" padding="lg">
          {authState === "sent" ? (
            // Success state
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold">Check your email</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                We sent a magic link to<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Click the link in the email to sign in. It may take a minute.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-5"
                onClick={() => setAuthState("idle")}
              >
                Use a different email
              </Button>
            </motion.div>
          ) : (
            // Login form
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    disabled={authState === "loading"}
                    className="flex h-12 w-full rounded-xl bg-background/60 pl-10 pr-4 py-2 border border-border/50 text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 disabled:opacity-50"
                  />
                </div>
              </div>

              {authState === "error" && errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-xs text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={authState === "loading" || !email.trim()}
              >
                {authState === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Continue with Email
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </GlassCard>

        {/* Dev mode notice */}
        {!isSupabaseConfigured && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-[11px] text-amber-600 dark:text-amber-400 mt-4 px-4"
          >
            ⚠️ Dev mode — Supabase not configured. Login will skip auth.
          </motion.p>
        )}

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          No password needed · Magic link sign-in
        </p>
      </motion.div>
    </main>
  );
}

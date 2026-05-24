"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo-icon";
import { Loader2 } from "lucide-react";

// ─── Brand SVG icons ─────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0 fill-white">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

// ─── Login page ───────────────────────────────────────────────────────────────

type Provider = "google" | "apple" | null;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<Provider>(null);

  const handleSignIn = (provider: "google" | "apple") => {
    if (loading) return;
    setLoading(provider);
    // Simulate OAuth handshake — redirect to dashboard after brief delay
    setTimeout(() => router.push("/dashboard"), 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col items-center justify-center px-4">

      {/* Back to landing */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogoIcon className="w-6 h-6" />
        <span className="font-heading font-bold text-foreground">PropKeep</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-[380px] bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/5 px-8 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
              <LogoIcon className="w-7 h-7" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1.5">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue to PropKeep</p>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">

          {/* Google */}
          <button
            onClick={() => handleSignIn("google")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {loading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              <GoogleIcon />
            )}
            {loading === "google" ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSignIn("apple")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-[#111] text-sm font-medium text-white hover:bg-[#222] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {loading === "apple" ? (
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
            ) : (
              <AppleIcon />
            )}
            {loading === "apple" ? "Signing in…" : "Continue with Apple"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Demo shortcut */}
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center h-10 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-50 border border-dashed border-gray-200 transition-all"
        >
          Skip to demo dashboard →
        </Link>

        {/* Fine print */}
        <p className="text-center text-[11px] text-muted-foreground mt-6 leading-relaxed">
          By continuing, you agree to PropKeep&apos;s{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">Terms</span>
          {" "}and{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>.
        </p>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/pricing" className="text-primary font-medium hover:underline">
          Get started free
        </Link>
      </p>
    </div>
  );
}

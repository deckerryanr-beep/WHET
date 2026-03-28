"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Auto-redirect after brief confirmation
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-border/50 px-6 h-16 flex items-center">
          <Link href="/" className="font-serif text-2xl gold-shimmer font-bold">
            WHET
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-6">✓</div>
            <h1 className="font-serif text-3xl text-text-primary mb-3">
              Welcome to WHET
            </h1>
            <p className="text-text-secondary text-sm">
              Your taste profile is being created. Redirecting you now...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border/50 px-6 h-16 flex items-center">
        <Link href="/" className="font-serif text-2xl gold-shimmer font-bold">
          WHET
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="font-serif text-4xl text-text-primary mb-2">
              Build your taste profile
            </h1>
            <p className="text-text-secondary text-sm">
              WHET learns what you love and finds you what&apos;s next.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-sm px-4 py-3 rounded-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="label">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="First name is fine"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile..." : "Start My Taste Profile"}
            </button>

            <p className="text-center text-text-muted text-xs">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </form>

          <div className="divider" />

          <p className="text-center text-text-secondary text-sm">
            Already have a profile?{" "}
            <Link
              href="/login"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";


export default function Navigation({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-md bg-background/90">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-serif text-xl gold-shimmer font-bold tracking-tight"
        >
          WHET
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
              pathname === "/dashboard"
                ? "text-text-primary bg-surface-2"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/advisor"
            className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
              pathname === "/advisor"
                ? "text-gold bg-gold/10"
                : "text-text-secondary hover:text-gold hover:bg-gold/5"
            }`}
          >
            Advisor ✦
          </Link>

          {/* Log dropdown trigger */}
          <div className="relative group">
            <button className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-sm transition-colors flex items-center gap-1">
              Log
              <span className="text-xs opacity-50">▾</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-border rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              {[
                { href: "/log/wine", label: "🍷 Wine" },
                { href: "/log/whiskey", label: "🥃 Whiskey" },
                { href: "/log/athletic-wear", label: "👟 Athletic Wear" },
                { href: "/log/going-out-wear", label: "👗 Going Out Wear" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={handleSignOut}
              className="hidden md:block text-text-muted text-xs hover:text-text-secondary transition-colors"
            >
              Sign Out
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span
                className={`block h-px bg-current transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-1" : ""}`}
              />
              <span
                className={`block h-px bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px bg-current transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-6 py-4 space-y-1">
            <Link
              href="/dashboard"
              className="block py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/advisor"
              className="block py-2.5 text-sm text-gold hover:text-gold-light transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Advisor ✦
            </Link>
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">
                Log
              </p>
              {[
                { href: "/log/wine", label: "🍷 Wine" },
                { href: "/log/whiskey", label: "🥃 Whiskey" },
                { href: "/log/athletic-wear", label: "👟 Athletic Wear" },
                { href: "/log/going-out-wear", label: "👗 Going Out Wear" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {user && (
              <button
                onClick={() => { setMenuOpen(false); handleSignOut(); }}
                className="block w-full text-left py-2.5 text-sm text-text-muted hover:text-text-secondary transition-colors border-t border-border mt-2 pt-4"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

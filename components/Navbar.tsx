"use client";

import { useState } from "react";
import Link from "next/link";
import type { CartItem } from "@/lib/data";

const LINKS = [
  { label: "Collections", href: "/products" },
  { label: "Nouveautés", href: "/products" },
  { label: "Soldes", href: "/products" },
  { label: "À propos", href: "/" },
];

type Props = {
  cartCount: number;
  onCartOpen: () => void;
};

export default function Navbar({ cartCount, onCartOpen }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-16 h-16"
        style={{
          background: "oklch(0.987 0.022 95.277 / 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "0.5px solid #d4c5b0",
        }}
      >
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold tracking-[0.18em] uppercase" style={{ color: "#2a2318" }}>
          Aurum
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs tracking-[0.2em] uppercase font-body transition-opacity hover:opacity-40"
              style={{ color: "#2a2318" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          {/* Search icon */}
          <button className="hidden md:block transition-opacity hover:opacity-40" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" strokeLinecap="round" />
            </svg>
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 transition-opacity hover:opacity-40"
            aria-label="Panier"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center"
                style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span
              className="block h-px w-6 transition-all duration-300"
              style={{
                background: "#2a2318",
                transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
              }}
            />
            <span
              className="block h-px transition-all duration-300"
              style={{
                background: "#2a2318",
                width: mobileOpen ? "24px" : "16px",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px w-6 transition-all duration-300"
              style={{
                background: "#2a2318",
                transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-10 md:hidden transition-all duration-300"
        style={{
          background: "oklch(0.962 0.059 95.617)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "all" : "none",
        }}
      >
        {LINKS.map((l, i) => (
          <Link
            key={l.label}
            href={l.href}
            className="font-display text-3xl font-bold tracking-wide"
            style={{
              color: "#2a2318",
              transitionDelay: `${i * 60}ms`,
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
            onClick={() => setMobileOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <button
          onClick={onCartOpen}
          className="mt-4 px-8 py-3 text-xs tracking-[0.25em] uppercase border"
          style={{ borderColor: "#2a2318", color: "#2a2318" }}
        >
          Panier {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </div>
    </>
  );
}

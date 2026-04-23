"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = { onShop: () => void };

export default function Hero({ onShop }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pt-16">
      {/* Background split */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[60%_40%]">
        <div style={{ background: "oklch(0.987 0.022 95.277)" }} />
        <div style={{ background: "oklch(0.962 0.059 95.617)" }} />
      </div>

      {/* Giant background typography */}
      <div
        className="absolute inset-0 flex items-center justify-start pl-4 md:pl-10 pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-black leading-none"
          style={{
            fontSize: "clamp(80px, 22vw, 280px)",
            color: "oklch(0.962 0.059 95.617)",
            letterSpacing: "-0.04em",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 1.1s ease, transform 1.1s ease",
            transitionDelay: "0.1s",
          }}
        >
          AURUM
        </span>
      </div>

      {/* Decorative vertical line */}
      <div
        className="absolute left-1/2 top-20 bottom-0 w-px hidden md:block"
        style={{ background: "#d4c5b0", opacity: 0.6 }}
        aria-hidden
      />

      {/* Content grid */}
      <div className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-24 grid md:grid-cols-2 gap-16 items-end">
        {/* Left — headline */}
        <div className="flex flex-col gap-7 max-w-lg">
          <div
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.3s",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-10" style={{ background: "#8a7355" }} />
              <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: "#8a7355" }}>
                SS 2026 Collection
              </span>
            </div>

            <h1
              className="font-display leading-[1.02]"
              style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 700, color: "#2a2318", letterSpacing: "-0.02em" }}
            >
              Wear the<br />
              <em style={{ color: "#8a7355", fontStyle: "italic" }}>quiet</em>
              <br />luxury.
            </h1>
          </div>

          <p
            className="text-sm md:text-base leading-[1.8] max-w-sm"
            style={{
              color: "#6b5b47",
              opacity: ready ? 1 : 0,
              transform: ready ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.5s",
            }}
          >
            Elevated basics crafted from the finest natural fabrics.
            Effortless. Intentional. Made to last.
          </p>

          <div
            className="flex gap-3 flex-wrap"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.65s",
            }}
          >
            <button
              onClick={onShop}
              className="px-7 py-3.5 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-200 hover:opacity-80 active:scale-[0.98]"
              style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
            >
              Acheter maintenant
            </button>
            <Link
              href="/products"
              className="px-7 py-3.5 text-xs tracking-[0.25em] uppercase font-medium border transition-all duration-200 hover:opacity-60 inline-block"
              style={{ borderColor: "#2a2318", color: "#2a2318" }}
            >
              Lookbook →
            </Link>
          </div>

          {/* Trust chips */}
          <div
            className="flex flex-wrap gap-4 pt-2"
            style={{
              opacity: ready ? 1 : 0,
              transition: "opacity 0.8s ease",
              transitionDelay: "0.85s",
            }}
          >
            {["100% fibres naturelles", "Livraison Algérie", "Paiement Dahabia"].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase"
                style={{ color: "#8a7355" }}
              >
                <span style={{ color: "#8a7355" }}>✦</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — hero image */}
        <div
          className="relative"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease, transform 1s ease",
            transitionDelay: "0.4s",
          }}
        >
          <div
            className="aspect-[3/4] overflow-hidden max-w-sm ml-auto"
            style={{ border: "0.5px solid #d4c5b0" }}
          >
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85"
              alt="Model wearing Aurum clothing"
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Floating badge */}
          <div
            className="absolute -bottom-5 -left-5 md:-left-10 p-5"
            style={{
              background: "oklch(0.962 0.059 95.617)",
              border: "0.5px solid #d4c5b0",
              minWidth: "170px",
            }}
          >
            <p className="text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color: "#8a7355" }}>
              Pièce vedette
            </p>
            <p className="font-display text-sm font-semibold" style={{ color: "#2a2318" }}>
              Silk Wrap Blazer
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b5b47" }}>21 800 DZD</p>
          </div>

          {/* Edition badge */}
          <div
            className="absolute top-6 -right-3 md:right-0 flex flex-col items-center justify-center text-center w-16 h-16 rounded-full"
            style={{ background: "#2a2318" }}
          >
            <span className="text-[8px] tracking-[0.15em] uppercase leading-tight" style={{ color: "oklch(0.962 0.059 95.617)" }}>
              Éd.<br />Lim.
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#8a7355" }}>
          Défiler
        </span>
        <div className="w-px h-10" style={{ background: "#c9b99a", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

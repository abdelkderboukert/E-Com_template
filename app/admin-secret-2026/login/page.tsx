"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin-secret-2026");
    } else {
      const data = await res.json();
      setError(data.error ?? "Identifiants incorrects.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "oklch(0.987 0.022 95.277)" }}
    >
      {/* Brand mark */}
      <div className="mb-10 text-center">
        <p className="text-[10px] tracking-[0.5em] uppercase mb-2" style={{ color: "#8a7355" }}>
          ✦ Administration
        </p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: "clamp(28px, 5vw, 42px)", color: "#2a2318", letterSpacing: "-0.02em" }}
        >
          Aurum
        </h1>
        <div className="h-px w-16 mx-auto mt-4" style={{ background: "#d4c5b0" }} />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm p-8"
        style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}
      >
        <h2
          className="font-display text-xl font-medium mb-1"
          style={{ color: "#2a2318" }}
        >
          Accès restreint
        </h2>
        <p className="text-xs mb-7" style={{ color: "#8a7355" }}>
          Connectez-vous pour accéder au tableau de bord.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] tracking-[0.25em] uppercase mb-1.5"
              style={{ color: "#6b5b47" }}
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@aurum.dz"
              className="w-full px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "oklch(0.987 0.022 95.277)",
                border: "0.5px solid #d4c5b0",
                color: "#2a2318",
              }}
              onFocus={e => (e.target.style.borderColor = "#2a2318")}
              onBlur={e => (e.target.style.borderColor = "#d4c5b0")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] tracking-[0.25em] uppercase mb-1.5"
              style={{ color: "#6b5b47" }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "oklch(0.987 0.022 95.277)",
                border: "0.5px solid #d4c5b0",
                color: "#2a2318",
              }}
              onFocus={e => (e.target.style.borderColor = "#2a2318")}
              onBlur={e => (e.target.style.borderColor = "#d4c5b0")}
            />
          </div>

          {error && (
            <p
              className="text-xs px-3 py-2 border"
              style={{ color: "#8a2a2a", background: "#8a2a2a11", borderColor: "#8a2a2a44" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs tracking-[0.25em] uppercase font-medium transition-all active:scale-[0.98] mt-2"
            style={{
              background: loading ? "#8a7355" : "#2a2318",
              color: "oklch(0.987 0.022 95.277)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>

      <p className="text-[10px] mt-8 tracking-widest" style={{ color: "#d4c5b0" }}>
        © 2026 AURUM — ACCÈS RÉSERVÉ
      </p>
    </div>
  );
}

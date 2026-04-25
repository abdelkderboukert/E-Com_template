"use client";

import { useState, useEffect } from "react";
import type { CartItem, CheckoutStep } from "@/lib/data";
import { fmt, COUNTRIES } from "@/lib/data";
import { t } from "@/lib/i18n";

// ─── Store Links ─────────────────────────────────────────────────────────────
const STORE_WHATSAPP = "213656906049";
const STORE_INSTAGRAM = "aurum.dz";

type Props = {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
};

type DeliveryForm = {
  name: string; phone: string; country: string; state: string; address: string; notes: string;
};

type PayMethod = "whatsapp" | "dahabia" | "instagram" | null;

const STEPS: { key: CheckoutStep | "choose"; label: string }[] = [
  { key: "recap",    label: "Récap." },
  { key: "delivery", label: "Livraison" },
  { key: "choose",   label: "Paiement" },
  { key: "success",  label: "Confirmé" },
];

// (Luhn logic removed - redirecting to Chargily instead)

// ─── WhatsApp helpers (used only for the WhatsApp order method) ───────────────
function buildWhatsAppMessage(cart: CartItem[], form: DeliveryForm, subtotal: number, deliveryFee: number, total: number): string {
  const lines: string[] = [];
  lines.push("🛍️ *NOUVELLE COMMANDE — AURUM*");
  lines.push("─────────────────────────");
  lines.push("📦 *Articles :*");
  cart.forEach(item => {
    lines.push(`  • ${item.name} (${item.selectedSize}${item.selectedColor ? ` · ${item.selectedColor}` : ""}) × ${item.qty}  →  ${fmt(item.price * item.qty)}`);
  });
  lines.push(`\n💰 *Sous-total : ${fmt(subtotal)}*`);
  if (deliveryFee > 0) lines.push(`🚚 *Livraison : ${fmt(deliveryFee)}*`);
  else if (deliveryFee === 0 && subtotal >= 15000) lines.push(`🚚 *Livraison : Gratuite*`);
  lines.push(`💵 *Total à régler : ${fmt(total)}*`);
  lines.push("─────────────────────────");
  lines.push("🚚 *Livraison :*");
  lines.push(`  ${t("fullName")} : ${form.name}`);
  lines.push(`  ${t("phone")} : ${form.phone}`);
  lines.push(`  ${t("country")} : ${form.country}`);
  if (form.state) lines.push(`  ${t("state")} : ${form.state}`);
  lines.push(`  ${t("address")} : ${form.address}`);
  if (form.notes) lines.push(`  ${t("notes")} : ${form.notes}`);
  lines.push("─────────────────────────");
  lines.push("💬 *Mode de paiement : WhatsApp (à confirmer)*");
  return encodeURIComponent(lines.join("\n"));
}

function openWhatsApp(message: string) {
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${message}`, "_blank");
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function CheckoutModal({ open, cart, onClose, onSuccess }: Props) {
  const [step, setStep]         = useState<CheckoutStep | "choose">("recap");
  const [form, setForm]         = useState<DeliveryForm>({ name: "", phone: "", country: "", state: "", address: "", notes: "" });
  const [payMethod, setPayMethod] = useState<PayMethod>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError]       = useState("");
  const [paymentsEnabled, setPaymentsEnabled] = useState({ whatsapp: true, dahabia: true, instagram: true });
  const [deliveryPrices, setDeliveryPrices]   = useState<Record<string, number>>({});

  // ── Dynamic states from CountriesNow API ──
  const [states, setStates]         = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/settings")
        .then(r => r.json())
        .then(d => {
          if (d.payments) {
            setPaymentsEnabled({
              whatsapp: d.payments.whatsapp ?? true,
              dahabia: d.payments.dahabia ?? true,
              instagram: d.payments.instagram ?? true,
            });
          }
          if (d.deliveryPrices) setDeliveryPrices(d.deliveryPrices);
        })
        .catch(() => {});
    }
  }, [open]);

  // Fetch states whenever country changes
  useEffect(() => {
    if (!form.country) {
      setStates([]);
      return;
    }
    setLoadingStates(true);
    setForm(p => ({ ...p, state: "" }));
    fetch("/api/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: form.country }),
    })
      .then(r => r.json())
      .then(d => setStates(d.states ?? []))
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.country]);

  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const baseDeliveryFee = form.country && deliveryPrices[form.country] !== undefined ? deliveryPrices[form.country] : 0;
  const deliveryFee = subtotal >= 15000 ? 0 : baseDeliveryFee;
  const total       = subtotal + deliveryFee;
  
  const stepIdx  = STEPS.findIndex(s => s.key === step);

  function resetAndClose() {
    onClose();
    setTimeout(() => {
      setStep("recap");
      setPayMethod(null);
      setForm({ name: "", phone: "", country: "", state: "", address: "", notes: "" });
      setError("");
      setStates([]);
    }, 300);
  }

  function handleDeliveryNext() {
    if (!form.name.trim() || !form.phone.trim() || !form.country || !form.address.trim()) {
      setError(t("requiredFieldsError"));
      return;
    }
    setError(""); setStep("choose");
  }

  // WhatsApp order — open chat with pre-filled message
  function handleWhatsAppOrder() {
    const msg = buildWhatsAppMessage(cart, form, subtotal, deliveryFee, total);
    openWhatsApp(msg);
    setPayMethod("whatsapp");
    setStep("success");
    onSuccess();
  }

  // Instagram order — copy to clipboard and open profile
  function handleInstagramOrder() {
    const msg = buildWhatsAppMessage(cart, form, subtotal, deliveryFee, total);
    navigator.clipboard.writeText(decodeURIComponent(msg)).catch(() => {});
    window.open(`https://ig.me/m/${STORE_INSTAGRAM}`, "_blank");
    setPayMethod("instagram");
    setStep("success");
    onSuccess();
  }

  // ── Official Chargily Pay V2 Redirect ─────────────────────────────────────
  async function handleDahabiaCheckout() {
    setError("");
    setLoadingCheckout(true);

    try {
      const res = await fetch("/api/chargily/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(i => ({
            id: i.id, name: i.name,
            size: i.selectedSize, color: i.selectedColor,
            qty: i.qty, price: i.price,
          })),
          delivery: form,
          subtotal,
          deliveryFee,
          total,
        }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Impossible de générer le paiement sécurisé.");
        setLoadingCheckout(false);
        return;
      }

      // REDIRECT THE USER to Chargily
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Erreur réseau de communication avec la banque.");
      setLoadingCheckout(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(42,35,24,0.6)" }}
        onClick={step !== "success" ? resetAndClose : undefined}
      />

      <div
        className="relative w-full max-w-lg flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: "oklch(0.987 0.022 95.277)",
          maxHeight: "92dvh",
          border: "0.5px solid #d4c5b0",
          animation: "scaleIn 0.2s ease forwards",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "0.5px solid #d4c5b0" }}
        >
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <div
                  className="flex items-center justify-center text-[9px] tracking-wider font-medium transition-all duration-300"
                  style={{
                    width: i <= stepIdx ? "auto" : "20px",
                    height: "20px",
                    minWidth: "20px",
                    padding: i <= stepIdx ? "0 6px" : "0",
                    background: i < stepIdx ? "#2a6b4a" : i === stepIdx ? "#2a2318" : "#e8ddd0",
                    color: i <= stepIdx ? "oklch(0.987 0.022 95.277)" : "#8a7355",
                    borderRadius: "2px",
                  }}
                >
                  {i < stepIdx ? "✓" : i <= stepIdx ? s.label : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-4 h-px" style={{ background: i < stepIdx ? "#2a6b4a" : "#e8ddd0" }} />
                )}
              </div>
            ))}
          </div>

          {step !== "success" && (
            <button
              onClick={resetAndClose}
              className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {/* ── STEP 1 : Récapitulatif ─────────────────────────────── */}
          {step === "recap" && (
            <>
              <div>
                <p className="font-display text-xl font-semibold mb-1" style={{ color: "#2a2318" }}>Votre commande</p>
                <p className="text-xs" style={{ color: "#8a7355" }}>Vérifiez vos articles avant de continuer</p>
              </div>

              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-4 pb-4"
                    style={{ borderBottom: "0.5px solid #e8ddd0" }}
                  >
                    <div className="w-14 h-16 shrink-0 overflow-hidden" style={{ border: "0.5px solid #d4c5b0" }}>
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-medium truncate" style={{ color: "#2a2318" }}>
                        {item.name}
                      </p>
                      <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "#8a7355" }}>
                        Taille : {item.selectedSize} · Qté : {item.qty}
                      </p>
                    </div>
                    <p className="text-sm font-medium shrink-0" style={{ color: "#2a2318" }}>
                      {fmt(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="flex justify-between items-center px-4 py-3"
                style={{ background: "oklch(0.962 0.059 95.617)" }}
              >
                <span className="text-xs tracking-widest uppercase" style={{ color: "#8a7355" }}>Sous-total*</span>
                <span className="font-display text-lg font-bold" style={{ color: "#2a2318" }}>{fmt(subtotal)}</span>
              </div>
              <p className="text-[9px] text-right mt-1 px-4" style={{ color: "#8a7355" }}>
                *Hors frais de livraison (calculés à l'étape suivante)
              </p>

              <button
                onClick={() => setStep("delivery")}
                className="w-full py-3.5 text-xs tracking-[0.25em] uppercase font-medium transition-all hover:opacity-85"
                style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
              >
                Continuer — Livraison →
              </button>
            </>
          )}

          {/* ── STEP 2 : Livraison ────────────────────────────────── */}
          {step === "delivery" && (
            <>
              <div>
                <p className="font-display text-xl font-semibold mb-1" style={{ color: "#2a2318" }}>{t("checkoutTitle")}</p>
                <p className="text-xs" style={{ color: "#8a7355" }}>{t("checkoutSubtitle")}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
                    {t("fullName")} <span style={{ color: "#c0392b" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("placeholderName")}
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="px-4 py-2.5 text-sm outline-none transition-all"
                    style={{
                      border: "0.5px solid #d4c5b0",
                      background: "oklch(0.962 0.059 95.617)",
                      color: "#2a2318",
                    }}
                    onFocus={e => e.target.style.borderColor = "#8a7355"}
                    onBlur={e => e.target.style.borderColor = "#d4c5b0"}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
                    {t("phone")} <span style={{ color: "#c0392b" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder={t("placeholderPhone")}
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="px-4 py-2.5 text-sm outline-none"
                    style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: "#2a2318" }}
                    onFocus={e => e.target.style.borderColor = "#8a7355"}
                    onBlur={e => e.target.style.borderColor = "#d4c5b0"}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
                    {t("country")} <span style={{ color: "#c0392b" }}>*</span>
                  </label>
                  <select
                    value={form.country}
                    onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                    className="px-3 py-2.5 text-sm outline-none"
                    style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: form.country ? "#2a2318" : "#8a7355" }}
                  >
                    <option value="">{t("selectCountry")}</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Dynamic State/Province dropdown — from CountriesNow API */}
                {form.country && (
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
                      {t("state")}
                    </label>
                    {loadingStates ? (
                      <div className="flex items-center gap-2 px-3 py-2.5" style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)" }}>
                        <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8a7355", borderTopColor: "transparent" }} />
                        <span className="text-xs" style={{ color: "#8a7355" }}>Loading...</span>
                      </div>
                    ) : states.length > 0 ? (
                      <select
                        value={form.state}
                        onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                        className="px-3 py-2.5 text-sm outline-none"
                        style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: form.state ? "#2a2318" : "#8a7355" }}
                      >
                        <option value="">{t("selectState")}</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={t("state")}
                        value={form.state}
                        onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                        className="px-4 py-2.5 text-sm outline-none"
                        style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: "#2a2318" }}
                        onFocus={e => e.target.style.borderColor = "#8a7355"}
                        onBlur={e => e.target.style.borderColor = "#d4c5b0"}
                      />
                    )}
                  </div>
                )}

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
                    {t("address")} <span style={{ color: "#c0392b" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("placeholderAddress")}
                    value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    className="px-4 py-2.5 text-sm outline-none"
                    style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: "#2a2318" }}
                    onFocus={e => e.target.style.borderColor = "#8a7355"}
                    onBlur={e => e.target.style.borderColor = "#d4c5b0"}
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
                    {t("notes")}
                  </label>
                  <textarea
                    placeholder="..."
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    rows={2}
                    className="px-4 py-2.5 text-sm outline-none resize-none"
                    style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: "#2a2318" }}
                    onFocus={e => e.target.style.borderColor = "#8a7355"}
                    onBlur={e => e.target.style.borderColor = "#d4c5b0"}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs px-3 py-2" style={{ background: "#fce8e8", color: "#c0392b" }}>{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep("recap"); setError(""); }}
                  className="flex-1 py-3 text-xs tracking-[0.2em] uppercase border transition-all hover:opacity-60"
                  style={{ borderColor: "#d4c5b0", color: "#2a2318" }}
                >
                  ← Retour
                </button>
                <button
                  onClick={handleDeliveryNext}
                  className="flex-[2] py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all hover:opacity-85"
                  style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
                >
                  Choisir le paiement →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3 : Choix du mode de paiement ───────────────── */}
          {step === "choose" && payMethod === null && (
            <>
              <div>
                <p className="font-display text-xl font-semibold mb-1" style={{ color: "#2a2318" }}>Mode de paiement</p>
                <p className="text-xs" style={{ color: "#8a7355" }}>Choisissez comment vous souhaitez finaliser votre commande</p>
              </div>

              {!paymentsEnabled.whatsapp && !paymentsEnabled.dahabia && !paymentsEnabled.instagram && (
                <div className="flex flex-col items-center justify-center p-8 gap-3 mt-4 text-center" style={{ background: "#fce8e8", border: "0.5px solid #e8bbbb" }}>
                   <p className="text-sm font-medium" style={{ color: "#c0392b" }}>Paiements temporairement indisponibles</p>
                   <p className="text-xs" style={{ color: "#c0392b" }}>Nos systèmes de commande sont actuellement en maintenance. Veuillez réessayer plus tard.</p>
                </div>
              )}

              {paymentsEnabled.instagram && (
                <button
                  onClick={() => handleInstagramOrder()}
                className="group w-full flex items-center gap-5 p-5 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", boxShadow: "0 6px 20px rgba(225,48,108,0.3)" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#2a2318" }}>Commander via Instagram</p>
                  <p className="text-xs leading-[1.7]" style={{ color: "#6b5b47" }}>
                    Votre commande est copiée. Envoyez-la sur notre compte Instagram.
                  </p>
                  <span className="inline-block mt-2 text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-0.5" style={{ background: "#E1306C22", color: "#E1306C", border: "0.5px solid #E1306C44" }}>
                    Copier &amp; Coller
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5" className="shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              )}

              {paymentsEnabled.whatsapp && (
                <button
                  onClick={() => handleWhatsAppOrder()}
                className="group w-full flex items-center gap-5 p-5 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: "#25D366", boxShadow: "0 6px 20px rgba(37,211,102,0.3)" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#2a2318" }}>Commander via WhatsApp</p>
                  <p className="text-xs leading-[1.7]" style={{ color: "#6b5b47" }}>
                    Envoyez votre commande directement sur notre WhatsApp.
                    Nous vous contacterons pour confirmer et organiser le paiement.
                  </p>
                  <span className="inline-block mt-2 text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-0.5" style={{ background: "#25D36622", color: "#18a34a", border: "0.5px solid #25D36644" }}>
                    Rapide &amp; simple
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5" className="shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              )}

              {paymentsEnabled.dahabia && (
                <button
                  onClick={handleDahabiaCheckout}
                  disabled={loadingCheckout}
                  className="group w-full flex items-center gap-5 p-5 text-left transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                  style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #2a2318 0%, #8a7355 100%)", boxShadow: "0 6px 20px rgba(42,35,24,0.25)" }}
                  >
                    {loadingCheckout ? (
                       <span className="w-5 h-5 border-2 rounded-full border-t-white/30 border-white" style={{ animation: "spin 0.7s linear infinite" }} />
                    ) : (
                      <svg width="26" height="18" viewBox="0 0 32 22" fill="none">
                        <rect width="32" height="22" rx="3" fill="none" />
                        <rect x="1" y="1" width="30" height="20" rx="2.5" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
                        <rect y="6" width="32" height="5" fill="white" fillOpacity="0.15" />
                        <rect x="4" y="14" width="8" height="4" rx="1" fill="#c9b49a" fillOpacity="0.8" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#2a2318" }}>
                      {loadingCheckout ? "Redirection..." : "Payer par Dahabia / CIB"}
                    </p>
                    <p className="text-xs leading-[1.7]" style={{ color: "#6b5b47" }}>
                      Paiement en ligne hautement sécurisé (officiel). Vous serez redirigé vers l'interface de paiement bancaire.
                    </p>
                  <span className="inline-block mt-2 text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-0.5" style={{ background: "#2a231822", color: "#2a2318", border: "0.5px solid #2a231844" }}>
                    Paiement immédiat
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5" className="shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              )}

              <div className="flex flex-col gap-1 px-4 py-3" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}>
                <div className="flex justify-between items-center text-xs" style={{ color: "#6b5b47" }}>
                  <span>{t("subtotal")}</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {form.country && (
                  <div className="flex justify-between items-center text-xs" style={{ color: "#6b5b47" }}>
                    <span>{t("deliveryFee")} ({form.country})</span>
                    <span>{deliveryFee === 0 ? t("free") : fmt(deliveryFee)}</span>
                  </div>
                )}
                <div
                  className="flex justify-between items-center mt-2 pt-2"
                  style={{ borderTop: "0.5px solid #d4c5b0" }}
                >
                  <span className="text-xs tracking-widest uppercase" style={{ color: "#8a7355" }}>Total à régler</span>
                  <span className="font-display text-lg font-bold" style={{ color: "#2a2318" }}>{fmt(total)}</span>
                </div>
              </div>

              <button
                onClick={() => { setStep("delivery"); setError(""); }}
                className="text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-50 text-left"
                style={{ color: "#8a7355" }}
              >
                ← Modifier la livraison
              </button>
            </>
          )}

          {/* ── STEP 4 : Success ──────────────────────────────────── */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-6 py-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.962 0.059 95.617)", border: "2px solid #2a6b4a" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a6b4a" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "#2a2318" }}>
                  Commande confirmée !
                </h3>
                <p className="text-sm leading-[1.8] max-w-xs" style={{ color: "#6b5b47" }}>
                  Merci{form.name ? `, ${form.name.split(" ")[0]}` : ""} pour votre confiance.<br />
                  {payMethod === "dahabia" && <>Un récapitulatif a été envoyé sur notre WhatsApp. Nous vous contacterons au <strong style={{ color: "#2a2318" }}>{form.phone}</strong>.</>}
                  {payMethod === "whatsapp" && <>Votre commande a été transmise sur notre WhatsApp. Nous vous contacterons au <strong style={{ color: "#2a2318" }}>{form.phone}</strong> pour confirmer.</>}
                  {payMethod === "instagram" && <>Votre commande a été copiée et Instagram a été ouvert. Si ce n'est pas le cas, veuillez nous contacter au <strong style={{ color: "#2a2318" }}>{form.phone}</strong> pour confirmer.</>}
                </p>
              </div>

              <div
                className="w-full text-left p-5 flex flex-col gap-3"
                style={{ background: "oklch(0.962 0.059 95.617)" }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: "#8a7355" }}>
                  Récapitulatif
                </p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-xs" style={{ color: "#2a2318" }}>{form.address}{form.state ? `, ${form.state}` : ""}, {form.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <p className="text-xs" style={{ color: "#2a2318" }}>
                      {payMethod === "dahabia" && `Paiement en ligne sécurisé · ${fmt(total)}`}
                      {payMethod === "whatsapp" && `WhatsApp · ${fmt(total)}`}
                      {payMethod === "instagram" && `Instagram · ${fmt(total)}`}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="px-10 py-3.5 text-xs tracking-[0.25em] uppercase font-medium transition-all hover:opacity-85"
                style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
              >
                Continuer mes achats
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

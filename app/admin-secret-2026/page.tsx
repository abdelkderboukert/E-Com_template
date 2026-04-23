"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/ProductsContext";
import type { Product } from "@/lib/data";
import { WILAYAS } from "@/lib/data";
import AdminProductModal from "@/components/AdminProductModal";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderStatus = "pending" | "confirmed" | "shipped" | "done" | "unpaid" | "failed";

type Order = {
  id: number;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: "dahabia";
  cardLast4: string;
  total: number;
  delivery: { name: string; phone: string; wilaya: string; address: string; notes?: string };
  items: { id: number; name: string; size: string; color: string; qty: number; price: number }[];
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  unpaid:    "Non payé",
  failed:    "Échec paiement",
  pending:   "En attente",
  confirmed: "Confirmée",
  shipped:   "Expédiée",
  done:      "Terminée",
};
const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  unpaid:    { bg: "#fce8e8", text: "#c0392b", border: "#e8bbbb" },
  failed:    { bg: "#2a231822", text: "#2a2318", border: "#2a231844" },
  pending:   { bg: "#7a4a1a22", text: "#7a4a1a", border: "#7a4a1a44" },
  confirmed: { bg: "#2a4a6b22", text: "#2a4a6b", border: "#2a4a6b44" },
  shipped:   { bg: "#6b3a5a22", text: "#6b3a5a", border: "#6b3a5a44" },
  done:      { bg: "#2a6b4a22", text: "#2a6b4a", border: "#2a6b4a44" },
};

// ─── Settings Modal ────────────────────────────────────────────────────────────
function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"payments" | "security" | "delivery">("payments");

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail]               = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentEmail, setCurrentEmail]       = useState("");
  const [loadingSec, setLoadingSec]           = useState(false);
  const [successSec, setSuccessSec]           = useState("");
  const [errorSec, setErrorSec]               = useState("");

  // Payments state
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [dahabiaEnabled, setDahabiaEnabled]   = useState(true);
  const [instagramEnabled, setInstagramEnabled] = useState(true);
  const [loadingPay, setLoadingPay]           = useState(false);

  // Delivery state
  const [deliveryPrices, setDeliveryPrices]   = useState<Record<string, number>>({});
  const [loadingDel, setLoadingDel]           = useState(false);
  const [successDel, setSuccessDel]           = useState("");
  const [searchWilaya, setSearchWilaya]       = useState("");

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword(""); setNewEmail("");
      setNewPassword(""); setConfirmPassword("");
      setSuccessSec(""); setErrorSec("");
      
      fetch("/api/admin/credentials")
        .then(r => r.json())
        .then(d => setCurrentEmail(d.email ?? ""));
      
      fetch("/api/settings")
        .then(r => r.json())
        .then(d => {
          setWhatsappEnabled(d.payments?.whatsapp ?? true);
          setDahabiaEnabled(d.payments?.dahabia ?? true);
          setInstagramEnabled(d.payments?.instagram ?? true);
          setDeliveryPrices(d.deliveryPrices || {});
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSec(""); setSuccessSec("");

    if (newPassword && newPassword !== confirmPassword) {
      setErrorSec("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoadingSec(true);
    const res = await fetch("/api/admin/credentials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newEmail: newEmail || undefined, newPassword: newPassword || undefined }),
    });

    const data = await res.json();
    setLoadingSec(false);

    if (res.ok) {
      setSuccessSec("Identifiants mis à jour avec succès.");
      setCurrentPassword(""); setNewEmail(""); setNewPassword(""); setConfirmPassword("");
      if (newEmail) setCurrentEmail(newEmail);
    } else {
      setErrorSec(data.error ?? "Une erreur est survenue.");
    }
  };

  const handlePaymentToggle = async (method: "whatsapp" | "dahabia" | "instagram", newVal: boolean) => {
    setLoadingPay(true);
    if (method === "whatsapp") setWhatsappEnabled(newVal);
    if (method === "dahabia") setDahabiaEnabled(newVal);
    if (method === "instagram") setInstagramEnabled(newVal);

    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payments: {
          whatsapp: method === "whatsapp" ? newVal : whatsappEnabled,
          dahabia: method === "dahabia" ? newVal : dahabiaEnabled,
          instagram: method === "instagram" ? newVal : instagramEnabled,
        }
      }),
    });
    setLoadingPay(false);
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessDel("");
    setLoadingDel(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryPrices }),
    });
    setLoadingDel(false);
    setSuccessDel("Tarifs enregistrés !");
    setTimeout(() => setSuccessDel(""), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-md p-6 md:p-8 shadow-xl flex flex-col min-h-0"
        style={{ background: "oklch(0.987 0.022 95.277)", border: "0.5px solid #d4c5b0", minHeight: "min(500px, 90vh)", maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "#8a7355" }}>✦ Configuration</p>
        <h2 className="font-display text-2xl font-medium mb-6" style={{ color: "#2a2318" }}>Paramètres</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6" style={{ borderBottom: "0.5px solid #d4c5b0" }}>
          {[
            { key: "payments", label: "Paiements" },
            { key: "delivery", label: "Livraison" },
            { key: "security", label: "Sécurité" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className="px-2 py-2 text-[10px] tracking-[0.2em] uppercase font-medium transition-all"
              style={{
                color: activeTab === t.key ? "#2a2318" : "#8a7355",
                borderBottom: activeTab === t.key ? "1.5px solid #2a2318" : "1.5px solid transparent",
                marginBottom: "-0.5px"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "payments" && (
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-xs mb-2" style={{ color: "#6b5b47" }}>
              Activez ou désactivez les méthodes de paiement affichées à vos clients à l'étape finale.
            </p>

            {/* Enable Dahabia */}
            <div className="flex items-center justify-between p-4 transition-all" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0", opacity: loadingPay ? 0.6 : 1 }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#2a2318" }}>Paiement Dahabia</p>
                <p className="text-[10px]" style={{ color: "#8a7355" }}>Formulaire de saisie de carte</p>
              </div>
              <button
                onClick={() => handlePaymentToggle("dahabia", !dahabiaEnabled)}
                className="w-10 h-5 rounded-full relative transition-colors duration-300"
                style={{ background: dahabiaEnabled ? "#25D366" : "#d4c5b0" }}
              >
                <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm" style={{ left: dahabiaEnabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>

            {/* Enable WhatsApp */}
            <div className="flex items-center justify-between p-4 transition-all" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0", opacity: loadingPay ? 0.6 : 1 }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#2a2318" }}>Commande WhatsApp</p>
                <p className="text-[10px]" style={{ color: "#8a7355" }}>Redirection vers discussion WhatsApp</p>
              </div>
              <button
                onClick={() => handlePaymentToggle("whatsapp", !whatsappEnabled)}
                className="w-10 h-5 rounded-full relative transition-colors duration-300"
                style={{ background: whatsappEnabled ? "#25D366" : "#d4c5b0" }}
              >
                <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm" style={{ left: whatsappEnabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
            
            {/* Enable Instagram */}
            <div className="flex items-center justify-between p-4 transition-all" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0", opacity: loadingPay ? 0.6 : 1 }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#2a2318" }}>Commande Instagram</p>
                <p className="text-[10px]" style={{ color: "#8a7355" }}>Copie de la commande et redirection Instagram</p>
              </div>
              <button
                onClick={() => handlePaymentToggle("instagram", !instagramEnabled)}
                className="w-10 h-5 rounded-full relative transition-colors duration-300"
                style={{ background: instagramEnabled ? "#E1306C" : "#d4c5b0" }}
              >
                <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm" style={{ left: instagramEnabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
            
            {!whatsappEnabled && !dahabiaEnabled && !instagramEnabled && (
               <p className="text-[10px] mt-2 px-3 py-2 text-center" style={{ background: "#fce8e8", color: "#c0392b", border: "0.5px solid #e8bbbb" }}>
                 ⚠️ Attention : Aucun moyen de paiement n'est actif. Les clients ne pourront plus passer commande.
               </p>
            )}
          </div>
        )}

        {activeTab === "delivery" && (
          <form onSubmit={handleDeliverySubmit} className="flex flex-col min-h-0 flex-1">
            <p className="text-xs mb-3 font-medium shrink-0" style={{ color: "#8a7355" }}>
              Définissez les tarifs de livraison par wilaya (0 = Gratuit).
              <br />
              La livraison devient automatiquement gratuite dès 15 000 DZD d'achats.
            </p>
            
            <input
              type="text"
              placeholder="Rechercher une wilaya..."
              value={searchWilaya}
              onChange={e => setSearchWilaya(e.target.value)}
              className="w-full px-4 py-2 mb-3 text-xs outline-none shrink-0"
              style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.962 0.059 95.617)", color: "#2a2318" }}
            />

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-1 pr-1.5 custom-scrollbar" style={{ overscrollBehavior: "contain" }}>
              {WILAYAS.filter(w => w.toLowerCase().includes(searchWilaya.toLowerCase())).map((w, idx) => (
                <div key={w} className="flex items-center justify-between p-2.5 transition-all" style={{ borderBottom: "0.5px solid #e8ddd0" }}>
                  <p className="text-xs font-medium" style={{ color: "#2a2318" }}>
                    <span className="opacity-50 mr-2 w-4 inline-block text-right">{WILAYAS.indexOf(w)+1}.</span>
                    {w}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={0}
                      step={50}
                      value={deliveryPrices[w] ?? 0}
                      onChange={e => setDeliveryPrices(prev => ({ ...prev, [w]: Number(e.target.value) }))}
                      className="w-20 px-2 py-1.5 text-xs text-right outline-none"
                      style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.987 0.022 95.277)" }}
                    />
                    <span className="text-[10px] font-medium" style={{ color: "#8a7355" }}>DZD</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 shrink-0 pt-2" style={{ borderTop: "0.5px solid #e8ddd0" }}>
              {successDel && <p className="text-xs px-3 py-2 text-center" style={{ color: "#2a6b4a", background: "#2a6b4a11", border: "0.5px solid #2a6b4a44" }}>✓ {successDel}</p>}
              <button type="submit" disabled={loadingDel} className="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all active:scale-[0.98]" style={{ background: loadingDel ? "#8a7355" : "#2a2318", color: "oklch(0.987 0.022 95.277)" }}>
                {loadingDel ? "Enregistrement…" : "Enregistrer Tarif"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex items-center gap-3 px-3 py-2.5 mb-6 text-xs" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
              <span style={{ color: "#6b5b47" }}>E-mail actuel :</span>
              <span className="font-medium" style={{ color: "#2a2318" }}>{currentEmail}</span>
            </div>

            <form onSubmit={handleSecuritySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                  Mot de passe actuel <span style={{ color: "#8a2a2a" }}>*</span>
                </label>
                <input required type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm outline-none transition-all"
                  style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0", color: "#2a2318" }}
                  onFocus={e => (e.target.style.borderColor = "#2a2318")} onBlur={e => (e.target.style.borderColor = "#d4c5b0")} />
              </div>

              <div className="h-px my-1" style={{ background: "#e8ddd0" }} />

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                  Nouvel e-mail <span className="normal-case" style={{ color: "#b5a898" }}>(laisser vide pour ne pas modifier)</span>
                </label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="nouveau@aurum.dz"
                  className="w-full px-3 py-2.5 text-sm outline-none transition-all"
                  style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0", color: "#2a2318" }}
                  onFocus={e => (e.target.style.borderColor = "#2a2318")} onBlur={e => (e.target.style.borderColor = "#d4c5b0")} />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                  Nouveau mot de passe <span className="normal-case" style={{ color: "#b5a898" }}>(laisser vide pour ne pas modifier)</span>
                </label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm outline-none transition-all"
                  style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0", color: "#2a2318" }}
                  onFocus={e => (e.target.style.borderColor = "#2a2318")} onBlur={e => (e.target.style.borderColor = "#d4c5b0")} />
              </div>

              {newPassword && (
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>Confirmer le nouveau mot de passe</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-3 py-2.5 text-sm outline-none transition-all"
                    style={{ background: "oklch(0.962 0.059 95.617)", border: `0.5px solid ${confirmPassword && confirmPassword !== newPassword ? "#8a2a2a" : "#d4c5b0"}`, color: "#2a2318" }}
                    onFocus={e => (e.target.style.borderColor = "#2a2318")} onBlur={e => (e.target.style.borderColor = confirmPassword !== newPassword ? "#8a2a2a" : "#d4c5b0")} />
                </div>
              )}

              {errorSec   && <p className="text-xs px-3 py-2 border" style={{ color: "#8a2a2a", background: "#8a2a2a11", borderColor: "#8a2a2a44" }}>{errorSec}</p>}
              {successSec && <p className="text-xs px-3 py-2 border" style={{ color: "#2a6b4a", background: "#2a6b4a11", borderColor: "#2a6b4a44" }}>✓ {successSec}</p>}

              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={loadingSec} className="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all active:scale-[0.98]" style={{ background: loadingSec ? "#8a7355" : "#2a2318", color: "oklch(0.987 0.022 95.277)" }}>
                  {loadingSec ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Orders Section ────────────────────────────────────────────────────────────
function OrdersSection() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: number, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#d4c5b0", borderTopColor: "#2a2318" }} />
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#8a7355" }}>Chargement…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 flex items-center justify-center" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4c5b0" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <p className="text-sm font-display font-medium" style={{ color: "#2a2318" }}>Aucune commande Dahabia</p>
        <p className="text-xs" style={{ color: "#8a7355" }}>Les commandes apparaîtront ici après chaque paiement.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs" style={{ color: "#8a7355" }}>
          {orders.length} commande{orders.length !== 1 ? "s" : ""} · {orders.filter(o => o.status === "pending").length} en attente
        </p>
        <button onClick={fetchOrders} className="text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-50" style={{ color: "#8a7355" }}>
          ↺ Actualiser
        </button>
      </div>

      {orders.map(order => {
        const col = STATUS_COLORS[order.status];
        const date = new Date(order.createdAt).toLocaleString("fr-DZ", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
        return (
          <div key={order.id} className="p-5 flex flex-col gap-4" style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}>
            {/* Row 1: ID + date + status */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#b5a898" }}>Commande #{order.id}</p>
                <p className="text-xs mt-0.5" style={{ color: "#8a7355" }}>{date}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Status badge */}
                <span className="text-[9px] tracking-widest uppercase px-2.5 py-1 font-medium" style={{ background: col.bg, color: col.text, border: `0.5px solid ${col.border}` }}>
                  {STATUS_LABELS[order.status]}
                </span>
                {/* Status selector */}
                <select
                  value={order.status}
                  disabled={updating === order.id}
                  onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                  className="text-[10px] tracking-[0.15em] uppercase px-2 py-1.5 outline-none transition-all"
                  style={{ border: "0.5px solid #d4c5b0", background: "oklch(0.987 0.022 95.277)", color: "#2a2318", cursor: "pointer" }}
                >
                  {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                {updating === order.id && (
                  <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#d4c5b0", borderTopColor: "#2a2318" }} />
                )}
              </div>
            </div>

            {/* Row 2: items + delivery side by side */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Items */}
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-2 font-medium" style={{ color: "#8a7355" }}>Articles</p>
                <div className="flex flex-col gap-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium" style={{ color: "#2a2318" }}>{item.name}</p>
                        <p className="text-[10px]" style={{ color: "#b5a898" }}>{item.size}{item.color ? ` · ${item.color}` : ""} · qté {item.qty}</p>
                      </div>
                      <p className="text-xs font-medium shrink-0" style={{ color: "#2a2318" }}>
                        {(item.price * item.qty).toLocaleString("fr-DZ")} DZD
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-2 font-medium" style={{ color: "#8a7355" }}>Livraison</p>
                <div className="flex flex-col gap-1 text-xs" style={{ color: "#2a2318" }}>
                  <p className="font-medium">{order.delivery.name}</p>
                  <p style={{ color: "#6b5b47" }}>{order.delivery.phone}</p>
                  <p style={{ color: "#6b5b47" }}>{order.delivery.address}, {order.delivery.wilaya}</p>
                  {order.delivery.notes && <p className="italic" style={{ color: "#b5a898" }}>"{order.delivery.notes}"</p>}
                </div>
              </div>
            </div>

            {/* Row 3: total + payment */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "0.5px solid #d4c5b0" }}>
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <p className="text-xs" style={{ color: "#8a7355" }}>Dahabia ···· {order.cardLast4}</p>
              </div>
              <p className="font-display text-base font-bold" style={{ color: "#2a2318" }}>
                {order.total.toLocaleString("fr-DZ")} DZD
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { products, refreshProducts, loading } = useProducts();
  const [activeTab, setActiveTab]             = useState<"products" | "orders">("products");
  const [pendingCount, setPendingCount]       = useState(0);
  const [modalOpen, setModalOpen]             = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authChecked, setAuthChecked]         = useState(false);
  const [logoutLoading, setLogoutLoading]     = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/check")
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) {
          router.replace("/admin-secret-2026/login");
        } else {
          setAuthChecked(true);
          // Fetch pending order count for badge
          fetch("/api/orders")
            .then(r => r.json())
            .then((orders: Order[]) => {
              if (Array.isArray(orders)) {
                setPendingCount(orders.filter(o => o.status === "pending").length);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => router.replace("/admin-secret-2026/login"));
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin-secret-2026/login");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      refreshProducts();
    }
  };

  const openEdit = (p: Product) => { setSelectedProduct(p); setModalOpen(true); };
  const openAdd  = () => { setSelectedProduct(null); setModalOpen(true); };

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "oklch(0.987 0.022 95.277)" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "#d4c5b0", borderTopColor: "#2a2318" }} />
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#8a7355" }}>Chargement…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar cartCount={0} onCartOpen={() => {}} />

      <div className="pt-24 px-6 md:px-16 min-h-screen pb-20" style={{ background: "oklch(0.987 0.022 95.277)" }}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6" style={{ borderBottom: "0.5px solid #d4c5b0" }}>
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: "#8a7355" }}>✦ Administration</p>
            <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(28px,4vw,40px)", color: "#2a2318" }}>
              Tableau de bord
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {activeTab === "products" && (
              <button onClick={openAdd} className="px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all hover:opacity-80 active:scale-[0.98]" style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}>
                + Ajouter
              </button>
            )}
            <button onClick={() => setSettingsOpen(true)} className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all hover:opacity-60" style={{ border: "0.5px solid #d4c5b0", color: "#6b5b47" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
              Paramètres
            </button>
            <button onClick={handleLogout} disabled={logoutLoading} className="px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all hover:opacity-60" style={{ border: "0.5px solid #d4c5b0", color: "#8a7355" }}>
              {logoutLoading ? "…" : "Déconnexion"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8" style={{ borderBottom: "0.5px solid #d4c5b0" }}>
          {[
            { key: "products" as const, label: `Produits (${products.length})`, badge: 0 },
            { key: "orders"   as const, label: "Commandes Dahabia",             badge: pendingCount },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all"
              style={{
                color: activeTab === tab.key ? "#2a2318" : "#8a7355",
                borderBottom: activeTab === tab.key ? "1.5px solid #2a2318" : "1.5px solid transparent",
                marginBottom: "-0.5px",
              }}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span className="flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full" style={{ background: "#8a2a2a", color: "#fff" }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {activeTab === "products" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid #d4c5b0" }}>
                  {["#", "Image", "Nom", "Catégorie", "Tag", "Prix", "Stock", "Actions"].map(h => (
                    <th key={h} className="pb-3 pr-6 text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: "#8a7355" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: "0.5px solid #e8ddd0" }} className="transition-colors hover:bg-[oklch(0.962_0.059_95.617/0.5)]">
                    <td className="py-4 pr-6 text-xs" style={{ color: "#b5a898" }}>#{p.id}</td>
                    <td className="py-4 pr-6">
                      <img src={p.img} alt={p.name} className="w-10 h-14 object-cover" style={{ border: "0.5px solid #d4c5b0" }} onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }} />
                    </td>
                    <td className="py-4 pr-6 text-sm font-medium" style={{ color: "#2a2318" }}>{p.name}</td>
                    <td className="py-4 pr-6 text-xs" style={{ color: "#8a7355" }}>{p.category}</td>
                    <td className="py-4 pr-6">
                      <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase" style={{ background: p.tagColor + "22", color: p.tagColor, border: `0.5px solid ${p.tagColor}44` }}>
                        {p.tag}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-xs font-medium" style={{ color: "#2a2318" }}>
                      {p.price.toLocaleString("fr-DZ")} DZD
                      {p.originalPrice ? <span className="ml-2 line-through" style={{ color: "#b5a898" }}>{p.originalPrice.toLocaleString("fr-DZ")}</span> : null}
                    </td>
                    <td className="py-4 pr-6">
                      <span className="text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ background: p.inStock ? "#2a6b4a22" : "#8a2a2a22", color: p.inStock ? "#2a6b4a" : "#8a2a2a", border: `0.5px solid ${p.inStock ? "#2a6b4a44" : "#8a2a2a44"}` }}>
                        {p.inStock ? "En stock" : "Épuisé"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => openEdit(p)} className="text-[10px] tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-50" style={{ color: "#8a7355" }}>Modifier</button>
                        <button onClick={() => handleDelete(p.id)} className="text-[10px] tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-50" style={{ color: "#8a2a2a" }}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === "orders" && <OrdersSection />}

      </div>

      <AdminProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onSaved={() => { setModalOpen(false); refreshProducts(); }}
      />

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}


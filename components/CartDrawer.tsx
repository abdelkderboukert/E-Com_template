"use client";

import { useState } from "react";
import type { CartItem } from "@/lib/data";
import { fmt } from "@/lib/data";

type Props = {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onChangeQty: (id: number, size: string, delta: number) => void;
  onRemove: (id: number, size: string) => void;
  onCheckout: () => void;
  onClearCart: () => void;
};

export default function CartDrawer({ open, cart, onClose, onChangeQty, onRemove, onCheckout, onClearCart }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: "rgba(42,35,24,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          background: "oklch(0.987 0.022 95.277)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          borderLeft: "0.5px solid #d4c5b0",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "0.5px solid #d4c5b0" }}
        >
          <div>
            <h2 className="font-display text-lg font-semibold tracking-wide" style={{ color: "#2a2318" }}>
              Panier
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#8a7355" }}>
              {count > 0 ? `${count} article${count > 1 ? "s" : ""}` : "Vide"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Clear cart button — only shown when cart has items */}
            {cart.length > 0 && (
              confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-wide" style={{ color: "#8a7355" }}>Vider le panier ?</span>
                  <button
                    onClick={() => { onClearCart(); setConfirmClear(false); }}
                    className="px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium transition-all hover:opacity-80"
                    style={{ background: "#8a2a2a", color: "#fff" }}
                  >
                    Oui
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium transition-all hover:opacity-80"
                    style={{ border: "0.5px solid #d4c5b0", color: "#2a2318" }}
                  >
                    Non
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase transition-opacity hover:opacity-60"
                  style={{ color: "#8a7355" }}
                  aria-label="Vider le panier"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Vider
                </button>
              )
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-50"
              aria-label="Fermer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4c5b0" strokeWidth="1">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-sm tracking-wide" style={{ color: "#8a7355" }}>Votre panier est vide</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor ?? ''}`}
                  className="flex gap-4 pb-5"
                  style={{ borderBottom: "0.5px solid #e8ddd0" }}
                >
                  <div className="w-[72px] h-[88px] shrink-0 overflow-hidden" style={{ border: "0.5px solid #d4c5b0" }}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium truncate" style={{ color: "#2a2318" }}>
                      {item.name}
                    </p>
                    <p className="text-[10px] mt-0.5 tracking-widest uppercase" style={{ color: "#8a7355" }}>
                      Taille : {item.selectedSize} · {item.selectedColor}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#6b5b47" }}>
                      {fmt(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onChangeQty(item.id, item.selectedSize, -1)}
                          className="w-7 h-7 flex items-center justify-center text-sm transition-all hover:opacity-60"
                          style={{ border: "0.5px solid #d4c5b0", color: "#2a2318" }}
                        >
                          −
                        </button>
                        <span
                          className="w-8 text-center text-sm"
                          style={{ color: "#2a2318" }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onChangeQty(item.id, item.selectedSize, +1)}
                          className="w-7 h-7 flex items-center justify-center text-sm transition-all hover:opacity-60"
                          style={{ border: "0.5px solid #d4c5b0", color: "#2a2318" }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id, item.selectedSize)}
                        className="text-[10px] tracking-widest uppercase transition-opacity hover:opacity-50"
                        style={{ color: "#8a7355" }}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: "0.5px solid #d4c5b0" }}>
            {/* Shipping notice */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 mb-4 text-xs"
              style={{ background: "oklch(0.962 0.059 95.617)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span style={{ color: "#6b5b47" }}>
                Livraison gratuite dès <strong style={{ color: "#2a2318" }}>15 000 DZD</strong>
              </span>
            </div>

            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs tracking-widest uppercase" style={{ color: "#8a7355" }}>Sous-total</span>
              <span className="font-display text-base font-semibold" style={{ color: "#2a2318" }}>{fmt(total)}</span>
            </div>
            <p className="text-[10px] mb-4" style={{ color: "#8a7355" }}>Taxes et frais de livraison calculés à la commande</p>

            <button
              onClick={onCheckout}
              className="w-full py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all hover:opacity-85 active:scale-[0.99]"
              style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
            >
              Commander →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

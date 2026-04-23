"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/data";
import { fmt } from "@/lib/data";

type Props = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="13" height="13" viewBox="0 0 24 24"
            fill={s <= Math.round(rating) ? "#8a7355" : "none"} stroke="#8a7355" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-xs" style={{ color: "#8a7355" }}>{rating.toFixed(1)} · {count} avis</span>
    </div>
  );
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImg(0);
      setSelectedSize("");
      setSelectedColor(product.colors[0]?.name ?? "");
      setQty(1);
      setAdded(false);
      setSizeError(false);
    }
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleAdd() {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    for (let i = 0; i < qty; i++) onAddToCart(product!, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(42,35,24,0.65)" }} onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl grid md:grid-cols-[1fr_1fr] overflow-hidden shadow-2xl"
        style={{
          background: "oklch(0.987 0.022 95.277)",
          maxHeight: "92dvh",
          border: "0.5px solid #d4c5b0",
          animation: "scaleIn 0.22s ease forwards",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-50"
          style={{ background: "oklch(0.987 0.022 95.277 / 0.9)", border: "0.5px solid #d4c5b0" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        {/* LEFT — Images */}
        <div className="flex flex-col" style={{ borderRight: "0.5px solid #d4c5b0" }}>
          {/* Main image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
            <img
              key={activeImg}
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ animation: "fadeUp 0.3s ease forwards" }}
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }}
            />
            {/* Tag */}
            <span
              className="absolute top-4 left-4 px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-medium"
              style={{ background: product.tagColor + "22", color: product.tagColor, border: `0.5px solid ${product.tagColor}44` }}
            >
              {product.tag}
            </span>
            {discount && (
              <span className="absolute top-4 right-12 px-2 py-1 text-[9px] font-bold" style={{ background: "#8a2a2a", color: "#fff" }}>
                -{discount}%
              </span>
            )}

            {/* Prev/next arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ background: "oklch(0.987 0.022 95.277 / 0.85)", border: "0.5px solid #d4c5b0" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ background: "oklch(0.987 0.022 95.277 / 0.85)", border: "0.5px solid #d4c5b0" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-0 shrink-0" style={{ borderTop: "0.5px solid #d4c5b0" }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="flex-1 aspect-square overflow-hidden transition-all"
                style={{
                  opacity: activeImg === i ? 1 : 0.55,
                  outline: activeImg === i ? "1.5px solid #2a2318" : "none",
                  outlineOffset: "-1.5px",
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="overflow-y-auto flex flex-col">
          <div className="p-6 md:p-8 flex flex-col gap-5 flex-1">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "#8a7355" }}>
                  {product.category}
                </span>
                <span className="text-[9px]" style={{ color: "#d4c5b0" }}>·</span>
                <StarRating rating={product.rating} count={product.reviewCount} />
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3" style={{ color: "#2a2318", letterSpacing: "-0.02em" }}>
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold" style={{ color: "#2a2318" }}>
                  {fmt(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-base line-through" style={{ color: "#b5a898" }}>
                      {fmt(product.originalPrice)}
                    </span>
                    <span className="text-xs font-medium px-1.5 py-0.5" style={{ background: "#8a2a2a22", color: "#8a2a2a" }}>
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-[1.85]" style={{ color: "#6b5b47" }}>
              {product.description}
            </p>

            <div className="h-px" style={{ background: "#e8ddd0" }} />

            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#2a2318" }}>
                  Couleur
                </span>
                <span className="text-xs" style={{ color: "#8a7355" }}>{selectedColor}</span>
              </div>
              <div className="flex gap-2.5">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      background: c.hex,
                      border: selectedColor === c.name ? "2px solid #2a2318" : "0.5px solid #d4c5b0",
                      outline: selectedColor === c.name ? "2px solid oklch(0.987 0.022 95.277)" : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: sizeError ? "#8a2a2a" : "#2a2318" }}>
                  Taille {sizeError && <span className="text-[9px] normal-case ml-1" style={{ color: "#8a2a2a" }}>— Requis</span>}
                </span>
                <button className="text-[9px] tracking-widest uppercase underline" style={{ color: "#8a7355" }}>
                  Guide des tailles
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className="px-4 py-2 text-xs tracking-widest uppercase transition-all hover:opacity-80"
                    style={{
                      border: `0.5px solid ${selectedSize === s ? "#2a2318" : sizeError ? "#8a2a2a66" : "#d4c5b0"}`,
                      background: selectedSize === s ? "#2a2318" : "transparent",
                      color: selectedSize === s ? "oklch(0.987 0.022 95.277)" : "#2a2318",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center" style={{ border: "0.5px solid #d4c5b0" }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-lg transition-opacity hover:opacity-50"
                  style={{ color: "#2a2318", borderRight: "0.5px solid #d4c5b0" }}
                >
                  −
                </button>
                <span className="w-10 h-11 flex items-center justify-center text-sm font-medium" style={{ color: "#2a2318" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-11 flex items-center justify-center text-lg transition-opacity hover:opacity-50"
                  style={{ color: "#2a2318", borderLeft: "0.5px solid #d4c5b0" }}
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className="flex-1 h-11 text-xs tracking-[0.2em] uppercase font-medium transition-all hover:opacity-85 active:scale-[0.99]"
                style={{ background: added ? "#2a6b4a" : "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
              >
                {added ? "✓ Ajouté au panier" : `Ajouter au panier · ${fmt(product.price * qty)}`}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label: "Livraison DZ" },
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Paiement sécurisé" },
                { icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", label: "Retour 14j" },
              ].map(b => (
                <div
                  key={b.label}
                  className="flex flex-col items-center gap-1.5 py-3 text-center"
                  style={{ background: "oklch(0.962 0.059 95.617)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7355" strokeWidth="1.5">
                    <path d={b.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[9px] tracking-wide" style={{ color: "#6b5b47" }}>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Material info */}
            <div className="flex flex-col gap-2 pt-1" style={{ borderTop: "0.5px solid #e8ddd0" }}>
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em] uppercase w-20 shrink-0" style={{ color: "#8a7355" }}>Matière</span>
                <span className="text-xs" style={{ color: "#2a2318" }}>{product.material}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em] uppercase w-20 shrink-0" style={{ color: "#8a7355" }}>Paiement</span>
                <span className="text-xs flex items-center gap-1.5" style={{ color: "#2a2318" }}>
                  Dahabia accepté
                  <span className="px-1.5 py-0.5 text-[8px] tracking-widest uppercase" style={{ background: "#2a2318", color: "oklch(0.962 0.059 95.617)" }}>CCP</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

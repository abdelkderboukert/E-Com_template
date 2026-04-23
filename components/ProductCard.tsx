"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { fmt } from "@/lib/data";

type Props = {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onViewDetail: (product: Product) => void;
  style?: React.CSSProperties;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="10" height="10" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#8a7355" : "none"}
          stroke="#8a7355" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, onViewDetail, style }: Props) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!selectedSize) { setShowSizes(true); return; }
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setShowSizes(false);
    setTimeout(() => setAdded(false), 1800);
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="group flex flex-col cursor-pointer"
      style={style}
      onClick={() => onViewDetail(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSizes(false); }}
    >
      {/* ── Image container ───────────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-[3/4]" style={{ border: "0.5px solid #d4c5b0" }}>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }}
        />

        {/* Tag & discount badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-medium"
          style={{ background: product.tagColor + "22", color: product.tagColor, border: `0.5px solid ${product.tagColor}44` }}
        >
          {product.tag}
        </span>
        {discount ? (
          <span className="absolute top-3 right-3 px-2 py-1 text-[9px] font-bold" style={{ background: "#8a2a2a", color: "#fff" }}>
            -{discount}%
          </span>
        ) : (
          <button
            onClick={e => e.stopPropagation()}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all"
            style={{ opacity: hovered ? 1 : 0, background: "oklch(0.987 0.022 95.277 / 0.9)", border: "0.5px solid #d4c5b0" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}

        {/* ── DESKTOP hover overlay (hidden on mobile via md: classes) ── */}
        <div
          className="absolute inset-x-0 bottom-0 p-3 flex-col gap-2 transition-all duration-300 hidden md:flex"
          style={{
            background: "oklch(0.987 0.022 95.277 / 0.97)",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {showSizes && (
            <div className="flex gap-1.5 flex-wrap">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)}
                  className="px-2.5 py-1 text-[9px] tracking-widest uppercase transition-all"
                  style={{ border: `0.5px solid ${selectedSize === s ? "#2a2318" : "#d4c5b0"}`, background: selectedSize === s ? "#2a2318" : "transparent", color: selectedSize === s ? "oklch(0.987 0.022 95.277)" : "#2a2318" }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <button onClick={handleAdd}
            className="w-full py-2.5 text-[9px] tracking-[0.25em] uppercase font-medium transition-all active:scale-[0.98]"
            style={{ background: added ? "#2a6b4a" : "#2a2318", color: "oklch(0.987 0.022 95.277)" }}>
            {added ? "✓ Ajouté" : showSizes && !selectedSize ? "Choisir une taille" : "+ Ajouter au panier"}
          </button>
        </div>
      </div>

      {/* ── Info block ────────────────────────────────────────────── */}
      <div className="mt-3 flex flex-col gap-1 px-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>{product.category}</span>
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-[9px]" style={{ color: "#8a7355" }}>({product.reviewCount})</span>
          </div>
        </div>
        <p className="font-display text-sm font-medium leading-tight" style={{ color: "#2a2318" }}>{product.name}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium" style={{ color: "#2a2318" }}>{fmt(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: "#b5a898" }}>{fmt(product.originalPrice)}</span>
          )}
        </div>

        {/* Color swatches — always visible */}
        <div className="flex gap-1.5 mt-0.5">
          {product.colors.map(c => (
            <button key={c.name} onClick={e => { e.stopPropagation(); setSelectedColor(c.name); }} title={c.name}
              className="w-4 h-4 rounded-full transition-all"
              style={{ background: c.hex, border: selectedColor === c.name ? "1.5px solid #2a2318" : "0.5px solid #d4c5b0", outline: selectedColor === c.name ? "1px solid oklch(0.987 0.022 95.277)" : "none", outlineOffset: "1px" }}
            />
          ))}
        </div>

        {/* ── MOBILE-ONLY add-to-cart section (hidden on md+) ───────── */}
        <div className="flex flex-col gap-1.5 mt-2 md:hidden" onClick={e => e.stopPropagation()}>
          {/* Size selector — always shown on mobile */}
          <div className="flex gap-1.5 flex-wrap">
            {product.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)}
                className="px-2.5 py-1 text-[9px] tracking-widest uppercase transition-all"
                style={{
                  border: `0.5px solid ${selectedSize === s ? "#2a2318" : "#d4c5b0"}`,
                  background: selectedSize === s ? "#2a2318" : "transparent",
                  color: selectedSize === s ? "oklch(0.987 0.022 95.277)" : "#2a2318",
                }}>
                {s}
              </button>
            ))}
          </div>
          {/* Add to cart button */}
          <button
            onClick={handleAdd}
            className="w-full py-2.5 text-[9px] tracking-[0.25em] uppercase font-medium transition-all active:scale-[0.98]"
            style={{ background: added ? "#2a6b4a" : "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
          >
            {added ? "✓ Ajouté" : !selectedSize ? "Choisir une taille →" : "+ Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}

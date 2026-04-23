"use client";

import { useState } from "react";
import { type Product } from "@/lib/data";
import { useProducts } from "@/lib/ProductsContext";
import ProductCard from "./ProductCard";

type Props = {
  onAddToCart: (p: Product, size: string, color: string) => void;
  onViewDetail: (p: Product) => void;
};

const CATS = ["Tous", "Tops", "Bottoms", "Dresses", "Outerwear"];

export default function ProductsSection({ onAddToCart, onViewDetail }: Props) {
  const [active, setActive] = useState("Tous");
  const { products: PRODUCTS } = useProducts();

  const filtered = active === "Tous"
    ? PRODUCTS.slice(0, 6)
    : PRODUCTS.filter(p => p.category === active).slice(0, 6);

  return (
    <section id="products" className="px-6 md:px-16 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "#8a7355" }}>
            ✦ Nouvelle collection
          </p>
          <h2
            className="font-display leading-[1.05]"
            style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#2a2318", letterSpacing: "-0.02em" }}
          >
            Just dropped.
          </h2>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                border: "0.5px solid",
                borderColor: active === c ? "#2a2318" : "#d4c5b0",
                background: active === c ? "#2a2318" : "transparent",
                color: active === c ? "oklch(0.987 0.022 95.277)" : "#6b5b47",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
        {filtered.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            onViewDetail={onViewDetail}
            style={{ opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <a
          href="/products"
          className="px-10 py-3.5 text-xs tracking-[0.25em] uppercase border transition-all hover:opacity-70 inline-block"
          style={{ borderColor: "#2a2318", color: "#2a2318" }}
        >
          Voir toute la collection →
        </a>
      </div>
    </section>
  );
}

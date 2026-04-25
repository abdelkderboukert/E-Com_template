"use client";

import { useState, useCallback, useMemo } from "react";
import { type Product, type CartItem, fmt } from "@/lib/data";
import { useProducts } from "@/lib/ProductsContext";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

// ─── Types ────────────────────────────────────────────────────────────────────
type SortKey = "default" | "price-asc" | "price-desc" | "rating" | "name";

const CATEGORIES = ["Tous", "Tops", "Bottoms", "Dresses", "Outerwear"];
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Par défaut" },
  { key: "price-asc",  label: "Prix croissant" },
  { key: "price-desc", label: "Prix décroissant" },
  { key: "rating",     label: "Mieux notés" },
  { key: "name",       label: "Nom A → Z" },
];
const PRICE_RANGES = [
  { label: "Tout",            min: 0,     max: Infinity },
  { label: "Moins de 10 000", min: 0,     max: 10000 },
  { label: "10 000 – 20 000", min: 10000, max: 20000 },
  { label: "Plus de 20 000",  min: 20000, max: Infinity },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeCategory, setActiveCategory,
  activePriceRange, setActivePriceRange,
  activeTags, toggleTag,
  productCount,
  mobileOpen, onCloseMobile,
}: {
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  activePriceRange: number;
  setActivePriceRange: (i: number) => void;
  activeTags: string[];
  toggleTag: (t: string) => void;
  productCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isMobileDrawer?: boolean;
}) {
  const { products: PRODUCTS } = useProducts();
  const allTags = [...new Set(PRODUCTS.map(p => p.tag))];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(42,35,24,0.5)" }} onClick={onCloseMobile} />
      )}

      <aside
        className="shrink-0 flex flex-col gap-8 md:sticky md:top-20 md:self-start"
        style={{
          width: "220px",
          // Mobile: slide in from left
          position: mobileOpen ? "fixed" : undefined,
          inset: mobileOpen ? "0 auto 0 0" : undefined,
          zIndex: mobileOpen ? 50 : undefined,
          background: mobileOpen ? "oklch(0.987 0.022 95.277)" : undefined,
          padding: mobileOpen ? "80px 24px 24px" : undefined,
          overflowY: mobileOpen ? "auto" : undefined,
          transform: mobileOpen ? "translateX(0)" : undefined,
          transition: "transform 0.3s ease",
          borderRight: mobileOpen ? "0.5px solid #d4c5b0" : undefined,
          // Hide on mobile unless open
          display: mobileOpen ? "flex" : undefined,
        } as React.CSSProperties}
      >
        {mobileOpen && (
          <button onClick={onCloseMobile} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Results count */}
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8a7355" }}>
          {productCount} article{productCount !== 1 ? "s" : ""}
        </p>

        {/* Categories */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: "#2a2318" }}>Catégorie</p>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="text-left text-xs py-1.5 flex items-center justify-between transition-all hover:opacity-60"
                style={{ color: activeCategory === c ? "#2a2318" : "#8a7355", fontWeight: activeCategory === c ? "500" : "400" }}
              >
                <span>{c}</span>
                {activeCategory === c && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#2a2318" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: "#e8ddd0" }} />

        {/* Price */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: "#2a2318" }}>Prix</p>
          <div className="flex flex-col gap-1">
            {PRICE_RANGES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setActivePriceRange(i)}
                className="text-left text-xs py-1.5 flex items-center justify-between transition-all hover:opacity-60"
                style={{ color: activePriceRange === i ? "#2a2318" : "#8a7355", fontWeight: activePriceRange === i ? "500" : "400" }}
              >
                <span>{r.label}</span>
                {activePriceRange === i && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#2a2318" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: "#e8ddd0" }} />

        {/* Tags */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: "#2a2318" }}>Filtrer</p>
          <div className="flex flex-col gap-2">
            {allTags.map(t => (
              <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => toggleTag(t)}
                  className="w-4 h-4 flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    border: `0.5px solid ${activeTags.includes(t) ? "#2a2318" : "#d4c5b0"}`,
                    background: activeTags.includes(t) ? "#2a2318" : "transparent",
                  }}
                >
                  {activeTags.includes(t) && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs transition-opacity group-hover:opacity-60" style={{ color: "#6b5b47" }}>{t}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: "#e8ddd0" }} />

        {/* Reset */}
        <button
          onClick={() => {
            setActiveCategory("Tous");
            setActivePriceRange(0);
          }}
          className="text-[10px] tracking-[0.2em] uppercase text-left transition-opacity hover:opacity-50"
          style={{ color: "#8a7355" }}
        >
          Réinitialiser les filtres
        </button>
      </aside>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [cart, setCart]                 = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]         = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [detail, setDetail]             = useState<Product | null>(null);
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const { products: PRODUCTS, loading } = useProducts();

  // Filters
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activePriceRange, setActivePriceRange] = useState(0);
  const [activeTags, setActiveTags]       = useState<string[]>([]);
  const [sortKey, setSortKey]             = useState<SortKey>("default");
  const [viewMode, setViewMode]           = useState<"grid" | "large">("grid");
  const [sortOpen, setSortOpen]           = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = useCallback((product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) return prev.map(i =>
        i.id === product.id && i.selectedSize === size && i.selectedColor === color
          ? { ...i, qty: i.qty + 1 } : i
      );
      return [...prev, { ...product, qty: 1, selectedSize: size, selectedColor: color }];
    });
    setCartOpen(true);
  }, []);

  const changeQty = useCallback((id: number, size: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.id === id && i.selectedSize === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));
  }, []);

  const removeItem = useCallback((id: number, size: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleTag = useCallback((t: string) => {
    setActiveTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }, []);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[activePriceRange];
    let list = PRODUCTS.filter(p => {
      if (activeCategory !== "Tous" && p.category !== activeCategory) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (activeTags.length > 0 && !activeTags.includes(p.tag)) return false;
      return true;
    });
    switch (sortKey) {
      case "price-asc":  list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating":     list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "name":       list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [activeCategory, activePriceRange, activeTags, sortKey]);

  const activeSortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? "Trier";

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {/* Page hero banner */}
      <div
        className="pt-16"
        style={{ background: "oklch(0.962 0.059 95.617)", borderBottom: "0.5px solid #d4c5b0" }}
      >
        <div className="px-6 md:px-16 py-12 md:py-16">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "#8a7355" }}>
            ✦ SS 2026
          </p>
          <h1
            className="font-display font-bold leading-tight mb-2"
            style={{ fontSize: "clamp(32px, 6vw, 64px)", color: "#2a2318", letterSpacing: "-0.02em" }}
          >
            Tous les articles
          </h1>
          <p className="text-sm max-w-md" style={{ color: "#6b5b47" }}>
            {PRODUCTS.length} pièces sélectionnées avec soin — des basiques élevés aux pièces statement.
          </p>
        </div>
        <Marquee />
      </div>

      {/* Toolbar */}
      <div
        className="sticky top-16 z-30 flex items-center justify-between px-6 md:px-16 py-3 gap-4"
        style={{
          background: "oklch(0.987 0.022 95.277 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "0.5px solid #d4c5b0",
        }}
      >
        {/* Mobile filter btn */}
        <button
          onClick={() => setSidebarMobile(true)}
          className="md:hidden flex items-center gap-2 text-xs tracking-widest uppercase"
          style={{ color: "#2a2318" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filtres
          {(activeCategory !== "Tous" || activePriceRange !== 0 || activeTags.length > 0) && (
            <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}>
              {(activeCategory !== "Tous" ? 1 : 0) + (activePriceRange !== 0 ? 1 : 0) + activeTags.length}
            </span>
          )}
        </button>

        <p className="text-[10px] tracking-widest uppercase hidden md:block" style={{ color: "#8a7355" }}>
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-3 ml-auto">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(o => !o)}
              className="flex items-center gap-2 text-xs tracking-widest uppercase px-3 py-2 transition-opacity hover:opacity-60"
              style={{ border: "0.5px solid #d4c5b0", color: "#2a2318" }}
            >
              {activeSortLabel}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            {sortOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 z-50 py-1 shadow-lg"
                style={{ background: "oklch(0.987 0.022 95.277)", border: "0.5px solid #d4c5b0" }}
              >
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.key}
                    onClick={() => { setSortKey(o.key); setSortOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wide transition-all hover:opacity-60"
                    style={{
                      color: sortKey === o.key ? "#2a2318" : "#6b5b47",
                      fontWeight: sortKey === o.key ? "500" : "400",
                      background: sortKey === o.key ? "oklch(0.962 0.059 95.617)" : "transparent",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="hidden md:flex" style={{ border: "0.5px solid #d4c5b0" }}>
            {(["grid", "large"] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className="w-9 h-9 flex items-center justify-center transition-all"
                style={{ background: viewMode === v ? "#2a2318" : "transparent" }}
              >
                {v === "grid" ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill={viewMode === v ? "oklch(0.987 0.022 95.277)" : "#8a7355"}>
                    <rect x="0" y="0" width="7" height="7" rx="0.5" /><rect x="9" y="0" width="7" height="7" rx="0.5" />
                    <rect x="0" y="9" width="7" height="7" rx="0.5" /><rect x="9" y="9" width="7" height="7" rx="0.5" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill={viewMode === v ? "oklch(0.987 0.022 95.277)" : "#8a7355"}>
                    <rect x="0" y="0" width="16" height="7" rx="0.5" /><rect x="0" y="9" width="16" height="7" rx="0.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-0 px-6 md:px-16 py-10 min-h-screen relative">
        {/* Sidebar — desktop */}
        <div className="hidden md:block mr-10">
          <Sidebar
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            activePriceRange={activePriceRange} setActivePriceRange={setActivePriceRange}
            activeTags={activeTags} toggleTag={toggleTag}
            productCount={filtered.length}
            mobileOpen={false} onCloseMobile={() => {}}
          />
        </div>

        {/* Sidebar — mobile */}
        <div className={`md:hidden ${!sidebarMobile ? "hidden" : ""}`}>
          <Sidebar
            activeCategory={activeCategory} setActiveCategory={c => { setActiveCategory(c); setSidebarMobile(false); }}
            activePriceRange={activePriceRange} setActivePriceRange={i => { setActivePriceRange(i); setSidebarMobile(false); }}
            activeTags={activeTags} toggleTag={toggleTag}
            productCount={filtered.length}
            mobileOpen={true} onCloseMobile={() => setSidebarMobile(false)}
          />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4c5b0" strokeWidth="1">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <p className="text-sm tracking-wide" style={{ color: "#8a7355" }}>Aucun article ne correspond à vos filtres.</p>
              <button
                onClick={() => { setActiveCategory("Tous"); setActivePriceRange(0); setActiveTags([]); }}
                className="text-xs tracking-[0.2em] uppercase underline transition-opacity hover:opacity-50"
                style={{ color: "#2a2318" }}
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-x-5 gap-y-10 ${
                viewMode === "large"
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
              }`}
            >
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  onViewDetail={setDetail}
                  style={{
                    opacity: 0,
                    animation: "fadeUp 0.5s ease forwards",
                    animationDelay: `${(i % 6) * 60}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Overlays */}
      <ProductDetailModal
        product={detail}
        onClose={() => setDetail(null)}
        onAddToCart={(p, size, color) => { addToCart(p, size, color); setDetail(null); }}
      />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeItem}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        onClearCart={clearCart}
      />

      {checkoutOpen && (
        <CheckoutModal
          open={checkoutOpen}
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => setCart([])}
        />
      )}
    </>
  );
}

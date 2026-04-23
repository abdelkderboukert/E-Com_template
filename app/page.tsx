"use client";

import { useState, useCallback } from "react";
import type { CartItem, Product } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductsSection from "@/components/ProductsSection";
import BrandStory from "@/components/BrandStory";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import Footer from "@/components/Footer";

export default function Page() {
  const [cart, setCart]                 = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]         = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [detail, setDetail]             = useState<Product | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = useCallback((product: Product, size: string, color: string = "") => {
    setCart(prev => {
      const existing = prev.find(
        i => i.id === product.id && i.selectedSize === size && i.selectedColor === color
      );
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.selectedSize === size && i.selectedColor === color
            ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1, selectedSize: size, selectedColor: color }];
    });
    setCartOpen(true);
  }, []);

  const changeQty = useCallback((id: number, size: string, delta: number) => {
    setCart(prev =>
      prev.map(i =>
        i.id === id && i.selectedSize === size
          ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  }, []);

  const removeItem = useCallback((id: number, size: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  function openCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  return (
    <>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero onShop={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} />
        <Marquee />
        <ProductsSection onAddToCart={addToCart} onViewDetail={setDetail} />
        <BrandStory />
      </main>

      <Footer />

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
        onCheckout={openCheckout}
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

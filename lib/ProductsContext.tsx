"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "./data";

type ProductsContextType = {
  products: Product[];
  refreshProducts: () => void;
  loading: boolean;
};

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  refreshProducts: () => {},
  loading: true,
});

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, refreshProducts: fetchProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}

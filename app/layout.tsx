import type { Metadata } from "next";
import "./globals.css";
import { ProductsProvider } from "@/lib/ProductsContext";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "AURUM — Quiet Luxury Clothing",
  description: "Elevated basics crafted from the finest natural fabrics. Effortless. Intentional.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ProductsProvider>
          {children}
          <FloatingContact />
        </ProductsProvider>
      </body>
    </html>
  );
}

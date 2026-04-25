export type Product = {
  id: number;
  name: string;
  price: number;        // in DZD
  originalPrice?: number;
  tag: string;
  tagColor: string;
  img: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  material: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
};

export type CartItem = Product & { qty: number; selectedSize: string; selectedColor: string };
export type CheckoutStep = "recap" | "delivery" | "choose" | "success";

import { currencySymbol } from "@/lib/i18n";

export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","Chile","China","Colombia","Czech Republic","Denmark",
  "Egypt","Finland","France","Germany","Greece","India","Indonesia","Iran","Iraq",
  "Ireland","Italy","Japan","Jordan","Kenya","Kuwait","Lebanon","Libya","Malaysia",
  "Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan",
  "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia",
  "Senegal","Singapore","South Africa","South Korea","Spain","Sweden","Switzerland",
  "Thailand","Tunisia","Turkey","UAE","Ukraine","United Kingdom","United States",
  "Venezuela","Vietnam",
];

export const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "decimal" }).format(n) + currencySymbol;

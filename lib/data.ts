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

export const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra",
  "Béchar","Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret",
  "Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda","Skikda",
  "Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem",
  "M'Sila","Mascara","Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj",
  "Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela",
  "Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
  "Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal",
  "Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","M'Ghair","El Meniaa",
];

export const fmt = (n: number) =>
  new Intl.NumberFormat("fr-DZ", { style: "decimal" }).format(n) + " DZD";

export type Language = "english" | "french";

// Developer: Change this variable to switch languages (e.g. "french" or "english")
export const language: Language = "english";

// Developer: Change this variable to switch your store currency
export const currency = "DZ";
export const currencySymbol = " د.ج";
export const currencyCode = "dzd";

const dictionaries = {
  english: {
    // General
    freeDelivery: "Free delivery over",
    addToCart: "Add to cart",
    cart: "Cart",
    total: "Total",
    checkout: "Checkout",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue shopping",
    
    // Checkout Modal
    checkoutTitle: "Finalize your order",
    checkoutSubtitle: "Please fill in your details for delivery.",
    fullName: "Full Name",
    phone: "Phone Number",
    country: "Country",
    address: "Full Address",
    notes: "Notes (Optional)",
    placeholderName: "John Doe",
    placeholderPhone: "+1 234 567 890",
    placeholderAddress: "123 Main Street, City",
    selectCountry: "-- Select your country --",
    state: "State / Province",
    selectState: "-- Select state --",
    paymentMethod: "Payment Method",
    payDelivery: "Cash on Delivery",
    payCard: "Credit Card",
    payWhatsApp: "Order via WhatsApp",
    payInstagram: "Order via Instagram",
    confirmOrder: "Confirm Order",
    processing: "Processing...",
    orderSuccess: "Order Confirmed!",
    orderSuccessMsg: "Thank you for your order. We will process it shortly.",
    backToHome: "Back to Home",
    deliveryFee: "Delivery",
    free: "Free",
    subtotal: "Subtotal",
    requiredFieldsError: "Please fill in all required fields.",
    
    // Footer & Marquee
    marquee1: "Free delivery worldwide",
    marquee2: "Premium quality guaranteed",
    marquee3: "Secure payments",
    footerDesc: "Your trusted store for premium products worldwide.",
    allRightsReserved: "All rights reserved.",
    
    // Hero
    shopNow: "Shop Now",
    lookbook: "Lookbook →",
    heroFeatures: ["100% natural fibers", "Worldwide Shipping", "Secure Payments"],
    featuredPiece: "Featured Piece",
    ltdEd: "Ltd. Ed.",
    scroll: "Scroll",
    
    // Admin
    adminDashboard: "Admin Dashboard",
    products: "Products",
    orders: "Orders",
    settings: "Settings",
    searchCountry: "Search country...",
    deliveryPricing: "Delivery Pricing",
    deliveryPricingDesc: "Set delivery prices per country (0 = Free). Delivery becomes automatically free above",
    saveChanges: "Save Changes",
    addNewProduct: "Add New Product",
    price: "Price",
    description: "Description",
    category: "Category",
    stock: "Stock",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
  },
  french: {
    // General
    freeDelivery: "Livraison gratuite dès",
    addToCart: "Ajouter au panier",
    cart: "Panier",
    total: "Total",
    checkout: "Commander",
    emptyCart: "Votre panier est vide",
    continueShopping: "Continuer vos achats",
    
    // Checkout Modal
    checkoutTitle: "Finaliser votre commande",
    checkoutSubtitle: "Veuillez renseigner vos informations pour la livraison.",
    fullName: "Nom Complet",
    phone: "Numéro de Téléphone",
    country: "Pays",
    address: "Adresse Complète",
    notes: "Notes (Optionnel)",
    placeholderName: "Jean Dupont",
    placeholderPhone: "+33 6 12 34 56 78",
    placeholderAddress: "123 Rue Principale, Ville",
    selectCountry: "-- Sélectionnez votre pays --",
    state: "État / Wilaya",
    selectState: "-- Sélectionnez l'état/wilaya --",
    paymentMethod: "Méthode de Paiement",
    payDelivery: "Paiement à la livraison",
    payCard: "Carte Bancaire",
    payWhatsApp: "Commander via WhatsApp",
    payInstagram: "Commander via Instagram",
    confirmOrder: "Confirmer la commande",
    processing: "Traitement...",
    orderSuccess: "Commande Confirmée !",
    orderSuccessMsg: "Merci pour votre commande. Nous la traiterons dans les plus brefs délais.",
    backToHome: "Retour à l'accueil",
    deliveryFee: "Livraison",
    free: "Gratuite",
    subtotal: "Sous-total",
    requiredFieldsError: "Veuillez remplir tous les champs obligatoires.",
    
    // Footer & Marquee
    marquee1: "Livraison gratuite dans le monde entier",
    marquee2: "Qualité premium garantie",
    marquee3: "Paiements sécurisés",
    footerDesc: "Votre boutique de confiance pour des produits premium dans le monde entier.",
    allRightsReserved: "Tous droits réservés.",
    
    // Hero
    shopNow: "Acheter maintenant",
    lookbook: "Lookbook →",
    heroFeatures: ["100% fibres naturelles", "Livraison internationale", "Paiements sécurisés"],
    featuredPiece: "Pièce vedette",
    ltdEd: "Éd. Lim.",
    scroll: "Défiler",
    
    // Admin
    adminDashboard: "Tableau de Bord Admin",
    products: "Produits",
    orders: "Commandes",
    settings: "Paramètres",
    searchCountry: "Rechercher un pays...",
    deliveryPricing: "Tarifs de Livraison",
    deliveryPricingDesc: "Définissez les tarifs de livraison par pays (0 = Gratuit). La livraison devient automatiquement gratuite dès",
    saveChanges: "Enregistrer les modifications",
    addNewProduct: "Ajouter un nouveau produit",
    price: "Prix",
    description: "Description",
    category: "Catégorie",
    stock: "Stock",
    inStock: "En Stock",
    outOfStock: "Rupture de Stock",
  }
};

export function t(key: keyof typeof dictionaries["english"]): string {
  const val = dictionaries[language][key] || dictionaries["english"][key] || key;
  return Array.isArray(val) ? val.join(", ") : val;
}

export function tArray(key: keyof typeof dictionaries["english"]): string[] {
  const val = dictionaries[language][key] || dictionaries["english"][key];
  return Array.isArray(val) ? val : [val];
}

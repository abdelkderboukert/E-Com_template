import Link from "next/link";
const LINKS = {
  "Collections": [{label: "Tops", href: "/products"}, {label: "Bottoms", href: "/products"}, {label: "Robes", href: "/products"}, {label: "Manteaux", href: "/products"}],
  "Aide": [{label: "FAQ", href: "/"}, {label: "Livraison", href: "/"}, {label: "Retours", href: "/"}, {label: "Contact", href: "/"}],
  "Légal": [{label: "Mentions légales", href: "/"}, {label: "Confidentialité", href: "/"}, {label: "CGV", href: "/"}],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: "0.5px solid #d4c5b0" }}>
      {/* Newsletter */}
      <div
        className="px-6 md:px-16 py-12"
        style={{ background: "oklch(0.962 0.059 95.617)", borderBottom: "0.5px solid #d4c5b0" }}
      >
        <div className="max-w-lg">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "#8a7355" }}>
            Newsletter
          </p>
          <h4 className="font-display text-2xl font-bold mb-4" style={{ color: "#2a2318" }}>
            En avant-première.
          </h4>
          <div className="flex">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 text-sm outline-none"
              style={{
                border: "0.5px solid #d4c5b0",
                borderRight: "none",
                background: "oklch(0.987 0.022 95.277)",
                color: "#2a2318",
              }}
            />
            <button
              className="px-6 py-3 text-xs tracking-[0.2em] uppercase shrink-0 transition-opacity hover:opacity-80"
              style={{ background: "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
            >
              S'abonner
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="px-6 md:px-16 py-12 grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-display text-xl font-bold tracking-[0.15em] uppercase" style={{ color: "#2a2318" }}>
            Aurum
          </span>
          <p className="text-xs leading-[1.9] max-w-xs" style={{ color: "#6b5b47" }}>
            Ethical and refined fashion, made to last. Worldwide shipping
            available. Secure payments accepted.
          </p>
          <div className="flex gap-4 mt-1">
            {["Instagram", "TikTok", "Pinterest"].map(s => (
              <a
                key={s}
                href="/"
                className="text-[10px] tracking-widest uppercase transition-opacity hover:opacity-50"
                style={{ color: "#8a7355" }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([col, items]) => (
          <div key={col} className="flex flex-col gap-3">
            <p className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: "#2a2318" }}>{col}</p>
            {items.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs tracking-wide transition-opacity hover:opacity-50"
                style={{ color: "#6b5b47" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 md:px-16 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
        style={{ borderTop: "0.5px solid #d4c5b0" }}
      >
        <p className="text-[10px] tracking-widest" style={{ color: "#8a7355" }}>
          © 2026 Aurum. Tous droits réservés. Algérie.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: "#8a7355" }}>Paiement accepté :</span>
          <span
            className="px-2 py-1 text-[9px] tracking-widest uppercase font-medium"
            style={{ background: "#2a2318", color: "oklch(0.962 0.059 95.617)" }}
          >
            Dahabia
          </span>
          <span
            className="px-2 py-1 text-[9px] tracking-widest uppercase font-medium"
            style={{ border: "0.5px solid #d4c5b0", color: "#8a7355" }}
          >
            CCP
          </span>
        </div>
      </div>
    </footer>
  );
}

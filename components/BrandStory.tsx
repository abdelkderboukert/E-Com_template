export default function BrandStory() {
  return (
    <section
      className="mx-6 md:mx-16 mb-24 grid md:grid-cols-[1fr_1fr] overflow-hidden"
      style={{ border: "0.5px solid #d4c5b0" }}
    >
      {/* Image */}
      <div className="aspect-[4/3] md:aspect-auto overflow-hidden order-2 md:order-1">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
          alt="Atelier Aurum"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Text */}
      <div
        className="p-10 md:p-16 flex flex-col justify-center gap-6 order-1 md:order-2"
        style={{ background: "oklch(0.962 0.059 95.617)" }}
      >
        <div className="flex items-center gap-3">
          <span className="block h-px w-8" style={{ background: "#8a7355" }} />
          <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#8a7355" }}>
            Notre philosophie
          </span>
        </div>

        <h3
          className="font-display leading-tight"
          style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: "#2a2318", letterSpacing: "-0.02em" }}
        >
          Less, but<br />
          <em style={{ fontStyle: "italic", color: "#8a7355" }}>better.</em>
        </h3>

        <p className="text-sm leading-[1.9] max-w-sm" style={{ color: "#6b5b47" }}>
          Nous croyons en une garde-robe qui dure — pas seulement en qualité, 
          mais en pertinence. Chaque pièce est conçue pour vieillir avec grâce 
          et s'adapter à chaque moment de votre vie.
        </p>

        <ul className="flex flex-col gap-2.5">
          {[
            "Fibres naturelles certifiées",
            "Fabrication éthique et locale",
            "Teintures végétales exclusives",
          ].map(item => (
            <li key={item} className="flex items-center gap-2.5 text-xs" style={{ color: "#2a2318" }}>
              <span style={{ color: "#8a7355" }}>✦</span>
              <span className="tracking-wide">{item}</span>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="self-start text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-50 flex items-center gap-2"
          style={{ color: "#2a2318", borderBottom: "0.5px solid #2a2318", paddingBottom: "2px" }}
        >
          Notre histoire →
        </a>
      </div>
    </section>
  );
}

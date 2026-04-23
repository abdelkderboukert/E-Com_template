"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/data";

// Helper for Google Drive links (via our internal proxy to bypass Google Blocks)
function getDriveDirectUrl(url: string) {
  if (!url) return url;
  
  // Match standard share links: /file/d/ID
  let match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `/api/image?id=${match[1]}`;
  }
  
  // Match older uc?export links we might have accidentally saved
  match = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `/api/image?id=${match[1]}`;
  }
  
  return url;
}

type Color = { name: string; hex: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaved: () => void;
};

// ─── Inline Color Row ──────────────────────────────────────────────────────────
function ColorRow({
  color,
  onChange,
  onRemove,
}: {
  color: Color;
  onChange: (updated: Color) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2"
      style={{ background: "oklch(0.962 0.059 95.617)", border: "0.5px solid #d4c5b0" }}
    >
      {/* Color swatch + picker */}
      <label className="relative cursor-pointer">
        <div
          className="w-8 h-8 flex-shrink-0"
          style={{ background: color.hex, border: "0.5px solid #d4c5b0" }}
        />
        <input
          type="color"
          value={color.hex}
          onChange={e => onChange({ ...color, hex: e.target.value })}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Choisir une couleur"
        />
      </label>

      {/* Color name */}
      <input
        type="text"
        value={color.name}
        onChange={e => onChange({ ...color, name: e.target.value })}
        placeholder="Nom (ex: Ivoire)"
        className="flex-1 px-2 py-1.5 text-xs outline-none"
        style={{
          background: "oklch(0.987 0.022 95.277)",
          border: "0.5px solid #d4c5b0",
          color: "#2a2318",
        }}
      />

      {/* Hex display */}
      <span className="text-[10px] font-mono hidden sm:block" style={{ color: "#8a7355", minWidth: "52px" }}>
        {color.hex}
      </span>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="w-6 h-6 flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-50"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a2a2a" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function AdminProductModal({ isOpen, onClose, product, onSaved }: Props) {
  const blank = {
    name: "", price: 0, originalPrice: 0 as number | undefined,
    tag: "New", tagColor: "#2a6b4a",
    img: "", images: [] as string[], category: "Tops",
    sizes: [] as string[], colors: [] as Color[],
    description: "", material: "", inStock: true, rating: 5, reviewCount: 0,
  };

  const [formData, setFormData] = useState(blank);
  const [sizesStr, setSizesStr] = useState("");
  const [imagesStr, setImagesStr] = useState("");
  const [colors, setColors]      = useState<Color[]>([]);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (product) {
      setFormData(product as typeof blank);
      setSizesStr(product.sizes.join(", "));
      setImagesStr(product.images.join(", "));
      setColors([...product.colors]);
    } else {
      setFormData(blank);
      setSizesStr("");
      setImagesStr("");
      setColors([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOpen]);

  if (!isOpen) return null;

  const addColor = () => setColors(prev => [...prev, { name: "", hex: "#c9b49a" }]);

  const updateColor = (i: number, updated: Color) =>
    setColors(prev => prev.map((c, idx) => (idx === i ? updated : c)));

  const removeColor = (i: number) =>
    setColors(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate colors
    const invalidColor = colors.find(c => !c.name.trim());
    if (invalidColor) {
      setError("Chaque couleur doit avoir un nom.");
      return;
    }

    setSaving(true);

    const sizes  = sizesStr.split(",").map(s => s.trim()).filter(Boolean);
    const images = imagesStr.split(",").map(i => i.trim()).filter(Boolean);
    const payload = {
      ...formData,
      img: getDriveDirectUrl(formData.img),
      sizes,
      images: images.map(getDriveDirectUrl),
      colors,
      originalPrice: formData.originalPrice || undefined,
    };

    const method = product ? "PUT" : "POST";
    const url    = product ? `/api/products/${product.id}` : `/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onSaved();
      } else {
        setError("Erreur lors de la sauvegarde.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = {
    background: "oklch(0.962 0.059 95.617)",
    border: "0.5px solid #d4c5b0",
    color: "#2a2318",
  };
  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#2a2318");
  const blurStyle  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#d4c5b0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl"
        style={{ background: "oklch(0.987 0.022 95.277)", border: "0.5px solid #d4c5b0" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: "oklch(0.987 0.022 95.277)", borderBottom: "0.5px solid #d4c5b0" }}
        >
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#8a7355" }}>
              ✦ Administration
            </p>
            <h2 className="font-display text-xl font-medium" style={{ color: "#2a2318" }}>
              {product ? "Modifier le produit" : "Ajouter un produit"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a2318" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                Nom <span style={{ color: "#8a2a2a" }}>*</span>
              </label>
              <input
                required type="text"
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={fieldStyle}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                Catégorie
              </label>
              <select
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={fieldStyle}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
              </select>
            </div>
          </div>

          {/* Price + Original price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                Prix (DZD) <span style={{ color: "#8a2a2a" }}>*</span>
              </label>
              <input
                required type="number" min="0"
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={fieldStyle}
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                Prix original <span className="normal-case" style={{ color: "#b5a898" }}>(optionnel)</span>
              </label>
              <input
                type="number" min="0"
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={fieldStyle}
                value={formData.originalPrice ?? ""}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
          </div>

          {/* Tag + Tag color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                Tag <span style={{ color: "#8a2a2a" }}>*</span>
              </label>
              <input
                required type="text"
                placeholder="New, Sale, Bestseller…"
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={fieldStyle}
                value={formData.tag}
                onChange={e => setFormData({ ...formData, tag: e.target.value })}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
                Couleur du tag
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <input
                  type="color"
                  className="w-10 h-10 cursor-pointer border-0 p-0.5"
                  style={{ background: "transparent", border: "0.5px solid #d4c5b0" }}
                  value={formData.tagColor}
                  onChange={e => setFormData({ ...formData, tagColor: e.target.value })}
                />
                <span
                  className="flex-1 px-3 py-2.5 text-xs font-mono"
                  style={{ background: formData.tagColor + "22", border: `0.5px solid ${formData.tagColor}44`, color: formData.tagColor }}
                >
                  {formData.tag || "Tag"} • {formData.tagColor}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px" style={{ background: "#e8ddd0" }} />

          {/* Main image */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
              Image principale (URL) <span style={{ color: "#8a2a2a" }}>*</span>
            </label>
            <input
              required type="text"
              placeholder="https://images.unsplash.com/…"
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={fieldStyle}
              value={formData.img}
              onChange={e => setFormData({ ...formData, img: e.target.value })}
              onFocus={focusStyle} onBlur={blurStyle}
            />
            {formData.img && (
              <img
                src={getDriveDirectUrl(formData.img)}
                alt="preview"
                className="w-16 h-20 object-cover mt-2"
                style={{ border: "0.5px solid #d4c5b0" }}
                onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600/f5f0e8/8a7355?text=AURUM"; e.currentTarget.onerror = null; }}
              />
            )}
          </div>

          {/* Gallery images */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
              Autres images <span className="normal-case" style={{ color: "#b5a898" }}>(URLs séparées par des virgules)</span>
            </label>
            <textarea
              rows={2}
              placeholder="https://…, https://…"
              className="w-full px-3 py-2.5 text-sm outline-none resize-none"
              style={fieldStyle}
              value={imagesStr}
              onChange={e => setImagesStr(e.target.value)}
              onFocus={focusStyle as any} onBlur={blurStyle as any}
            />
          </div>

          <div className="h-px" style={{ background: "#e8ddd0" }} />

          {/* Colors ─── Key section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "#6b5b47" }}>
                Couleurs ({colors.length})
              </label>
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
                style={{ border: "0.5px solid #2a2318", color: "#2a2318" }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                </svg>
                Ajouter une couleur
              </button>
            </div>

            {colors.length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: "#b5a898", border: "0.5px dashed #d4c5b0" }}>
                Aucune couleur — cliquez sur "Ajouter une couleur"
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {colors.map((c, i) => (
                  <ColorRow
                    key={i}
                    color={c}
                    onChange={updated => updateColor(i, updated)}
                    onRemove={() => removeColor(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="h-px" style={{ background: "#e8ddd0" }} />

          {/* Sizes */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
              Tailles <span className="normal-case" style={{ color: "#b5a898" }}>(séparées par des virgules)</span>
            </label>
            <input
              type="text"
              placeholder="XS, S, M, L, XL"
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={fieldStyle}
              value={sizesStr}
              onChange={e => setSizesStr(e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* Material */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
              Matériau
            </label>
            <input
              type="text"
              placeholder="100% Lin certifié…"
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={fieldStyle}
              value={formData.material}
              onChange={e => setFormData({ ...formData, material: e.target.value })}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "#6b5b47" }}>
              Description <span style={{ color: "#8a2a2a" }}>*</span>
            </label>
            <textarea
              required rows={3}
              className="w-full px-3 py-2.5 text-sm outline-none resize-none"
              style={fieldStyle}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              onFocus={focusStyle as any} onBlur={blurStyle as any}
            />
          </div>

          {/* In stock toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
              className="relative w-10 h-5 transition-colors"
              style={{ background: formData.inStock ? "#2a6b4a" : "#d4c5b0", borderRadius: "999px" }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 bg-white transition-transform"
                style={{ borderRadius: "50%", transform: formData.inStock ? "translateX(22px)" : "translateX(2px)" }}
              />
            </div>
            <span className="text-xs" style={{ color: formData.inStock ? "#2a6b4a" : "#8a7355" }}>
              {formData.inStock ? "En stock" : "Épuisé"}
            </span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-xs px-3 py-2 border" style={{ color: "#8a2a2a", background: "#8a2a2a11", borderColor: "#8a2a2a44" }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div
            className="sticky bottom-0 -mx-6 px-6 py-4 flex justify-end gap-3 mt-2"
            style={{ background: "oklch(0.987 0.022 95.277)", borderTop: "0.5px solid #d4c5b0" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
              style={{ border: "0.5px solid #d4c5b0", color: "#8a7355" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all active:scale-[0.98]"
              style={{ background: saving ? "#8a7355" : "#2a2318", color: "oklch(0.987 0.022 95.277)" }}
            >
              {saving ? "Enregistrement…" : product ? "Mettre à jour" : "Créer le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

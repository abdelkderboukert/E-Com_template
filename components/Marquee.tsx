import { t } from "@/lib/i18n";

export default function Marquee() {
  const ITEMS = [
    t("marquee1"),
    t("marquee2"),
    t("marquee3"),
  ];
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{ background: "oklch(0.962 0.059 95.617)", borderColor: "#d4c5b0" }}
    >
      <div
        className="flex gap-14 whitespace-nowrap"
        style={{ animation: "marquee 24s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase shrink-0"
            style={{ color: "#8a7355" }}
          >
            <span style={{ color: "#c9b99a" }}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

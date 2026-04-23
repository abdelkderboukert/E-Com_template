"use client";

import { useState } from "react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // UPDATE THESE LINKS TO YOUR REAL INSTAGRAM AND WHATSAPP
  // ─────────────────────────────────────────────────────────────
  const whatsappUrl = "https://wa.me/213656906049"; // Example format: https://wa.me/213XXXXXXXXX
  const instagramUrl = "https://instagram.com/aurum.dz"; // Example format: https://instagram.com/YOUR_USERNAME

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col-reverse items-start gap-4" style={{ fontFamily: "inherit" }}>
      
      {/* Main Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
        style={{ 
          background: "#2a2318",
          border: "0.5px solid #d4c5b0", 
          boxShadow: "0 8px 30px rgba(42,35,24,0.3)" 
        }}
        aria-label="Contactez-nous"
      >
        {!open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "scaleIn 0.3s ease" }}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "scaleIn 0.3s ease" }}>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Floating Menu */}
      <div 
        className="flex flex-col gap-3 transition-all duration-400 origin-bottom-left"
        style={{ 
          opacity: open ? 1 : 0, 
          transform: open ? "translateY(0) scale(1)" : "translateY(24px) scale(0.8)",
          pointerEvents: open ? "auto" : "none",
          marginLeft: "3px" // align with the center of the larger button
        }}
      >
        {/* Instagram */}
        <div className="flex items-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[46px] h-[46px] rounded-[18px] flex items-center justify-center text-white shadow-lg transition-transform hover:-translate-y-1 active:scale-95"
            style={{ 
              background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              boxShadow: "0 6px 20px rgba(220, 39, 67, 0.3)"
            }}
            aria-label="Instagram"
            title="Visiter notre Instagram"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <span className="text-[10px] tracking-widest uppercase font-medium bg-black/70 text-white px-3 py-1.5 rounded backdrop-blur-sm"
            style={{ opacity: open ? 1 : 0, transform: open ? 'translateX(0)' : 'translateX(-10px)', transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s" }}
          >
            Instagram
          </span>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[46px] h-[46px] rounded-[18px] flex items-center justify-center text-white shadow-lg transition-transform hover:-translate-y-1 active:scale-95 relative"
            style={{ 
              background: "#25D366",
              boxShadow: "0 6px 20px rgba(37, 211, 102, 0.3)" 
            }}
            aria-label="WhatsApp"
            title="Nous contacter sur WhatsApp"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
               <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
          </a>
          <span className="text-[10px] tracking-widest uppercase font-medium bg-black/70 text-white px-3 py-1.5 rounded backdrop-blur-sm shadow-xl"
            style={{ opacity: open ? 1 : 0, transform: open ? 'translateX(0)' : 'translateX(-10px)', transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.05s" }}
          >
            WhatsApp
          </span>
        </div>
      </div>
    </div>
  );
}

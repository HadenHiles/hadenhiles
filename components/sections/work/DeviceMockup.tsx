"use client";

import { motion } from "framer-motion";

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

interface MockupProps {
  src: string | null;
  alt: string;
  isVisible?: boolean;
}

export function PhoneMockup({ src, alt, isVisible = true }: MockupProps) {
  return (
    <div className="relative mx-auto select-none" style={{ width: "min(220px, 55vw)" }}>
      {/* Outer shell */}
      <div
        className="relative"
        style={{
          borderRadius: "38px",
          background: "linear-gradient(145deg, #2a2a38 0%, #1a1a24 100%)",
          padding: "8px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Side buttons — volume up */}
        <div
          className="absolute"
          style={{
            left: -4,
            top: "22%",
            width: 4,
            height: 28,
            borderRadius: "2px 0 0 2px",
            background: "#252530",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* Side buttons — volume down */}
        <div
          className="absolute"
          style={{
            left: -4,
            top: "33%",
            width: 4,
            height: 28,
            borderRadius: "2px 0 0 2px",
            background: "#252530",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* Side buttons — power */}
        <div
          className="absolute"
          style={{
            right: -4,
            top: "25%",
            width: 4,
            height: 40,
            borderRadius: "0 2px 2px 0",
            background: "#252530",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />

        {/* Screen area */}
        <div
          className="relative overflow-hidden bg-black"
          style={{
            borderRadius: "30px",
            aspectRatio: "9/19.5",
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute z-20"
            style={{
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: "38%",
              height: 28,
              borderRadius: 20,
              background: "#000",
            }}
          />

          {/* Screen content */}
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <motion.img
              src={src}
              alt={alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-xs text-white/20">no preview</span>
            </div>
          )}

          {/* Screen glare overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
            }}
          />

          {/* Home indicator */}
          <div
            className="absolute z-20"
            style={{
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: "32%",
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.25)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Mockup ───────────────────────────────────────────────────────────

export function DesktopMockup({ src, alt, isVisible = true }: MockupProps) {
  return (
    <div className="relative w-full select-none" style={{ maxWidth: 480 }}>
      {/* Monitor body */}
      <div
        style={{
          borderRadius: "12px 12px 6px 6px",
          background: "linear-gradient(160deg, #2a2a38 0%, #1a1a24 100%)",
          padding: "10px 10px 8px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {/* Camera dot */}
        <div
          className="absolute z-10"
          style={{
            top: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#252535",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />

        {/* Screen */}
        <div
          className="overflow-hidden bg-black"
          style={{ borderRadius: 6, aspectRatio: "16/10" }}
        >
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <motion.img
              src={src}
              alt={alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-xs text-white/20">no preview</span>
            </div>
          )}

          {/* Glare */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Bottom chin */}
        <div className="flex items-center justify-center pt-2">
          <div
            style={{
              width: 40,
              height: 3,
              borderRadius: 2,
              background: "rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </div>

      {/* Stand neck */}
      <div className="flex justify-center">
        <div
          style={{
            width: 48,
            height: 24,
            background: "#1e1e28",
            clipPath: "polygon(15% 0%, 85% 0%, 95% 100%, 5% 100%)",
          }}
        />
      </div>

      {/* Stand base */}
      <div className="flex justify-center">
        <div
          style={{
            width: 120,
            height: 8,
            borderRadius: "0 0 8px 8px",
            background: "linear-gradient(180deg, #222230 0%, #1a1a24 100%)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />
      </div>
    </div>
  );
}

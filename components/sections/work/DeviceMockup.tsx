"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

function isVideoSrc(src: string) {
  return /\.(mp4|mov|webm|ogg)$/i.test(src);
}

interface MockupProps {
  src: string | null;
  alt: string;
  isVisible?: boolean;
  /** Optional list of video/image assets to cycle through sequentially (desktop only). */
  srcs?: string[] | null;
}

// ─── Shared icon button base ───────────────────────────────────────────────────────

const ICON_BTN_BASE: CSSProperties = {
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "rgba(255,255,255,0.8)",
  padding: 0,
};

// ─── Mute Toggle Button ───────────────────────────────────────────────────────

function MuteButton({
  isMuted,
  onToggle,
  style,
  size = 26,
  iconSize = 12,
}: {
  isMuted: boolean;
  onToggle: () => void;
  style?: CSSProperties;
  size?: number;
  iconSize?: number;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={isMuted ? "Unmute" : "Mute"}
      style={{ ...ICON_BTN_BASE, width: size, height: size, ...style }}
    >
      {isMuted ? (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}

// ─── Fullscreen Button ─────────────────────────────────────────────────────────────

function FullscreenButton({
  onToggle,
  style,
  size = 26,
  iconSize = 11,
}: {
  onToggle: () => void;
  style?: CSSProperties;
  size?: number;
  iconSize?: number;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label="View fullscreen"
      style={{ ...ICON_BTN_BASE, width: size, height: size, ...style }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    </button>
  );
}

// ─── Fullscreen overlay ────────────────────────────────────────────────────────────

function FullscreenOverlay({
  src,
  alt,
  isMuted,
  onToggleMute,
  onClose,
}: {
  src: string;
  alt: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ background: "rgba(0,0,0,0.9)" }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.86, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.86, opacity: 0, y: 16 }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideoSrc(src) ? (
          <video
            key={src}
            src={src}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            style={{
              maxWidth: "min(92vw, 1400px)",
              maxHeight: "88svh",
              width: "auto",
              height: "auto",
              display: "block",
              borderRadius: 10,
            }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "min(92vw, 1400px)",
              maxHeight: "88svh",
              width: "auto",
              height: "auto",
              display: "block",
              borderRadius: 10,
            }}
          />
        )}

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close fullscreen"
          style={{ ...ICON_BTN_BASE, position: "absolute", top: 10, right: 10, width: 32, height: 32 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Mute in overlay */}
        {isVideoSrc(src) && (
          <MuteButton
            isMuted={isMuted}
            onToggle={onToggleMute}
            size={32}
            iconSize={14}
            style={{ position: "absolute", bottom: 10, right: 10 }}
          />
        )}

        {/* Dismiss hint */}
        <p
          style={{
            position: "absolute",
            bottom: -26,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "monospace",
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          tap outside or press Esc to close
        </p>
      </motion.div>
    </motion.div>
  );
}

export function PhoneMockup({ src, alt, isVisible = true }: MockupProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const toggleMute = () => {
    const next = !isMuted;
    if (videoRef.current) videoRef.current.muted = next;
    setIsMuted(next);
  };

  return (
    <>
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
            {/* Camera hole-punch */}
            <div
              className="absolute z-20"
              style={{
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#000",
              }}
            />

            {/* Screen content */}
            {src ? (
              isVideoSrc(src) ? (
                <motion.video
                  ref={videoRef}
                  src={src}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <motion.img
                  src={src}
                  alt={alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-xs text-white/20">no preview</span>
              </div>
            )}

            {/* Controls */}
            <div className="absolute z-30" style={{ bottom: 22, right: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {src && isVideoSrc(src) && (
                <MuteButton isMuted={isMuted} onToggle={toggleMute} />
              )}
              {src && (
                <FullscreenButton onToggle={() => setShowFullscreen(true)} />
              )}
            </div>

            {/* Screen glare */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
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

      {/* Fullscreen portal */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {showFullscreen && src && (
              <FullscreenOverlay
                src={src}
                alt={alt}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onClose={() => setShowFullscreen(false)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

// ─── Desktop Mockup ───────────────────────────────────────────────────────────

export function DesktopMockup({ src, alt, isVisible = true, srcs }: MockupProps) {
  const multiSrcs = srcs && srcs.length > 1 ? srcs : null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Tracks the native aspect ratio of the current video so the screen
  // frame adapts to show the entire video without cropping.
  const [screenAspect, setScreenAspect] = useState("16/10");

  useEffect(() => { setIsMounted(true); }, []);

  const toggleMute = () => {
    const next = !isMuted;
    if (videoRef.current) videoRef.current.muted = next;
    setIsMuted(next);
  };

  const activeSrc = multiSrcs ? multiSrcs[currentIndex] : src;

  return (
    <>
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

          {/* Screen — aspect ratio adapts to the native video dimensions */}
          <div
            className="relative overflow-hidden bg-black"
            style={{
              borderRadius: 6,
              aspectRatio: screenAspect,
              transition: "aspect-ratio 0.4s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            {activeSrc ? (
              isVideoSrc(activeSrc) ? (
                <motion.video
                  key={multiSrcs ? currentIndex : activeSrc}
                  ref={videoRef}
                  src={activeSrc}
                  autoPlay
                  muted={isMuted}
                  loop={!multiSrcs}
                  playsInline
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="w-full h-full object-contain"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.videoWidth && v.videoHeight) {
                      setScreenAspect(`${v.videoWidth}/${v.videoHeight}`);
                    }
                  }}
                  onEnded={
                    multiSrcs
                      ? () => setCurrentIndex((i) => (i + 1) % multiSrcs.length)
                      : undefined
                  }
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <motion.img
                  src={activeSrc}
                  alt={alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-xs text-white/20">no preview</span>
              </div>
            )}

            {/* Controls */}
            <div className="absolute z-30" style={{ bottom: 8, right: 8, display: "flex", gap: 5 }}>
              {activeSrc && isVideoSrc(activeSrc) && (
                <MuteButton isMuted={isMuted} onToggle={toggleMute} />
              )}
              {activeSrc && (
                <FullscreenButton onToggle={() => setShowFullscreen(true)} />
              )}
            </div>

            {/* Glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
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

      {/* Fullscreen portal */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {showFullscreen && activeSrc && (
              <FullscreenOverlay
                src={activeSrc}
                alt={alt}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onClose={() => setShowFullscreen(false)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

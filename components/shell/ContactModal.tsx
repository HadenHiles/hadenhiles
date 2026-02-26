"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import type { AboutContent } from "@/types/content";
import about from "@/content/about.json";
import { scaleIn, duration } from "@/lib/motion";

export function ContactModal() {
  const { isContactOpen, setContactOpen } = useStore();
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { contact } = about as AboutContent;

  // Focus close button when modal opens
  useEffect(() => {
    if (isContactOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [isContactOpen]);

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setContactOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <AnimatePresence>
      {isContactOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.short }}
            onClick={() => setContactOpen(false)}
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Centering shell — flex so the modal is always exactly centred */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Contact"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: duration.short }}
              className="pointer-events-auto w-full max-w-sm p-6 bg-surface border border-border
                         rounded-modal shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg">Get in touch</h2>
                <button
                  ref={closeRef}
                  onClick={() => setContactOpen(false)}
                  aria-label="Close contact modal"
                  className="text-muted hover:text-text transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Email row */}
              <div className="flex items-center gap-2 p-3 bg-surface2 border border-border rounded-lg mb-3">
                <span className="text-sm text-text flex-1 font-mono truncate">
                  {contact.email}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-medium shrink-0 transition-colors"
                  style={{ color: copied ? "#8A5CFF" : undefined }}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* LinkedIn */}
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-2.5 border border-border
                           rounded-lg text-sm text-muted hover:text-text hover:border-border/60
                           transition-colors mb-2"
              >
                LinkedIn →
              </a>

              {/* GitHub */}
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-2.5 border border-border
                             rounded-lg text-sm text-muted hover:text-text hover:border-border/60
                             transition-colors mb-2"
                >
                  GitHub →
                </a>
              )}

              {/* Resume */}
              <a
                href="/resume.pdf"
                download
                className="flex items-center justify-center w-full py-2.5 border border-border
                           rounded-lg text-sm text-muted hover:text-text hover:border-border/60
                           transition-colors"
              >
                Resume ↓
              </a>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

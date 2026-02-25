"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { AboutContent } from "@/types/content";
import about from "@/content/about.json";
import { ValuePillarCard } from "./ValuePillarCard";
import { duration, ease } from "@/lib/motion";

const DEFAULT_PHOTO = "/images/street-profile-pic.jpg";
const CYCLE_PHOTOS = [
  "/images/what-matters/1.jpg",
  "/images/what-matters/2.jpg",
  "/images/what-matters/3.jpg",
  "/images/what-matters/4.jpg",
  "/images/what-matters/5.jpg",
  "/images/what-matters/6.jpg",
  "/images/what-matters/7.jpg",
  "/images/what-matters/8.jpg",
];
const CYCLE_MS = 260;

export function About() {
  const { pillars } = about as AboutContent;
  const [isHovering, setIsHovering] = useState(false);
  const [cycleIdx, setCycleIdx] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovering) {
      setCycleIdx(0);
      intervalRef.current = setInterval(() => {
        setCycleIdx((p) => (p + 1) % CYCLE_PHOTOS.length);
      }, CYCLE_MS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCycleIdx(-1);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering]);

  return (
    <section aria-label="About" className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-12 lg:gap-20 items-start">
      {/* Left: content */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.medium, ease: ease.standard }}
        >
          <p className="font-mono text-sm text-accent mb-4">about</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
            What Actually Matters
          </h2>
          <p className="text-muted mb-10">
            Three things that shape how I build and why.
          </p>
        </motion.div>
        <div className="space-y-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: duration.short,
                ease: ease.standard,
                delay: i * 0.07,
              }}
            >
              <ValuePillarCard pillar={pillar} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: photo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: duration.medium, ease: ease.standard, delay: 0.15 }}
        className="flex justify-center lg:justify-end lg:sticky lg:top-24"
      >
        <div className="relative">
          {/* Decorative background card */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[28px] bg-surface2 border border-border/40 -rotate-2 scale-[1.03]"
          />
          {/* Photo */}
          <div
            className="relative w-64 sm:w-72 lg:w-80 aspect-[3/4] rounded-[24px] overflow-hidden border border-border/40 cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Default — visible at rest */}
            <motion.div
              animate={{ opacity: cycleIdx === -1 ? 1 : 0 }}
              transition={{ duration: 0.3, ease: ease.standard }}
              className="absolute inset-0"
            >
              <Image
                src={DEFAULT_PHOTO}
                alt="Haden Hiles"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                priority
              />
            </motion.div>

            {/* Cycling photos — pre-loaded, opacity + scale animated */}
            {CYCLE_PHOTOS.map((src, i) => (
              <motion.div
                key={src}
                animate={{
                  opacity: i === cycleIdx ? 1 : 0,
                  scale: i === cycleIdx ? 1 : 1.05,
                }}
                transition={{ duration: 0.14, ease: ease.out }}
                className="absolute inset-0"
              >
                <Image
                  src={src}
                  alt={`Moment ${i + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                />
              </motion.div>
            ))}
          </div>
          {/* Caption badge */}
          <div className="absolute -bottom-4 -right-4 bg-surface border border-border rounded-xl px-4 py-2.5 shadow-lg">
            <p className="font-mono text-xs text-accent">Toronto, ON</p>
            <p className="text-xs text-text font-medium mt-0.5">Always building</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

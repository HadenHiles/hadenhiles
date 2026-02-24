"use client";

import Image from "next/image";
import type { AboutContent } from "@/types/content";
import about from "@/content/about.json";
import { ValuePillarCard } from "./ValuePillarCard";

export function About() {
  const { pillars } = about as AboutContent;

  return (
    <section aria-label="About" className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-12 lg:gap-20 items-start">
      {/* Left: content */}
      <div>
        <p className="font-mono text-sm text-accent mb-4">about</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
          What Actually Matters
        </h2>
        <p className="text-muted mb-10">
          Three things that shape how I build and why.
        </p>
        <div className="space-y-3">
          {pillars.map((pillar) => (
            <ValuePillarCard key={pillar.name} pillar={pillar} />
          ))}
        </div>
      </div>

      {/* Right: photo */}
      <div className="flex justify-center lg:justify-end lg:sticky lg:top-24">
        <div className="relative">
          {/* Decorative background card */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[28px] bg-surface2 border border-border/40 -rotate-2 scale-[1.03]"
          />
          {/* Photo */}
          <div className="relative w-64 sm:w-72 lg:w-80 aspect-[3/4] rounded-[24px] overflow-hidden border border-border/40">
            <Image
              src="/images/street-profile-pic.jpg"
              alt="Haden Hiles walking"
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
            />
          </div>
          {/* Caption badge */}
          <div className="absolute -bottom-4 -right-4 bg-surface border border-border rounded-xl px-4 py-2.5 shadow-lg">
            <p className="font-mono text-xs text-accent">Toronto, ON</p>
            <p className="text-xs text-text font-medium mt-0.5">Always building</p>
          </div>
        </div>
      </div>
    </section>
  );
}

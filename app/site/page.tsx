"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import type { SiteMode } from "@/lib/routes";
import { VALID_SITE_MODES } from "@/lib/routes";
import PortfolioRoot from "@/app/page";

function SitePageInner() {
  const params = useSearchParams();
  const { setMode, selectProject } = useStore();

  useEffect(() => {
    const modeParam = params.get("mode") as SiteMode | null;
    const projectParam = params.get("project");

    const resolvedMode = modeParam && VALID_SITE_MODES.includes(modeParam) ? modeParam : "home";
    setMode(resolvedMode);

    if (projectParam) {
      selectProject(projectParam);
    }

    // Scroll to the target section for direct URL access (e.g. /site?mode=work&project=x).
    // InitialScrollEffect fires with the store's pre-hydration mode and won't re-run,
    // so we handle the scroll here after the store is updated.
    if (resolvedMode !== "home") {
      const sectionId = `section-${resolvedMode}`;
      const timer = setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 450);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PortfolioRoot />;
}

export default function SitePage() {
  return (
    <Suspense fallback={null}>
      <SitePageInner />
    </Suspense>
  );
}

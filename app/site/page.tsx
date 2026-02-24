"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import type { SiteMode } from "@/lib/routes";
import { VALID_SITE_MODES } from "@/lib/routes";
import PortfolioRoot from "@/app/page";

function SitePageInner() {
  const params = useSearchParams();
  const setMode = useStore((s) => s.setMode);

  useEffect(() => {
    const modeParam = params.get("mode") as SiteMode | null;
    if (modeParam && VALID_SITE_MODES.includes(modeParam)) {
      setMode(modeParam);
    } else {
      setMode("work");
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

"use client";

import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { OrchestratedView } from "@/components/orchestrator/OrchestratedView";
import { ScrollIntent } from "@/components/orchestrator/ScrollIntent";

export function SiteShell() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <ScrollIntent>
        <main id="main-content" className="flex-1">
          <OrchestratedView />
        </main>
      </ScrollIntent>
      <Footer />
    </div>
  );
}

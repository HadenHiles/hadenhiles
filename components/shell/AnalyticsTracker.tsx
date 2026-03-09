"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { trackEvent } from "@/lib/analytics";
import projects from "@/content/projects.json";

function getProjectTitle(id: string | null): string {
  if (!id) return "";
  const match = (projects as { id: string; title: string }[]).find((p) => p.id === id);
  return match?.title ?? id;
}

export function AnalyticsTracker() {
  const mode = useStore((s) => s.mode);
  const selectedProjectId = useStore((s) => s.selectedProjectId);
  const isContactOpen = useStore((s) => s.isContactOpen);

  const prevMode = useRef<string | null>(null);
  const prevProjectId = useRef<string | null>(null);

  // Track section views (including initial load)
  useEffect(() => {
    if (mode !== prevMode.current) {
      trackEvent({ name: "section_view", params: { section: mode } });
      prevMode.current = mode;
    }
  }, [mode]);

  // Track project open / close
  useEffect(() => {
    const prev = prevProjectId.current;

    if (selectedProjectId && selectedProjectId !== prev) {
      trackEvent({
        name: "project_view",
        params: {
          project_id: selectedProjectId,
          project_title: getProjectTitle(selectedProjectId),
        },
      });
    }

    if (!selectedProjectId && prev) {
      trackEvent({
        name: "project_close",
        params: {
          project_id: prev,
          project_title: getProjectTitle(prev),
        },
      });
    }

    prevProjectId.current = selectedProjectId;
  }, [selectedProjectId]);

  // Track contact modal open
  useEffect(() => {
    if (isContactOpen) {
      trackEvent({ name: "contact_open" });
    }
  }, [isContactOpen]);

  // Track exit — fires when tab is hidden or browser is closed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const state = useStore.getState();
        trackEvent({
          name: "page_exit",
          params: {
            last_section: state.mode,
            last_project: state.selectedProjectId ?? "",
          },
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null;
}

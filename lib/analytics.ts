declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export type AnalyticsEvent =
  | { name: "section_view";  params: { section: string } }
  | { name: "project_view";  params: { project_id: string; project_title: string } }
  | { name: "project_close"; params: { project_id: string; project_title: string } }
  | { name: "contact_open";  params?: Record<string, never> }
  | { name: "page_exit";     params: { last_section: string; last_project: string } };

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event.name, event.params ?? {});
  }
}

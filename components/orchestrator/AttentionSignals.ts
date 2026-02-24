// Derives attention signals from scroll state.
// Used by sections that adapt their microcopy based on exploration speed.

export function getSubtext(isExploringSlowly: boolean): string {
  return isExploringSlowly
    ? "Full stack engineer with a UX-first mindset. I care about intuitive interfaces, clean architecture, and production systems that stay stable after launch."
    : "Frontend to infrastructure. Designed for clarity. Built for reliability.";
}

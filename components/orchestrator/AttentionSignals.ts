// Derives attention signals from scroll state.
// Used by sections that adapt their microcopy based on exploration speed.

export function getSubtext(isExploringSlowly: boolean): string {
  return isExploringSlowly
    ? "Take your time. Each project has a story."
    : "Scroll to explore, or jump to a section above.";
}

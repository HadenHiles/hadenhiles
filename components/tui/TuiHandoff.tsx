"use client";

interface TuiHandoffProps {
  children: React.ReactNode;
  isTUI: boolean;
}

// Wraps both TUI and GUI. TUI is full-screen; GUI keeps the card surface.
export function TuiHandoff({ children, isTUI }: TuiHandoffProps) {
  return (
    <div
      className={`
        bg-surface w-full
        ${isTUI
          ? "min-h-screen"
          : "min-h-screen rounded-card border border-border"
        }
      `}
      // overflow:hidden creates a scroll container, which breaks position:sticky inside it.
      // overflow:clip clips paint overflow (for rounded corners) WITHOUT creating a scroll container.
      style={{ overflow: "clip" }}
    >
      {children}
    </div>
  );
}

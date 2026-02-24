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
        bg-surface overflow-hidden w-full
        ${isTUI
          ? "min-h-screen"
          : "min-h-screen rounded-card border border-border"
        }
      `}
    >
      {children}
    </div>
  );
}

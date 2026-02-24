// All animation constants. Import from here — never hardcode values in components.

export const duration = {
  micro:  0.22,  // hover states, focus rings
  short:  0.32,  // element entries, menu transitions
  medium: 0.52,  // layout changes, morph handoff
} as const;

// Mechanical easing — no spring, no bounce
export const ease = {
  standard: [0.2, 0.0, 0.0, 1.0] as [number, number, number, number],
  inOut:    [0.2, 0.0, 0.2, 1.0] as [number, number, number, number],
  in:       [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
  out:      [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
} as const;

// Translate distances — small
export const distance = {
  slideY: 10,
  slideX: 12,
  scale:  0.98,
} as const;

// Transition presets
export const transition = {
  micro:  { duration: duration.micro,  ease: ease.standard },
  short:  { duration: duration.short,  ease: ease.standard },
  medium: { duration: duration.medium, ease: ease.inOut },
} as const;

// Reusable variant sets
export const fadeSlideUp = {
  hidden:  { opacity: 0, y: distance.slideY },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -distance.slideY },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: distance.scale },
  visible: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: distance.scale },
};

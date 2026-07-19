import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Shared hard-shadow "neo-brutalist" button treatment used across the whole
// site (marketing CTAs, navbar, pricing, waitlist, 404, dashboards). Keeping
// it in one place (DRY) means the press/scale/shadow effect stays identical
// everywhere and only needs changing here.
export const shadowButton =
  "border-2 border-solid border-foreground shadow-[3px_3px_0px_0px_var(--foreground)] transition-all duration-100 ease-linear hover:scale-[1.06] active:scale-[0.96] active:shadow-[3px_3px_0px_0px_var(--foreground)]"

// Hard-shadow input treatment — same language as the buttons above so the
// waitlist / contact fields feel like part of the same design system.
export const shadowInput =
  "bg-background border-2 border-solid border-foreground text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 transition-all duration-100"

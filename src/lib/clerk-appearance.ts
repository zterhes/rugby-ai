/**
 * Clerk appearance tokens aligned with `globals.css` `@theme` (--color-*).
 * Keeps embedded Clerk UI visually consistent with the rest of ScrumMaster.
 *
 * Uses current Clerk variable names (`colorForeground`, etc.); deprecated
 * `colorText` / `colorInputText` no longer drive all surfaces (e.g. UserButton menu rows).
 */
export const clerkAppearance = {
  variables: {
    borderRadius: "0.5rem", // --radius-lg
    colorPrimary: "#dc2626", // --color-primary-container
    colorDanger: "#cf3030", // --color-destructive
    colorBackground: "#14181f", // --color-background
    colorForeground: "#ffffff", // --color-on-background
    colorMutedForeground: "#8f96a3", // --color-muted-foreground
    colorInput: "#1d222a", // --color-surface
    colorInputForeground: "#ffffff", // --color-on-background
    colorNeutral: "#272c35", // --color-surface-elevated
  },
  elements: {
    userButtonPopoverActionButton: {
      color: "#ffffff",
    },
    userButtonPopoverActionButtonText: {
      color: "#ffffff",
    },
    userButtonPopoverActionButtonIcon: {
      color: "#ffffff",
    },
  },
} as const;

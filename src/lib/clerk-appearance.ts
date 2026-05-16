/**
 * Clerk appearance tokens aligned with `globals.css` `@theme` (--color-*).
 * Keeps embedded Clerk UI visually consistent with the rest of ScrumMaster.
 */
export const clerkAppearance = {
  variables: {
    borderRadius: "0.5rem", // --radius-lg
    colorPrimary: "#dc2626", // --color-primary-container
    colorDanger: "#cf3030", // --color-destructive
    colorBackground: "#14181f", // --color-background
    colorText: "#fbdbd7", // --color-on-background
    colorTextSecondary: "#8f96a3", // --color-muted-foreground
    colorInputBackground: "#1d222a", // --color-surface
    colorInputText: "#fbdbd7", // --color-on-background
    colorNeutral: "#272c35", // --color-surface-elevated
  },
} as const;

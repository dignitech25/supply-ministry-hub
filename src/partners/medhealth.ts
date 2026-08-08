/**
 * PARTNER CONFIG. This is the only block that changes per account.
 *
 * Values below were taken from the partner's live site, not guessed:
 * ink #010A16 and accent #FAB043 are their published brand colours,
 * Raleway is their typeface. Supply Ministry violet stays on every
 * action element so the page reads as our document about them.
 */
export const PARTNER = {
  name: "MedHealth",
  /** Partner logo, served from /public. Swap point for a new account. */
  logo: "/medhealth-logo.png",
  /** Partner brand ink, used for type and thin rules only, never as a heavy fill. */
  ink: "#010A16",
  /** Partner accent, used sparingly as a terminal highlight. */
  accent: "#FAB043",
  /** Soft tint of the accent, for the single tinted band on the page. */
  accentPale: "#FFF6E7",
  /** Hairline rule colour. */
  rule: "rgba(1,10,22,0.12)",
  /** Warm ground the page sits on. */
  ground: "#F4EFE6",
  /** Prepared-for label shown above the partner mark in the masthead. */
  preparedFor: "Prepared for",
  /** Badge shown at the right of the masthead. */
  badge: "Dedicated catalogue, August 2026",
  /** Footer disclaimer. Ownership rule: our document, referencing them. */
  disclaimer:
    "Supply Ministry Pty Ltd, a Dignitech brand. Prepared by Supply Ministry for the MedHealth team, August 2026. This page is unlisted and not indexed. It is not a statement of partnership, endorsement or approval by MedHealth.",
} as const;

/** Supply Ministry identity. Owns every action colour. */
export const HOUSE = {
  violet: "#3D2D9E",
  violetHover: "#2E2178",
  cream: "#F4EFE6",
  cream2: "#FBF8F2",
  ink: "#231F20",
} as const;

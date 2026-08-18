/**
 * PARTNER REGISTRY. This is the only block that changes per account.
 *
 * Each entry holds every partner-specific value the catalogue reads:
 * palette, logo, route base and the copy shown in the masthead and footer.
 * Supply Ministry violet stays on every action element in all accounts, so
 * each page reads as our document referencing the partner.
 */
export interface PartnerConfig {
  /** Registry key, also used to namespace the saved selection. */
  id: string;
  name: string;
  /** Route the catalogue lives on, without a trailing slash. */
  basePath: string;
  /** Partner logo, served from /public. */
  logo: string;
  /** Partner brand ink, used for type and thin rules only, never a heavy fill. */
  ink: string;
  /** Partner accent, used sparingly as a terminal highlight. */
  accent: string;
  /** Soft tint of the accent. */
  accentPale: string;
  /** Hairline rule colour. */
  rule: string;
  /** Warm ground the page sits on. */
  ground: string;
  /** Three partner colours that follow house violet in the brand rule. */
  ruleColors: [string, string, string];
  /** Prepared-for label shown above the partner mark. */
  preparedFor: string;
  /** Footer disclaimer. Ownership rule: our document, referencing them. */
  disclaimer: string;
  /** The IC333 bed package is offered on some accounts only. */
  showBedPackage: boolean;
  /** File stem used for catalogue exports. */
  exportStem: string;
}

/** Supply Ministry identity. Owns every action colour. */
export const HOUSE = {
  violet: "#3D2D9E",
  violetHover: "#2E2178",
  cream: "#F4EFE6",
  cream2: "#FBF8F2",
  ink: "#231F20",
} as const;

export const PARTNERS: Record<string, PartnerConfig> = {
  medhealth: {
    id: "medhealth",
    name: "MedHealth",
    basePath: "/partners/medhealth-capability-2026",
    logo: "/medhealth-logo.png",
    ink: "#010A16",
    accent: "#FAB043",
    accentPale: "#FFF6E7",
    rule: "rgba(1,10,22,0.12)",
    ground: "#F4EFE6",
    // Sampled from the partner's own multicoloured circle mark.
    ruleColors: ["#6895C4", "#EC1C24", "#FCB040"],
    preparedFor: "Prepared for",
    disclaimer:
      "Supply Ministry Pty Ltd, a Dignitech brand. Prepared by Supply Ministry for the MedHealth team.",
    showBedPackage: true,
    exportStem: "medhealth",
  },
  "ability-action": {
    id: "ability-action",
    name: "Ability Action Australia",
    basePath: "/partners/ability-action-catalogue",
    logo: "/ability-action-logo.png",
    // Taken from the partner's live site, not guessed.
    ink: "#001C42",
    accent: "#D70761",
    accentPale: "#FDE9F1",
    rule: "rgba(0,28,66,0.12)",
    ground: "#F4EFE6",
    ruleColors: ["#D70761", "#001C42", "#D70761"],
    preparedFor: "Prepared for",
    disclaimer:
      "Supply Ministry Pty Ltd, a Dignitech brand. Prepared by Supply Ministry for the Ability Action Australia team.",
    showBedPackage: false,
    exportStem: "ability-action",
  },
};

/**
 * The one brand rule used per account: Supply Ministry violet leads, then the
 * partner's own colours. Used for the page top rule and the clinical kits panel
 * so both read as one theme.
 */
export const brandRule = (p: PartnerConfig) =>
  `linear-gradient(90deg, ${HOUSE.violet} 0%, ${HOUSE.violet} 22%, ${p.ruleColors[0]} 48%, ${p.ruleColors[1]} 74%, ${p.ruleColors[2]} 100%)`;

/** Detail page URL for a catalogue product on a given account. */
export const productPath = (p: PartnerConfig, code: string) =>
  `${p.basePath}/product/${encodeURIComponent(code)}`;

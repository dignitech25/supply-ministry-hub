import { createContext, useContext, useMemo } from "react";
import { PARTNERS, brandRule, type PartnerConfig } from "./registry";

interface PartnerTheme {
  partner: PartnerConfig;
  /** Gradient rule for the top of the page and the clinical kits panel. */
  rule: string;
}

const PartnerContext = createContext<PartnerTheme | null>(null);

export function PartnerThemeProvider({
  partner,
  children,
}: {
  partner: keyof typeof PARTNERS | string;
  children: React.ReactNode;
}) {
  const value = useMemo<PartnerTheme>(() => {
    const config = PARTNERS[partner] ?? PARTNERS.medhealth;
    return { partner: config, rule: brandRule(config) };
  }, [partner]);

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error("usePartner must be used inside PartnerThemeProvider");
  return ctx;
}

/**
 * Kept as the stable import point for Supply Ministry's own identity.
 * Partner-specific values now live in src/partners/registry.ts and are read
 * through usePartner() so one catalogue can serve several accounts.
 */
export { HOUSE, PARTNERS, brandRule, productPath, type PartnerConfig } from "./registry";

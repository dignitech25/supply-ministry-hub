import medHealthLogo from "@/assets/medhealth-logo.png.asset.json";

const SUPPLY_MINISTRY_LOGO = "/Supply_Ministry_logo_new_cropped.png";

/** Supply Ministry mark, used on its own in tight spaces such as the footer. */
export function ArcMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src={SUPPLY_MINISTRY_LOGO}
      alt=""
      aria-hidden="true"
      className={`${className} w-auto object-contain object-left`}
    />
  );
}

export function SupplyMinistryLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={SUPPLY_MINISTRY_LOGO}
      alt="Supply Ministry"
      className={`${compact ? "h-7" : "h-10 sm:h-11"} w-auto object-contain object-left`}
    />
  );
}

/** MedHealth wordmark, supplied by the partner. */
export function MedHealthLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={medHealthLogo.url}
      alt="MedHealth"
      className={`inline-block h-[1em] w-auto translate-y-[0.1em] object-contain align-baseline ${className}`}
    />
  );
}

const suppliers = [
  { name: "Aspire", highlighted: true },
  { name: "Forte Healthcare", highlighted: true },
  { name: "Novis", highlighted: true },
  { name: "iCare Medical", highlighted: true },
  { name: "Aidacare", highlighted: false },
  { name: "Drive DeVilbiss", highlighted: false },
];

const SupplierStrip = () => {
  return (
    <section
      id="suppliers"
      className="bg-violet border-t border-white/10"
      style={{ padding: "13px 16px" }}
    >
      <div className="md:px-12 lg:pl-24 flex items-center flex-wrap gap-y-2">
        <span
          className="font-geist uppercase mr-[18px]"
          style={{
            fontSize: "9px",
            fontWeight: 400,
            letterSpacing: "0.16em",
            color: "hsl(var(--cream) / 0.55)",
          }}
        >
          Our suppliers
        </span>
        <span
          className="hidden md:inline-block mr-[18px]"
          style={{ width: "1px", height: "14px", background: "hsl(var(--cream) / 0.2)" }}
        />
        <div className="flex items-center flex-wrap gap-1.5">
          {suppliers.map((s) => (
            <span
              key={s.name}
              className="font-geist transition-colors"
              style={{
                fontSize: "11px",
                fontWeight: s.highlighted ? 400 : 300,
                padding: "3px 10px",
                borderRadius: "2px",
                color: s.highlighted ? "hsl(var(--cream))" : "hsl(var(--cream) / 0.55)",
                border: s.highlighted
                  ? "1px solid hsl(var(--gold) / 0.6)"
                  : "1px solid hsl(var(--cream) / 0.18)",
                background: s.highlighted ? "hsl(var(--gold) / 0.08)" : "transparent",
              }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupplierStrip;
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
      className="bg-cream border-t border-cream-border"
      style={{ padding: "13px 16px" }}
    >
      <div className="md:px-12 lg:pl-24 flex items-center flex-wrap gap-y-2">
        <span
          className="font-geist uppercase mr-[18px]"
          style={{
            fontSize: "9px",
            fontWeight: 400,
            letterSpacing: "0.16em",
            color: "hsl(var(--muted-label))",
          }}
        >
          Our suppliers
        </span>
        <span
          className="hidden md:inline-block mr-[18px]"
          style={{ width: "1px", height: "14px", background: "hsl(var(--cream-border))" }}
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
                color: s.highlighted ? "hsl(var(--violet))" : "hsl(var(--muted-label))",
                border: s.highlighted
                  ? "1px solid hsl(var(--pill-highlight))"
                  : "1px solid hsl(var(--cream-border))",
                background: s.highlighted ? "hsla(249, 56%, 40%, 0.04)" : "transparent",
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
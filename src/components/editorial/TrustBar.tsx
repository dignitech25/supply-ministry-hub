const statements = [
  "OT-referred and clinician-trusted",
  "Aged care and NDIS procurement",
  "48hr quotes, documentation included",
  "Ethical and dedicated AT sourcing",
];

const TrustBar = () => {
  return (
    <section className="bg-violet border-t border-white/10" style={{ padding: "12px 16px" }}>
      <div className="md:px-12 lg:pl-24 flex flex-wrap items-center gap-y-2">
        {statements.map((s, i) => (
          <div key={s} className="flex items-center">
            <span
              className="font-geist uppercase"
              style={{
                fontSize: "9px",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "rgba(244,239,230,0.28)",
              }}
            >
              {s}
            </span>
            {i < statements.length - 1 && (
              <span
                className="mx-3 hidden sm:inline-block"
                style={{
                  width: "2px",
                  height: "2px",
                  borderRadius: "50%",
                  background: "rgba(244,239,230,0.12)",
                }}
              />
            )}
            {i < statements.length - 1 && <span className="sm:hidden mx-3" />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
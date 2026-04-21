import { useState } from "react";

const accents = [
  { id: "a", label: "A", color: "#C8A96E", var: "38 52% 60%" },
  { id: "b", label: "B", color: "#8FBF9F", var: "142 25% 65%" },
  { id: "c", label: "C", color: "#E8C4A8", var: "25 55% 75%" },
];

const AccentSwitcher = () => {
  const [active, setActive] = useState("a");

  const switchAccent = (accent: typeof accents[0]) => {
    document.documentElement.style.setProperty("--gold", accent.var);
    setActive(accent.id);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        background: "white",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          fontFamily: "Geist, sans-serif",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#AAA49A",
        }}
      >
        Accent
      </span>
      <div style={{ display: "flex", gap: "6px" }}>
        {accents.map((a) => (
          <button
            key={a.id}
            onClick={() => switchAccent(a)}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: a.color,
              border: active === a.id ? `2.5px solid ${a.color}` : "2.5px solid transparent",
              outline: active === a.id ? `2px solid ${a.color}` : "none",
              outlineOffset: "2px",
              cursor: "pointer",
              padding: 0,
            }}
            title={`Accent ${a.label}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AccentSwitcher;
interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
  accentColor?: string;
  glowColor?: string;
  icon?: React.ReactNode;
  large?: boolean;
}

export function MetricCard({
  label, value, sub, delta, deltaPositive,
  accentColor = "#7c6fff",
  glowColor = "rgba(124,111,255,0.12)",
  icon,
  large,
}: MetricCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 0 0 transparent, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`;
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 0 transparent, inset 0 1px 0 rgba(255,255,255,0.06)`;
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}
      />

      {/* Icon + Label */}
      <div className="flex items-center justify-between mb-3">
        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </p>
        {icon && (
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: large ? 32 : 26,
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          background: `linear-gradient(135deg, #fff 30%, ${accentColor}cc)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 6,
        }}
      >
        {value}
      </p>

      {/* Sub */}
      {sub && (
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{sub}</p>
      )}

      {/* Delta */}
      {delta && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{
              fontSize: 11,
              fontWeight: 500,
              background: deltaPositive ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
              color: deltaPositive ? "var(--nuvy-green)" : "var(--nuvy-red)",
            }}
          >
            {deltaPositive ? "↑" : "↓"} {delta}
          </span>
        </div>
      )}
    </div>
  );
}

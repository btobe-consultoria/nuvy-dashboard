import { ClienteData } from "../data/mockData";

interface SystemCardProps {
  sistema: string;
  clientes: ClienteData[];
  mes: string;
  color: string;
  glow: string;
}

function fmt(v: number) {
  return "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function SystemCard({ sistema, clientes, mes, color, glow }: SystemCardProps) {
  const comDado = clientes.filter((d) => d.meses[mes]);
  const pagaram = comDado.filter((d) => d.meses[mes].pago);
  const realizado = pagaram.reduce((s, d) => s + d.meses[mes].esperado, 0);
  const custo = pagaram.reduce((s, d) => s + d.custo, 0);
  const lucroReal = realizado - custo;
  const esperado = comDado.reduce((s, d) => s + d.meses[mes].esperado, 0);
  const pct = esperado > 0 ? Math.min(100, Math.round((realizado / esperado) * 100)) : 0;
  const margem = realizado > 0 ? ((lucroReal / realizado) * 100).toFixed(1) : "0.0";

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 32px ${glow}`;
        e.currentTarget.style.borderColor = `${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{sistema}</p>
          <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{clientes.length} clientes</p>
        </div>
        <div className="ml-auto">
          <span
            style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px",
              borderRadius: 20, background: `${color}18`, color,
            }}
          >
            {pagaram.length}/{clientes.length} pagos
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Realizado</span>
          <span style={{ fontSize: 11, fontWeight: 600, color }}>{pct}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Esperado", val: fmt(esperado), valColor: "var(--nuvy-blue)" },
          { label: "Realizado", val: fmt(realizado), valColor: "var(--foreground)" },
          { label: "Lucro real", val: fmt(lucroReal), valColor: "var(--nuvy-green)" },
          { label: "Margem", val: margem + "%", valColor: color },
        ].map((r) => (
          <div
            key={r.label}
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: r.valColor }}>{r.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

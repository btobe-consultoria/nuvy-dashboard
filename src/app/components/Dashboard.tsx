import { useState, type CSSProperties, type ReactNode } from "react";
import { RefreshCw, Settings, Zap, Users } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { SystemCard } from "./SystemCard";
import {
  EsperadoVsRealizadoChart, LucroChart,
  SistemaChart, PlanosChart,
} from "./BillingCharts";
import { ClienteData, SYS_COLOR } from "../data/mockData";

function fmt(v: number) {
  return "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const SYS_GLOW: Record<string, string> = {
  Bitplayer: "rgba(96,165,250,0.15)",
  BrPro: "rgba(52,211,153,0.15)",
  NewsTVS: "rgba(167,139,250,0.15)",
};

interface DashboardProps {
  data: ClienteData[];
  months: string[];
  onOpenConfig: () => void;
  onReload: () => void;
  lastUpdate: string;
}

export function Dashboard({ data, months: MONTHS, onOpenConfig, onReload, lastUpdate }: DashboardProps) {
  const defaultMonth =
    MONTHS.find((m) => data.some((d) => d.meses[m]?.pago)) ?? MONTHS[MONTHS.length - 1];
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const mes = selectedMonth;
  const comDado = data.filter((d) => d.meses[mes]);
  const pagaram = comDado.filter((d) => d.meses[mes].pago);
  const pendente = comDado.filter((d) => !d.meses[mes].pago);

  const totalEsperado = comDado.reduce((s, d) => s + d.meses[mes].esperado, 0);
  const totalRealizado = pagaram.reduce((s, d) => s + d.meses[mes].esperado, 0);
  const totalCusto = pagaram.reduce((s, d) => s + d.custo, 0);
  const lucroReal = totalRealizado - totalCusto;
  const lucroEspMes = comDado.reduce((s, d) => s + (d.meses[mes].esperado - d.custo), 0);
  const pctRealizado = totalEsperado > 0 ? ((totalRealizado / totalEsperado) * 100).toFixed(1) : "0.0";
  const margem = totalRealizado > 0 ? ((lucroReal / totalRealizado) * 100).toFixed(1) : "0.0";
  const pctPendente = data.length > 0 ? ((pendente.length / data.length) * 100).toFixed(0) : "0";

  const sistemas = [...new Set(data.map((d) => d.sistema))].sort();

  const melhorCliente = pagaram.length > 0
    ? pagaram.reduce((a, b) => (b.meses[mes].esperado - b.custo) > (a.meses[mes].esperado - a.custo) ? b : a)
    : null;
  const lucrosSistema = sistemas.map((s) => ({
    s,
    l: data.filter((d) => d.sistema === s && d.meses[mes]?.pago)
      .reduce((sum, d) => sum + d.meses[mes].esperado - d.custo, 0),
  })).sort((a, b) => b.l - a.l);
  const lucrosMes = MONTHS.map((m) => ({
    m,
    l: data.filter((d) => d.meses[m]?.pago).reduce((s, d) => s + d.meses[m].esperado - d.custo, 0),
  })).filter((x) => x.l > 0);
  const melhorMes = lucrosMes.length ? lucrosMes.reduce((a, b) => b.l > a.l ? b : a) : null;

  const insights = [
    melhorCliente && { cor: "#34d399", titulo: "Maior lucro no mês", texto: `${melhorCliente.cliente} (${melhorCliente.sistema}) — ${fmt(melhorCliente.meses[mes].esperado - melhorCliente.custo)}` },
    lucrosSistema.length > 0 && { cor: "#60a5fa", titulo: "Sistema mais rentável", texto: `${lucrosSistema[0].s} com ${fmt(lucrosSistema[0].l)} em ${mes}` },
    { cor: Number(pctPendente) > 20 ? "#f87171" : "#fbbf24", titulo: `Pendentes em ${mes}`, texto: `${pendente.length} de ${data.length} clientes não pagaram ainda (${pctPendente}%)` },
    melhorMes && { cor: "#a78bfa", titulo: "Mês mais lucrativo", texto: `${melhorMes.m} com ${fmt(melhorMes.l)} acumulado` },
  ].filter(Boolean) as { cor: string; titulo: string; texto: string }[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", fontFamily: "'Inter', sans-serif" }}>

      {/* Top header */}
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c6fff, #a78bfa)" }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>
              Nuvy
            </span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)", marginLeft: 4, paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              Faturamento
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
              {lastUpdate}
            </div>
            <button
              onClick={onReload}
              className="flex items-center gap-1.5 rounded-xl cursor-pointer transition-all"
              style={{ padding: "7px 14px", fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--foreground)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <RefreshCw size={13} /> Atualizar
            </button>
            <button
              onClick={onOpenConfig}
              className="flex items-center gap-1.5 rounded-xl cursor-pointer transition-all"
              style={{ padding: "7px 14px", fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--foreground)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <Settings size={13} /> Fonte
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Metric Cards */}
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))" }}>
          <MetricCard label="Clientes ativos" value={String(data.length)} sub={`${sistemas.length} sistemas`} accentColor="#60a5fa" glowColor="rgba(96,165,250,0.15)" icon={<Users size={13} />} />
          <MetricCard label="Esperado/mês" value={fmt(totalEsperado)} sub="base proporcional" accentColor="#7c6fff" glowColor="rgba(124,111,255,0.15)" />
          <MetricCard label="Lucro esperado" value={fmt(lucroEspMes)} sub="mensal proporcional" accentColor="#fbbf24" glowColor="rgba(251,191,36,0.12)" />
          <MetricCard label="Realizado" value={fmt(totalRealizado)} delta={`${pctRealizado}% do esperado`} deltaPositive={Number(pctRealizado) >= 80} accentColor="#34d399" glowColor="rgba(52,211,153,0.15)" />
          <MetricCard label="Lucro real" value={fmt(lucroReal)} delta={`esp. ${fmt(lucroEspMes)}`} deltaPositive={lucroReal >= lucroEspMes} accentColor="#34d399" glowColor="rgba(52,211,153,0.15)" />
          <MetricCard label="Margem real" value={`${margem}%`} sub="lucro / realizado" accentColor="#a78bfa" glowColor="rgba(167,139,250,0.15)" />
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-3 mb-6">
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            Período
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MONTHS.map((m) => {
              const active = m === selectedMonth;
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className="rounded-full cursor-pointer transition-all"
                  style={{
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    padding: "5px 14px",
                    background: active ? "linear-gradient(135deg, #7c6fff, #a78bfa)" : "rgba(255,255,255,0.05)",
                    border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
                    color: active ? "#fff" : "var(--muted-foreground)",
                    boxShadow: active ? "0 0 16px rgba(124,111,255,0.4)" : "none",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <GlassCard title="Esperado vs Realizado">
            <EsperadoVsRealizadoChart data={data} months={MONTHS} selectedMonth={mes} />
          </GlassCard>
          <GlassCard title="Evolução do lucro">
            <LucroChart data={data} months={MONTHS} selectedMonth={mes} />
          </GlassCard>
          <GlassCard title={`Realizado por sistema — ${mes}`}>
            <SistemaChart data={data} selectedMonth={mes} />
          </GlassCard>
          <GlassCard title="Distribuição de planos">
            <PlanosChart data={data} selectedMonth={mes} />
          </GlassCard>
        </div>

        {/* Por sistema */}
        <SectionLabel>Por sistema</SectionLabel>
        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {sistemas.map((s) => (
            <SystemCard key={s} sistema={s} clientes={data.filter((d) => d.sistema === s)} mes={mes} color={SYS_COLOR[s] ?? "#7c6fff"} glow={SYS_GLOW[s] ?? "rgba(124,111,255,0.12)"} />
          ))}
        </div>

        {/* Insights */}
        <SectionLabel>Insights</SectionLabel>
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {insights.map((it, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)`, borderLeft: `3px solid ${it.cor}`, backdropFilter: "blur(12px)" }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: it.cor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{it.titulo}</p>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.5 }}>{it.texto}</p>
            </div>
          ))}
        </div>

        {/* Client Table */}
        <SectionLabel>Clientes</SectionLabel>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Todos os clientes</span>
            <span className="rounded-full px-3 py-1" style={{ fontSize: 11, background: "rgba(124,111,255,0.15)", color: "var(--nuvy-indigo)", fontWeight: 500 }}>
              {data.length} registros
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Sistema", "Cliente", "Plano", "Esperado", "Custo", "Lucro esp.", mes, "Lucro real", "Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => {
                  const dadoMes = d.meses[mes];
                  const esperado = dadoMes?.esperado ?? 0;
                  const pago = dadoMes?.pago ?? false;
                  const lucroRealCliente = pago ? esperado - d.custo : null;
                  const sysColor = SYS_COLOR[d.sistema] ?? "#7c6fff";
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: `${sysColor}18`, color: sysColor, letterSpacing: "0.03em" }}>{d.sistema}</span>
                      </td>
                      <td style={{ padding: "10px 16px", color: "var(--foreground)", fontWeight: 500 }}>{d.cliente}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: "var(--muted-foreground)" }}>{d.plano}</span>
                      </td>
                      <MonoTd>{fmt(esperado)}</MonoTd>
                      <MonoTd color="var(--muted-foreground)">{fmt(d.custo)}</MonoTd>
                      <MonoTd>{fmt(esperado - d.custo)}</MonoTd>
                      <MonoTd color={pago ? "var(--foreground)" : "var(--muted-foreground)"}>{pago ? fmt(esperado) : "—"}</MonoTd>
                      <MonoTd color={lucroRealCliente === null ? "var(--muted-foreground)" : lucroRealCliente >= 0 ? "var(--nuvy-green)" : "var(--nuvy-red)"}>
                        {lucroRealCliente !== null ? fmt(lucroRealCliente) : "—"}
                      </MonoTd>
                      <td style={{ padding: "10px 16px" }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: pago ? "var(--nuvy-green)" : "rgba(255,255,255,0.2)", boxShadow: pago ? "0 0 6px var(--nuvy-green)" : "none" }} />
                          <span style={{ fontSize: 12, color: pago ? "var(--foreground)" : "var(--muted-foreground)" }}>{pago ? "Pago" : "Pendente"}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 14, ...style }}>
      {children}
    </p>
  );
}

function GlassCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  );
}

function MonoTd({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <td style={{ padding: "10px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: color ?? "var(--foreground)" }}>
      {children}
    </td>
  );
}

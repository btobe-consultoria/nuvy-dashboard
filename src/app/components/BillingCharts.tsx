import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { ClienteData } from "../data/mockData";

interface ChartsProps {
  months: string[];
  data: ClienteData[];
  selectedMonth: string;
}

function fmtR(v: number) {
  return "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const TICK = "#4b5563";
const GRID = "rgba(255,255,255,0.04)";

const tooltipStyle = {
  backgroundColor: "#10141f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#eef0f6",
  fontSize: 12,
  fontFamily: "'Inter', sans-serif",
  padding: "8px 12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const PLAN_COLORS = ["#7c6fff", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

export function EsperadoVsRealizadoChart({ data, months: MONTHS }: ChartsProps) {
  const chartData = MONTHS.map((m) => ({
    mes: m.replace("/25", ""),
    Esperado: data.reduce((s, d) => s + (d.meses[m]?.esperado ?? 0), 0),
    Realizado: data.filter((d) => d.meses[m]?.pago).reduce((s, d) => s + d.meses[m].esperado, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} barCategoryGap="35%" barGap={3}>
        <defs>
          <linearGradient id="gradEsp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c6fff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#7c6fff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#34d399" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="mes" tick={{ fill: TICK, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtR} tick={{ fill: TICK, fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtR(v)} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: TICK, paddingTop: 8 }} />
        <Bar dataKey="Esperado" fill="url(#gradEsp)" stroke="#7c6fff" strokeWidth={1} radius={[4,4,0,0]} />
        <Bar dataKey="Realizado" fill="url(#gradReal)" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LucroChart({ data, months: MONTHS }: ChartsProps) {
  const chartData = MONTHS.map((m) => ({
    mes: m.replace("/25", ""),
    Lucro: data.filter((d) => d.meses[m]?.pago).reduce((s, d) => s + d.meses[m].esperado - d.custo, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="gradLucro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="mes" tick={{ fill: TICK, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtR} tick={{ fill: TICK, fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtR(v)} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
        <Area
          type="monotone" dataKey="Lucro" stroke="#34d399" strokeWidth={2.5}
          fill="url(#gradLucro)" dot={{ fill: "#34d399", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#34d399", stroke: "rgba(52,211,153,0.3)", strokeWidth: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SistemaChart({ data, selectedMonth }: ChartsProps) {
  const sistemas = [...new Set(data.map((d) => d.sistema))].sort();
  const SYS_COLORS: Record<string, string> = { Bitplayer: "#60a5fa", BrPro: "#34d399", NewsTVS: "#a78bfa" };

  const chartData = sistemas.map((s) => ({
    sistema: s,
    Realizado: data.filter((d) => d.sistema === s && d.meses[selectedMonth]?.pago)
      .reduce((sum, d) => sum + d.meses[selectedMonth].esperado, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} barCategoryGap="45%">
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="sistema" tick={{ fill: TICK, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtR} tick={{ fill: TICK, fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtR(v)} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="Realizado" radius={[6,6,0,0]}>
          {chartData.map((entry) => (
            <Cell key={entry.sistema} fill={SYS_COLORS[entry.sistema] ?? "#7c6fff"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlanosChart({ data }: ChartsProps) {
  const planosMap: Record<string, number> = {};
  data.forEach((d) => { planosMap[d.plano] = (planosMap[d.plano] ?? 0) + 1; });
  const chartData = Object.entries(planosMap).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <defs>
          {PLAN_COLORS.map((c, i) => (
            <radialGradient key={i} id={`pieGrad${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c} stopOpacity={1} />
              <stop offset="100%" stopColor={c} stopOpacity={0.7} />
            </radialGradient>
          ))}
        </defs>
        <Pie
          data={chartData} dataKey="value" nameKey="name"
          cx="50%" cy="45%" innerRadius={52} outerRadius={76}
          paddingAngle={3}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={`url(#pieGrad${i % PLAN_COLORS.length})`} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, color: TICK, paddingTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

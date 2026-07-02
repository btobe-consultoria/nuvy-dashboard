export type Plano = "mensal" | "trimestral" | "semestral" | "anual";

export interface ClienteData {
  sistema: string;
  cliente: string;
  plano: Plano;
  custo: number;
  meses: Record<string, { esperado: number; pago: boolean }>;
}

export const MONTHS = [
  "Jan/25", "Fev/25", "Mar/25", "Abr/25", "Mai/25", "Jun/25",
];

export const DIVISOR: Record<Plano, number> = {
  mensal: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

export const SYS_COLOR: Record<string, string> = {
  Bitplayer: "var(--nuvy-blue)",
  BrPro: "var(--nuvy-green)",
  NewsTVS: "var(--nuvy-purple)",
};

export const DATA: ClienteData[] = [
  { sistema: "Bitplayer", cliente: "TV Litoral", plano: "mensal", custo: 120,
    meses: { "Jan/25": { esperado: 490, pago: true }, "Fev/25": { esperado: 490, pago: true }, "Mar/25": { esperado: 490, pago: true }, "Abr/25": { esperado: 490, pago: true }, "Mai/25": { esperado: 490, pago: true }, "Jun/25": { esperado: 490, pago: false } } },
  { sistema: "Bitplayer", cliente: "Rádio Atlântico", plano: "mensal", custo: 90,
    meses: { "Jan/25": { esperado: 350, pago: true }, "Fev/25": { esperado: 350, pago: true }, "Mar/25": { esperado: 350, pago: false }, "Abr/25": { esperado: 350, pago: true }, "Mai/25": { esperado: 350, pago: true }, "Jun/25": { esperado: 350, pago: true } } },
  { sistema: "Bitplayer", cliente: "Canal Norte", plano: "trimestral", custo: 80,
    meses: { "Jan/25": { esperado: 900, pago: true }, "Fev/25": { esperado: 0, pago: false }, "Mar/25": { esperado: 0, pago: false }, "Abr/25": { esperado: 900, pago: true }, "Mai/25": { esperado: 0, pago: false }, "Jun/25": { esperado: 0, pago: false } } },
  { sistema: "Bitplayer", cliente: "TV Serra", plano: "mensal", custo: 110,
    meses: { "Jan/25": { esperado: 450, pago: true }, "Fev/25": { esperado: 450, pago: true }, "Mar/25": { esperado: 450, pago: true }, "Abr/25": { esperado: 450, pago: false }, "Mai/25": { esperado: 450, pago: true }, "Jun/25": { esperado: 450, pago: true } } },
  { sistema: "Bitplayer", cliente: "Web TV Carioca", plano: "semestral", custo: 95,
    meses: { "Jan/25": { esperado: 1800, pago: true }, "Fev/25": { esperado: 0, pago: false }, "Mar/25": { esperado: 0, pago: false }, "Abr/25": { esperado: 0, pago: false }, "Mai/25": { esperado: 0, pago: false }, "Jun/25": { esperado: 0, pago: false } } },
  { sistema: "BrPro", cliente: "Grupo Meridional", plano: "mensal", custo: 150,
    meses: { "Jan/25": { esperado: 680, pago: true }, "Fev/25": { esperado: 680, pago: true }, "Mar/25": { esperado: 680, pago: true }, "Abr/25": { esperado: 680, pago: true }, "Mai/25": { esperado: 680, pago: true }, "Jun/25": { esperado: 680, pago: true } } },
  { sistema: "BrPro", cliente: "Portal Sudeste", plano: "mensal", custo: 100,
    meses: { "Jan/25": { esperado: 420, pago: true }, "Fev/25": { esperado: 420, pago: false }, "Mar/25": { esperado: 420, pago: true }, "Abr/25": { esperado: 420, pago: true }, "Mai/25": { esperado: 420, pago: true }, "Jun/25": { esperado: 420, pago: false } } },
  { sistema: "BrPro", cliente: "Mídia Sul", plano: "anual", custo: 200,
    meses: { "Jan/25": { esperado: 4800, pago: true }, "Fev/25": { esperado: 0, pago: false }, "Mar/25": { esperado: 0, pago: false }, "Abr/25": { esperado: 0, pago: false }, "Mai/25": { esperado: 0, pago: false }, "Jun/25": { esperado: 0, pago: false } } },
  { sistema: "BrPro", cliente: "InfoBrasília", plano: "mensal", custo: 85,
    meses: { "Jan/25": { esperado: 320, pago: true }, "Fev/25": { esperado: 320, pago: true }, "Mar/25": { esperado: 320, pago: true }, "Abr/25": { esperado: 320, pago: false }, "Mai/25": { esperado: 320, pago: true }, "Jun/25": { esperado: 320, pago: true } } },
  { sistema: "NewsTVS", cliente: "TV Horizonte", plano: "mensal", custo: 130,
    meses: { "Jan/25": { esperado: 560, pago: true }, "Fev/25": { esperado: 560, pago: true }, "Mar/25": { esperado: 560, pago: false }, "Abr/25": { esperado: 560, pago: true }, "Mai/25": { esperado: 560, pago: true }, "Jun/25": { esperado: 560, pago: true } } },
  { sistema: "NewsTVS", cliente: "Rede Panorama", plano: "trimestral", custo: 160,
    meses: { "Jan/25": { esperado: 1200, pago: true }, "Fev/25": { esperado: 0, pago: false }, "Mar/25": { esperado: 0, pago: false }, "Abr/25": { esperado: 1200, pago: true }, "Mai/25": { esperado: 0, pago: false }, "Jun/25": { esperado: 0, pago: false } } },
  { sistema: "NewsTVS", cliente: "Canal Cultura SP", plano: "mensal", custo: 75,
    meses: { "Jan/25": { esperado: 280, pago: true }, "Fev/25": { esperado: 280, pago: true }, "Mar/25": { esperado: 280, pago: true }, "Abr/25": { esperado: 280, pago: true }, "Mai/25": { esperado: 280, pago: false }, "Jun/25": { esperado: 280, pago: true } } },
  { sistema: "NewsTVS", cliente: "TV Oeste Digital", plano: "mensal", custo: 105,
    meses: { "Jan/25": { esperado: 400, pago: false }, "Fev/25": { esperado: 400, pago: true }, "Mar/25": { esperado: 400, pago: true }, "Abr/25": { esperado: 400, pago: true }, "Mai/25": { esperado: 400, pago: true }, "Jun/25": { esperado: 400, pago: false } } },
];

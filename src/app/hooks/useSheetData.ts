import { useState, useEffect, useCallback } from "react";
import { ClienteData } from "../data/mockData";

const STORAGE_KEY = "nuvy_csv_url";
const DEFAULT_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsL2i3DYRMvSooK4FEByWW65x06a5vKZcFJU2XMKyBjLhznjkgvGv76QQMzq4wTlJBEldtlWnfkVD2/pub?gid=1832138851&single=true&output=csv";

export type Status = "loading" | "ok" | "error";

export interface SheetState {
  data: ClienteData[];
  months: string[];
  status: Status;
  error: string | null;
  lastUpdate: string;
  csvUrl: string;
  reload: () => void;
  setUrl: (url: string) => void;
}

function parseMoeda(v: string | undefined): number {
  if (!v) return 0;
  return parseFloat(v.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".")) || 0;
}

function splitRow(row: string): string[] {
  const result: string[] = [];
  let inQuote = false, cur = "";
  for (const c of row) {
    if (c === '"') { inQuote = !inQuote; }
    else if (c === "," && !inQuote) { result.push(cur.trim()); cur = ""; }
    else { cur += c; }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(text: string): { data: ClienteData[]; months: string[] } {
  const rows = text.trim().split("\n").map(splitRow);
  const headers = rows[1] ?? [];

  const months: string[] = [];
  for (let i = 5; i < headers.length; i += 2) {
    const h = (headers[i] ?? "").trim();
    if (h) months.push(h);
  }

  const data: ClienteData[] = [];

  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    const sistema = (r[0] ?? "").trim();
    if (!sistema || sistema.toLowerCase() === "totais") continue;

    const cliente = (r[1] ?? "").trim();
    const plano = (r[2] ?? "").toLowerCase().trim() as ClienteData["plano"];
    const custo = parseMoeda(r[4]);

    const meses: ClienteData["meses"] = {};
    months.forEach((m, idx) => {
      const colValor = 5 + idx * 2;
      const colReal  = 5 + idx * 2 + 1;
      const esperado = parseMoeda(r[colValor]);
      const realStr  = (r[colReal] ?? "").trim().toUpperCase();
      const pago     = realStr === "OK" || realStr === "SIM";
      meses[m] = { esperado, pago };
    });

    data.push({ sistema, cliente, plano, custo, meses });
  }

  return { data, months };
}

export function useSheetData(): SheetState {
  const [csvUrl, setCsvUrlState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_URL
  );
  const [data, setData] = useState<ClienteData[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("Carregando...");
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  const setUrl = useCallback((url: string) => {
    localStorage.setItem(STORAGE_KEY, url);
    setCsvUrlState(url);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    fetch(csvUrl + "&cachebust=" + Date.now())
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseCSV(text);
        setData(parsed.data);
        setMonths(parsed.months);
        setStatus("ok");
        setLastUpdate("Atualizado às " + new Date().toLocaleTimeString("pt-BR"));
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setStatus("error");
        setError(e.message);
        setLastUpdate("Erro ao carregar");
      });

    return () => { cancelled = true; };
  }, [csvUrl, tick]);

  return { data, months, status, error, lastUpdate, csvUrl, reload, setUrl };
}

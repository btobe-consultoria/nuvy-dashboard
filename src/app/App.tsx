import { useState } from "react";
import { X, Zap, RefreshCw, Loader2 } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { useSheetData } from "./hooks/useSheetData";

export default function App() {
  const sheet = useSheetData();
  const [configOpen, setConfigOpen] = useState(false);
  const [inputValue, setInputValue] = useState(sheet.csvUrl);

  function handleSave() {
    if (!inputValue.trim()) return;
    sheet.setUrl(inputValue.trim());
    setConfigOpen(false);
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* Loading overlay */}
      {sheet.status === "loading" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(10,13,20,0.85)", backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(124,111,255,0.2)", borderTopColor: "#7c6fff", animation: "spin 0.7s linear infinite" }} />
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Carregando dados da planilha...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error state */}
      {sheet.status === "error" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(10,13,20,0.95)", backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <p style={{ fontSize: 15, color: "#f87171", fontWeight: 600 }}>Erro ao carregar dados</p>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{sheet.error}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={sheet.reload} style={btnStyle}>
              <RefreshCw size={13} /> Tentar novamente
            </button>
            <button onClick={() => { setInputValue(sheet.csvUrl); setConfigOpen(true); }} style={btnStyle}>
              <Zap size={13} /> Reconfigurar URL
            </button>
          </div>
        </div>
      )}

      {/* Dashboard (renderiza com dados reais) */}
      {sheet.status === "ok" && sheet.data.length > 0 && (
        <Dashboard
          data={sheet.data}
          months={sheet.months}
          lastUpdate={sheet.lastUpdate}
          onOpenConfig={() => { setInputValue(sheet.csvUrl); setConfigOpen(true); }}
          onReload={sheet.reload}
        />
      )}

      {/* Config modal */}
      {configOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfigOpen(false); }}
        >
          <div className="w-full rounded-3xl p-8" style={{
            maxWidth: 480,
            background: "rgba(16,20,31,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 80px rgba(124,111,255,0.2), 0 32px 64px rgba(0,0,0,0.6)",
            backdropFilter: "blur(24px)",
          }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c6fff, #a78bfa)" }}>
                  <Zap size={14} color="#fff" fill="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--foreground)" }}>Fonte de dados</h2>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Google Sheets CSV</p>
                </div>
              </div>
              <button onClick={() => setConfigOpen(false)} style={{ width: 32, height: 32, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "none", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 20, lineHeight: 1.7 }}>
              Cole a URL de publicação CSV da planilha. Publique em{" "}
              <span style={{ color: "var(--nuvy-indigo)", fontWeight: 500 }}>Arquivo → Compartilhar → Publicar na Web → CSV</span>.
            </p>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="https://docs.google.com/spreadsheets/..."
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "var(--foreground)",
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: "none",
                marginBottom: 14,
              }}
            />

            <button onClick={handleSave} style={{
              width: "100%", padding: 11, borderRadius: 12,
              background: "linear-gradient(135deg, #7c6fff, #a78bfa)",
              border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
              fontFamily: "'Outfit', sans-serif", cursor: "pointer",
              boxShadow: "0 0 24px rgba(124,111,255,0.35)",
            }}>
              Carregar dashboard
            </button>

            <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 14, lineHeight: 1.6, textAlign: "center" }}>
              URL salva localmente. Nenhum dado é enviado a terceiros.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 16px", borderRadius: 10, cursor: "pointer",
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  color: "var(--foreground)", fontSize: 13,
};

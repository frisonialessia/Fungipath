"use client";
import { SPECIES } from "@/lib/species";
import { REGULATIONS } from "@/data/regulations";
import { useI18n, tx } from "@/lib/i18n";

function monthsFor(seasonEn: string): Set<number> {
  const s = seasonEn.toLowerCase();
  const set = new Set<number>();
  const add = (a: number[]) => a.forEach((m) => set.add(m));
  if (s.includes("all year")) { for (let m = 0; m < 12; m++) set.add(m); return set; }
  if (s.includes("spring")) add([2, 3, 4]);
  if (s.includes("summer")) add([5, 6, 7]);
  if (s.includes("autumn") || s.includes("fall")) add([8, 9, 10]);
  if (s.includes("winter")) add([11, 0, 1]);
  if (s.includes("late autumn")) set.delete(8);
  if (s.includes("late summer")) add([7]);
  if (set.size === 0) add([8, 9, 10]);
  return set;
}

export default function Calendar() {
  const { t, locale } = useI18n();
  const now = new Date().getMonth();
  const months = t("calendar.monthsCsv").split(",");
  const rows = SPECIES.map((s) => ({ s, m: monthsFor(tx(s.season, "en")) }));
  const inSeason = rows.filter((r) => r.m.has(now));
  const ordered = [...rows].sort((a, b) => Number(b.m.has(now)) - Number(a.m.has(now)));

  return (
    <div>
      <div className="topbar"><div><h1 className="serif">{t("calendar.title")}</h1><p>{t("calendar.sub")}</p></div></div>

      {/* En temporada ahora */}
      <div className="card" style={{ marginBottom: 15 }}>
        <div className="panel-head"><h3 className="serif">{t("calendar.inSeasonNow")}</h3><span>{months[now]} · {inSeason.length}</span></div>
        {inSeason.length ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {inSeason.map(({ s }) => {
              const danger = s.edib === "deadly" || s.edib === "toxic";
              return <span key={s.n} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--cream-2)", borderRadius: 20, padding: "6px 12px", fontSize: 13 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: danger ? "var(--clay)" : s.cap }} />
                <span style={{ fontStyle: "italic" }}>{s.n}</span>
              </span>;
            })}
          </div>
        ) : <p style={{ color: "var(--stone)", fontSize: 13 }}>{t("calendar.none")}</p>}
      </div>

      {/* Calendario por especie */}
      <div className="card" style={{ marginBottom: 15 }}>
        <div className="panel-head"><h3 className="serif">{t("calendar.calTitle")}</h3><span>{t("calendar.calAside")}</span></div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 560 }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px repeat(12, 1fr)", gap: 3, marginBottom: 6 }}>
              <div />
              {months.map((m, i) => <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: i === now ? "var(--clay)" : "var(--stone)" }}>{m}</div>)}
            </div>
            {ordered.map(({ s, m }) => (
              <div key={s.n} style={{ display: "grid", gridTemplateColumns: "180px repeat(12, 1fr)", gap: 3, alignItems: "center", padding: "3px 0" }}>
                <div style={{ fontSize: 12, fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 8 }}>{s.n}</div>
                {months.map((_, i) => (
                  <div key={i} style={{
                    height: 16, borderRadius: 4,
                    background: m.has(i) ? "var(--terracotta)" : "var(--cream-2)",
                    boxShadow: i === now ? "0 0 0 2px var(--clay)" : "none",
                    opacity: m.has(i) ? 1 : 0.5,
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Normativa */}
      <div className="card">
        <div className="panel-head"><h3 className="serif">{t("calendar.regTitle")}</h3><span>{t("calendar.regAside")}</span></div>
        <div className="grid-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {REGULATIONS.map((r) => (
            <div key={r.id} style={{ background: "var(--cream-2)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.flag} {r.region}</div>
                <span className={`priv-tag ${r.license ? "fuzzy" : "shared"}`}>{r.license ? t("calendar.licenseYes") : t("calendar.licenseNo")}</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 8 }}>
                <span><span style={{ color: "var(--stone)" }}>{t("calendar.quota")}:</span> <b>{r.quota}</b></span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>{tx(r.note, locale)}</div>
              <div style={{ fontSize: 11.5, color: "var(--clay)", marginTop: 8 }}>{t("calendar.protected")}: {r.protected}</div>
            </div>
          ))}
        </div>
        <div className="warn-box"><b>⚠️</b>{t("calendar.disclaimer")}</div>
      </div>
    </div>
  );
}

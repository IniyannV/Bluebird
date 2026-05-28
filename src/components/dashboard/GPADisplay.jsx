import { useEffect, useState } from "react";
import { calcCumulativeGPA, getGPAStats } from "../../utils/gpaCalculator";

function formatGPA(gpa) {
  return gpa === null ? "-" : gpa.toFixed(4);
}

function formatCredits(credits) {
  return credits.toFixed(credits % 1 ? 1 : 0);
}

export default function GPADisplay({ tabs, activeTab }) {
  const gpa = calcCumulativeGPA(tabs);
  const stats = getGPAStats(tabs);
  const activeTabs = activeTab ? [activeTab] : [];
  const activeGPA = calcCumulativeGPA(activeTabs);
  const activeStats = getGPAStats(activeTabs);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 560);
    return () => clearTimeout(timeout);
  }, [gpa, activeGPA]);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-app-border bg-app-surface p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-app-muted">Cumulative Weighted GPA</p>
        <div className={`mt-2 font-mono text-5xl font-bold text-app-accent ${pulse ? "animate-gpa-pulse" : ""}`}>
          {formatGPA(gpa)}
        </div>
        <p className="mt-2 text-sm text-app-muted">
          Based on {formatCredits(stats.credits)} credits across {stats.courses} courses
        </p>
      </div>

      <div className="rounded-lg border border-app-border bg-app-surface p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-app-muted">{activeTab?.name || "Current Grade"} GPA</p>
        <div className={`mt-2 font-mono text-5xl font-bold text-app-accent ${pulse ? "animate-gpa-pulse" : ""}`}>
          {formatGPA(activeGPA)}
        </div>
        <p className="mt-2 text-sm text-app-muted">
          Based on {formatCredits(activeStats.credits)} credits across {activeStats.courses} courses
        </p>
      </div>
    </section>
  );
}

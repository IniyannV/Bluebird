import { useEffect, useState } from "react";
import { calcCumulativeGPA, getGPAStats } from "../../utils/gpaCalculator";

export default function GPADisplay({ tabs }) {
  const gpa = calcCumulativeGPA(tabs);
  const stats = getGPAStats(tabs);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 560);
    return () => clearTimeout(timeout);
  }, [gpa]);

  return (
    <section className="rounded-lg border border-app-border bg-app-surface p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-app-muted">Cumulative Weighted GPA</p>
      <div className={`mt-2 font-mono text-5xl font-bold text-app-accent ${pulse ? "animate-gpa-pulse" : ""}`}>
        {gpa === null ? "-" : gpa.toFixed(2)}
      </div>
      <p className="mt-2 text-sm text-app-muted">
        Based on {stats.credits.toFixed(stats.credits % 1 ? 1 : 0)} credits across {stats.courses} courses
      </p>
    </section>
  );
}

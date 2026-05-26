const columns = [
  ["Course Name", "min-w-64"],
  ["Credits", "w-24"],
  ["Course Level", "w-36"],
  ["MP1 Grade", "w-28"],
  ["MP2 Grade", "w-28"],
  ["S1 Exam", "w-28"],
  ["S1 Average", "w-28"],
  ["MP3 Grade", "w-28"],
  ["MP4 Grade", "w-28"],
  ["S2 Exam", "w-28"],
  ["S2 Average", "w-28"],
  ["Include", "w-24"],
  ["", "w-16"]
];

export default function TableHeader() {
  return (
    <thead className="sticky top-0 z-10 bg-app-bg">
      <tr>
        {columns.map(([label, width]) => (
          <th
            key={label || "actions"}
            className={`${width} border-b border-app-border px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-app-muted`}
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

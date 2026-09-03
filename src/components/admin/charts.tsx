export function LineChart({
  points,
}: {
  points: { label: string; value: number }[];
}) {
  if (points.length === 0) return null;

  const width = 600;
  const height = 220;
  const padding = 32;
  const max = Math.max(1, ...points.map((p) => p.value));

  const coords = points.map((p, i) => {
    const x = padding + (i / Math.max(1, points.length - 1)) * (width - padding * 2);
    const y = height - padding - (p.value / max) * (height - padding * 2);
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1].x},${height - padding} L${coords[0].x},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeOpacity="0.15" />
      <path d={areaPath} fill="url(#lineFill)" className="text-teal-500" />
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth={2} className="text-teal-500" />
      {coords.map((c) => (
        <g key={c.label}>
          <circle cx={c.x} cy={c.y} r={3.5} fill="currentColor" className="text-teal-600" />
          <text x={c.x} y={height - 10} textAnchor="middle" className="fill-slate-400 text-[10px]">
            {c.label}
          </text>
          <text x={c.x} y={c.y - 10} textAnchor="middle" className="fill-slate-500 text-[10px] font-medium">
            {c.value}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; colorClass: string }[];
  centerLabel: string;
  centerValue: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const size = 160;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={16} className="text-slate-100 dark:text-slate-800" />
        {total > 0 &&
          segments.map((s) => {
            const fraction = s.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={16}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetSoFar}
                className={s.colorClass}
                stroke="currentColor"
              />
            );
            offsetSoFar += dash;
            return circle;
          })}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-slate-900 text-xl font-bold dark:fill-slate-50"
        >
          {centerValue}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 16}
          textAnchor="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-slate-500 text-[10px]"
        >
          {centerLabel}
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${s.colorClass.replace("text-", "bg-")}`} />
            <span className="text-slate-600 dark:text-slate-400">{s.label}</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {s.value} {total > 0 ? `(${((s.value / total) * 100).toFixed(1)}%)` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

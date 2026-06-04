"use client";

export default function ArcaneBackground() {
  const cx = 400, cy = 400;
  const g = (a) => `rgba(201,185,154,${a})`;

  // Graduation tick ring
  const ticks = [];
  for (let d = 0; d < 360; d += 5) {
    const rad = (d - 90) * Math.PI / 180;
    const isMajor = d % 30 === 0;
    const isMid = d % 15 === 0;
    const r1 = isMajor ? 338 : isMid ? 350 : 355;
    const r2 = isMajor ? 378 : isMid ? 368 : 363;
    ticks.push(
      <line
        key={d}
        x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
        x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
        stroke={g(isMajor ? 0.16 : isMid ? 0.09 : 0.06)}
        strokeWidth={isMajor ? 1.5 : 0.75}
      />
    );
  }

  // Diamond markers at 12 major positions (every 30°)
  const majorMarkers = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    const mx = cx + 390 * Math.cos(a);
    const my = cy + 390 * Math.sin(a);
    return (
      <rect
        key={i}
        x={mx - 4} y={my - 4} width={8} height={8}
        fill={g(0.14)}
        transform={`rotate(45, ${mx}, ${my})`}
      />
    );
  });

  // Dot ring at r=300 — 24 dots, larger every 4th
  const dotRing = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 - 90) * Math.PI / 180;
    return (
      <circle
        key={i}
        cx={cx + 300 * Math.cos(a)} cy={cy + 300 * Math.sin(a)}
        r={i % 4 === 0 ? 4 : 2}
        fill={g(i % 4 === 0 ? 0.13 : 0.08)}
      />
    );
  });

  // 5 pentagon/pentagram points on r=220 (start from top)
  const pts5 = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * Math.PI / 180;
    return { x: cx + 220 * Math.cos(a), y: cy + 220 * Math.sin(a) };
  });

  const pentPath =
    pts5.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z";

  const starPath =
    `M ${pts5[0].x},${pts5[0].y}` +
    ` L ${pts5[2].x},${pts5[2].y}` +
    ` L ${pts5[4].x},${pts5[4].y}` +
    ` L ${pts5[1].x},${pts5[1].y}` +
    ` L ${pts5[3].x},${pts5[3].y} Z`;

  // Inner spokes from r=68 to r=130 at pentagram angles
  const spokes = pts5.map((_, i) => {
    const a = (i * 72 - 90) * Math.PI / 180;
    return (
      <line
        key={i}
        x1={cx + 68 * Math.cos(a)} y1={cy + 68 * Math.sin(a)}
        x2={cx + 130 * Math.cos(a)} y2={cy + 130 * Math.sin(a)}
        stroke={g(0.09)} strokeWidth={0.75}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 800 800"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "clamp(560px, 78vmin, 840px)",
        height: "clamp(560px, 78vmin, 840px)",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    >
      {/* Outer graduation ring */}
      {ticks}
      {majorMarkers}

      {/* Outer circles */}
      <circle cx={cx} cy={cy} r={362} fill="none" stroke={g(0.07)} strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={328} fill="none" stroke={g(0.06)} strokeWidth={0.5} />

      {/* Dot decoration ring */}
      {dotRing}

      {/* Pentagon */}
      <path d={pentPath} fill="none" stroke={g(0.09)} strokeWidth={0.75} />

      {/* Pentagram star */}
      <path d={starPath} fill={g(0.025)} stroke={g(0.10)} strokeWidth={0.75} />

      {/* Star point circles */}
      {pts5.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={8} fill="none" stroke={g(0.16)} strokeWidth={1} />
      ))}

      {/* Outer pentagram circle */}
      <circle cx={cx} cy={cy} r={220} fill="none" stroke={g(0.07)} strokeWidth={0.5} />

      {/* Inner ring + spokes */}
      <circle cx={cx} cy={cy} r={130} fill="none" stroke={g(0.08)} strokeWidth={0.5} />
      {spokes}
      <circle cx={cx} cy={cy} r={68} fill="none" stroke={g(0.09)} strokeWidth={0.5} />

      {/* Center */}
      <circle cx={cx} cy={cy} r={14} fill="none" stroke={g(0.12)} strokeWidth={0.75} />
      <circle cx={cx} cy={cy} r={5} fill={g(0.18)} />
    </svg>
  );
}

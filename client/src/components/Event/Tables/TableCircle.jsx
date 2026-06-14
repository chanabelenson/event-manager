function seatAngles(n, cx, cy, r) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

export default function TableCircle({
  table,
  occupied,
  isDragOver,
  onDrop,
  onHtmlDragOver,
  onHtmlDragLeave,
  onSeatPointerDown,
  categoryColors,
}) {
  const cap = Number(table.capacity);
  const sR = Math.max(16, Math.min(22, Math.floor(220 / cap)));
  const tR = 65;
  const oR = tR + sR + 10;
  const size = (oR + sR + 16) * 2;
  const cx = size / 2;
  const cy = size / 2;
  const angles = seatAngles(cap, cx, cy, oR);
  const seats = Array(cap).fill(null);
  occupied.forEach((seat, i) => {
    if (i < cap) seats[i] = seat;
  });
  const uid = `t${table.id}`;

  return (
    <div
      className={`t-wrap${isDragOver ? ' t-drag-over' : ''}`}
      data-table-id={table.id}
      onDragOver={(e) => {
        e.preventDefault();
        onHtmlDragOver();
      }}
      onDragLeave={onHtmlDragLeave}
      onDrop={onDrop}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <defs>
          <radialGradient id={`g-${uid}`} cx="38%" cy="32%">
            <stop offset="0%" stopColor="#d4a843" />
            <stop offset="100%" stopColor="#6b4226" />
          </radialGradient>
          <filter id={`s-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={tR}
          fill={`url(#g-${uid})`}
          stroke="#e8c84a"
          strokeWidth="2.5"
          filter={`url(#s-${uid})`}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" className="t-num">
          שולחן {table.table_number}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="t-fill">
          {occupied.length}/{cap}
        </text>

        {angles.map((pos, i) => {
          const seat = seats[i];
          const color = seat ? categoryColors[seat.category] || '#4a6e5a' : null;
          return (
            <g
              key={i}
              style={{ cursor: seat ? 'grab' : 'default' }}
              onPointerDown={seat ? (e) => onSeatPointerDown(e, seat, table.id) : undefined}
            >
              {seat && (
                <title>
                  {seat.name}
                  {seat.category ? ` - ${seat.category}` : ''}
                  {'\nלחץ להחזיר - גרור לשולחן אחר'}
                </title>
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={sR}
                fill={color || 'rgba(255,255,255,0.1)'}
                stroke={seat ? 'rgba(255,220,80,0.75)' : 'rgba(255,255,255,0.18)'}
                strokeWidth={seat ? 2 : 1}
              />
              {seat && (
                <>
                  <text x={pos.x} y={pos.y - 1} textAnchor="middle" className="s-name">
                    {seat.name.slice(0, 5)}
                  </text>
                  {seat.category && (
                    <text x={pos.x} y={pos.y + sR * 0.58} textAnchor="middle" className="s-cat">
                      {seat.category.slice(0, 5)}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

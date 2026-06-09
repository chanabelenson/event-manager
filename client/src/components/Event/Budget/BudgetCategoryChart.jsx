const COLORS = ['#9b72cf', '#e8647a', '#c9a84c', '#3dbfb8', '#5b9bd5', '#f0a04b', '#7ac76b', '#d467a0'];

function buildSlices(items) {
  const map = {};
  items.forEach(item => {
    const cat = item.category || 'ללא קטגוריה';
    map[cat] = (map[cat] || 0) + Number(item.estimated_cost);
  });
  return Object.entries(map).filter(([, v]) => v > 0);
}

function polarToCartesian(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  if (endDeg - startDeg >= 360) endDeg = 359.99;
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

export default function BudgetCategoryChart({ items }) {
  const slices = buildSlices(items);
  if (!slices.length) return null;

  const total = slices.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return null;

  const cx = 100, cy = 100, r = 80;
  let cursor = 0;
  const paths = slices.map(([cat, val], i) => {
    const start = cursor;
    cursor += (val / total) * 360;
    return { cat, val, color: COLORS[i % COLORS.length], d: arcPath(cx, cy, r, start, cursor) };
  });

  return (
    <div className="budget-chart-wrap">
      <h3 className="section-title">התפלגות לפי קטגוריה</h3>
      <div className="budget-chart-inner">
        <svg viewBox="0 0 200 200" className="budget-pie">
          {paths.map(({ d, color, cat }) => (
            <path key={cat} d={d} fill={color} stroke="#fff" strokeWidth="2" />
          ))}
        </svg>
        <ul className="budget-chart-legend">
          {paths.map(({ cat, val, color }) => (
            <li key={cat} className="budget-legend-item">
              <span className="budget-legend-dot" style={{ background: color }} />
              <span className="budget-legend-cat">{cat}</span>
              <span className="budget-legend-val">₪{val.toLocaleString()}</span>
              <span className="budget-legend-pct">({Math.round((val / total) * 100)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

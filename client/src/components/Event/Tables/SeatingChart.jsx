import { useState, useEffect, useMemo } from 'react';
import './SeatingChart.css';

const PALETTE = [
  '#c0392b','#2980b9','#27ae60','#8e44ad',
  '#e67e22','#16a085','#d35400','#1abc9c',
  '#2c3e50','#e91e63',
];

function effectiveCount(guest) {
  return Number(
    guest.status === 'confirmed' && guest.confirmed_count != null
      ? guest.confirmed_count
      : guest.guests_count || 1
  );
}

function initFromGuests(guests) {
  const s = {};
  for (const g of guests) {
    if (g.status !== 'confirmed' || !g.table_id) continue;
    s[g.id] = { [g.table_id]: effectiveCount(g) };
  }
  return s;
}

function initFromArranged(arranged) {
  const s = {};
  for (const t of arranged) {
    for (const g of t.seated_guests) {
      if (!s[g.id]) s[g.id] = {};
      s[g.id][t.id] = (s[g.id][t.id] || 0) + g.effective_count;
    }
  }
  return s;
}

function seatAngles(n, cx, cy, r) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

function TableCircle({ table, occupied, isDragOver, onDrop, onHtmlDragOver, onHtmlDragLeave, onSeatPointerDown, categoryColors }) {
  const cap = Number(table.capacity);
  const sR = Math.max(16, Math.min(22, Math.floor(220 / cap)));
  const tR = 65;
  const oR = tR + sR + 10;
  const size = (oR + sR + 16) * 2;
  const cx = size / 2, cy = size / 2;
  const angles = seatAngles(cap, cx, cy, oR);
  const seats = Array(cap).fill(null);
  occupied.forEach((s, i) => { if (i < cap) seats[i] = s; });
  const uid = `t${table.id}`;

  return (
    <div
      className={`t-wrap${isDragOver ? ' t-drag-over' : ''}`}
      data-table-id={table.id}
      onDragOver={e => { e.preventDefault(); onHtmlDragOver(); }}
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

        <circle cx={cx} cy={cy} r={tR}
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
          const color = seat ? (categoryColors[seat.category] || '#4a6e5a') : null;
          return (
            <g
              key={i}
              style={{ cursor: seat ? 'grab' : 'default' }}
              onPointerDown={seat ? e => onSeatPointerDown(e, seat, table.id) : undefined}
            >
              {seat && <title>{seat.name}{seat.category ? ` · ${seat.category}` : ''}{'\nלחץ להחזיר · גרור לשולחן אחר'}</title>}
              <circle
                cx={pos.x} cy={pos.y} r={sR}
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

export default function SeatingChart({ tables, guests, arrangedTables, savedAssignments, onSave }) {
  const [seatMap, setSeatMap] = useState(() => initFromGuests(guests));
  const [dragGuest, setDragGuest] = useState(null);
  const [tableDrag, setTableDrag] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (arrangedTables) {
      setSeatMap(initFromArranged(arrangedTables));
    }
  }, [arrangedTables]);

  useEffect(() => {
    if (savedAssignments && !arrangedTables) {
      setSeatMap(savedAssignments);
    }
  }, [savedAssignments]);

  // When a table is deleted, remove it from seatMap so its guests return to sidebar
  useEffect(() => {
    const validIds = new Set(tables.map(t => t.id));
    setSeatMap(prev => {
      const updated = {};
      for (const [guestId, byTable] of Object.entries(prev)) {
        const filtered = Object.fromEntries(
          Object.entries(byTable).filter(([tableId]) => validIds.has(Number(tableId)))
        );
        if (Object.keys(filtered).length > 0) updated[guestId] = filtered;
      }
      return updated;
    });
  }, [tables]);

  const categoryColors = useMemo(() => {
    const cats = [...new Set(guests.map(g => g.category).filter(Boolean))];
    const map = {};
    cats.forEach((cat, i) => { map[cat] = PALETTE[i % PALETTE.length]; });
    return map;
  }, [guests]);

  const confirmed = guests.filter(g => g.status === 'confirmed');

  function placedCount(guestId) {
    return Object.values(seatMap[guestId] || {}).reduce((s, n) => s + n, 0);
  }
  function countAtTable(tableId) {
    return confirmed.reduce((s, g) => s + ((seatMap[g.id] || {})[tableId] || 0), 0);
  }
  function getOccupied(tableId) {
    const result = [];
    for (const g of confirmed) {
      const cnt = (seatMap[g.id] || {})[tableId] || 0;
      for (let i = 0; i < cnt; i++) result.push({ guestId: g.id, name: g.guest_name, category: g.category });
    }
    return result;
  }

  const sidebarGuests = confirmed
    .map(g => ({ ...g, remaining: effectiveCount(g) - placedCount(g.id) }))
    .filter(g => g.remaining > 0);

  // ── Sidebar HTML5 drag ──────────────────────────────────────────
  const handleSidebarDrop = (tableId) => {
    if (!dragGuest) { setDragOver(null); return; }
    const tbl = tables.find(t => t.id === tableId);
    if (tbl && countAtTable(tableId) >= Number(tbl.capacity)) {
      alert('השולחן מלא!'); setDragGuest(null); setDragOver(null); return;
    }
    setSeatMap(prev => ({
      ...prev,
      [dragGuest.id]: { ...(prev[dragGuest.id] || {}), [tableId]: ((prev[dragGuest.id] || {})[tableId] || 0) + 1 },
    }));
    setDragGuest(null); setDragOver(null);
  };

  // ── Inter-table pointer drag ────────────────────────────────────
  const handleSeatPointerDown = (e, seat, fromTableId) => {
    e.preventDefault();
    setTableDrag({ guestId: seat.guestId, fromTableId, name: seat.name, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false });
  };

  const handlePointerMove = (e) => {
    if (!tableDrag) return;
    const moved = Math.hypot(e.clientX - tableDrag.startX, e.clientY - tableDrag.startY) > 5;
    setTableDrag(prev => ({ ...prev, x: e.clientX, y: e.clientY, moved: prev.moved || moved }));
    if (moved) {
      let hov = null;
      document.querySelectorAll('[data-table-id]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hov = Number(el.dataset.tableId);
      });
      setDragOver(hov);
    }
  };

  const handlePointerUp = (e) => {
    if (!tableDrag) return;

    if (!tableDrag.moved) {
      // click → remove one seat
      setSeatMap(prev => {
        const m = { ...(prev[tableDrag.guestId] || {}) };
        m[tableDrag.fromTableId] = (m[tableDrag.fromTableId] || 0) - 1;
        if (m[tableDrag.fromTableId] <= 0) delete m[tableDrag.fromTableId];
        return { ...prev, [tableDrag.guestId]: m };
      });
      setTableDrag(null); setDragOver(null);
      return;
    }

    let targetId = null;
    document.querySelectorAll('[data-table-id]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) targetId = Number(el.dataset.tableId);
    });

    if (targetId && targetId !== tableDrag.fromTableId) {
      const tbl = tables.find(t => t.id === targetId);
      if (tbl && countAtTable(targetId) >= Number(tbl.capacity)) {
        alert('השולחן מלא!');
      } else {
        setSeatMap(prev => {
          const m = { ...(prev[tableDrag.guestId] || {}) };
          m[tableDrag.fromTableId] = (m[tableDrag.fromTableId] || 0) - 1;
          if (m[tableDrag.fromTableId] <= 0) delete m[tableDrag.fromTableId];
          m[targetId] = (m[targetId] || 0) + 1;
          return { ...prev, [tableDrag.guestId]: m };
        });
      }
    }
    setTableDrag(null); setDragOver(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const assignments = [];
    for (const [guestId, byTable] of Object.entries(seatMap)) {
      for (const [tableId, count] of Object.entries(byTable)) {
        if (count > 0) assignments.push({ guestId: Number(guestId), tableId: Number(tableId), count });
      }
    }
    await onSave(assignments);
    setSaving(false);
  };

  return (
    <div
      className="sc-root"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="sc-root sc-no-select"
    >
      {tableDrag?.moved && (
        <div className="floating-chip" style={{ left: tableDrag.x, top: tableDrag.y }}>
          {tableDrag.name}
        </div>
      )}

      <div className="sc-save-row">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'שומר...' : '💾 שמור שיבוץ'}
        </button>
      </div>

      <div className="seating-chart">
        <div className="guest-pool">
          <h4 className="pool-title">ממתינים לשיבוץ</h4>
          <p className="pool-hint">גרור לשולחן · כל גרירה = אדם אחד</p>

          {sidebarGuests.length === 0
            ? <p className="pool-empty">כולם שובצו ✓</p>
            : sidebarGuests.map(g => (
              <div
                key={g.id}
                className="guest-chip"
                draggable
                onDragStart={() => setDragGuest(g)}
                onDragEnd={() => setDragGuest(null)}
                style={g.category ? { borderRight: `4px solid ${categoryColors[g.category]}` } : {}}
              >
                <div className="chip-info">
                  <span className="chip-name">{g.guest_name}</span>
                  {g.category && <span className="chip-cat">{g.category}</span>}
                </div>
                <span className="chip-count">{g.remaining}</span>
              </div>
            ))
          }

          {Object.keys(categoryColors).length > 0 && (
            <div className="cat-legend">
              <p className="legend-title">קטגוריות</p>
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="legend-row">
                  <span className="legend-dot" style={{ background: color }} />
                  <span className="legend-label">{cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="floor-plan">
          {tables.map(table => (
            <TableCircle
              key={table.id}
              table={table}
              occupied={getOccupied(table.id)}
              isDragOver={dragOver === table.id}
              categoryColors={categoryColors}
              onDrop={() => handleSidebarDrop(table.id)}
              onHtmlDragOver={() => setDragOver(table.id)}
              onHtmlDragLeave={() => setDragOver(null)}
              onSeatPointerDown={handleSeatPointerDown}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

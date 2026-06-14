import { useState, useMemo } from 'react';
import TableCircle from './TableCircle';
import './SeatingChart.css';

const PALETTE = [
  '#c0392b', '#2980b9', '#27ae60', '#8e44ad',
  '#e67e22', '#16a085', '#d35400', '#1abc9c',
  '#2c3e50', '#e91e63',
];

function effectiveCount(guest) {
  return Number(
    guest.status === 'confirmed' && guest.confirmed_count != null
      ? guest.confirmed_count
      : guest.guests_count || 1
  );
}

function initFromGuests() {
  return {};
}

function initFromArranged(arranged) {
  const seatMap = {};
  for (const table of arranged) {
    for (const guest of table.seated_guests) {
      if (!seatMap[guest.id]) seatMap[guest.id] = {};
      seatMap[guest.id][table.id] = (seatMap[guest.id][table.id] || 0) + guest.effective_count;
    }
  }
  return seatMap;
}

export default function SeatingChart({ tables, guests, arrangedTables, savedAssignments, onSave }) {
  const initialSeatMap = useMemo(() => {
    if (arrangedTables) return initFromArranged(arrangedTables);
    if (savedAssignments) return savedAssignments;
    return initFromGuests();
  }, [arrangedTables, savedAssignments]);

  const resetKey = useMemo(
    () => JSON.stringify({ arrangedTables, savedAssignments }),
    [arrangedTables, savedAssignments]
  );

  return (
    <SeatingChartEditor
      key={resetKey}
      tables={tables}
      guests={guests}
      initialSeatMap={initialSeatMap}
      onSave={onSave}
    />
  );
}

function filterSeatMapForTables(seatMap, tables) {
  const validIds = new Set(tables.map((table) => table.id));
  const filteredSeatMap = {};

  for (const [guestId, byTable] of Object.entries(seatMap)) {
    const filteredTables = Object.fromEntries(
      Object.entries(byTable).filter(([tableId]) => validIds.has(Number(tableId)))
    );
    if (Object.keys(filteredTables).length > 0) filteredSeatMap[guestId] = filteredTables;
  }

  return filteredSeatMap;
}

function SeatingChartEditor({ tables, guests, initialSeatMap, onSave }) {
  const [seatMap, setSeatMap] = useState(() => initialSeatMap);
  const [dragGuest, setDragGuest] = useState(null);
  const [tableDrag, setTableDrag] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [saving, setSaving] = useState(false);
  const activeSeatMap = useMemo(() => filterSeatMapForTables(seatMap, tables), [seatMap, tables]);

  const categoryColors = useMemo(() => {
    const categories = [...new Set(guests.map((guest) => guest.category).filter(Boolean))];
    const map = {};
    categories.forEach((category, i) => {
      map[category] = PALETTE[i % PALETTE.length];
    });
    return map;
  }, [guests]);

  const confirmed = guests.filter((guest) => guest.status === 'confirmed');

 function placedCount(guestId) {
  return Object.values(seatMap[guestId] || {}).reduce((sum, count) => sum + count, 0);
}

function countAtTable(tableId) {
  return confirmed.reduce((sum, guest) => sum + ((seatMap[guest.id] || {})[tableId] || 0), 0);
}
function getOccupied(tableId) {
  const result = [];
  for (const guest of confirmed) {
    const count = (seatMap[guest.id] || {})[tableId] || 0;
    for (let i = 0; i < count; i++) {
      result.push({ guestId: guest.id, name: guest.guest_name, category: guest.category });
    }
  }
  return result;
}

  const sidebarGuests = confirmed
    .map((guest) => ({ ...guest, remaining: effectiveCount(guest) - placedCount(guest.id) }))
    .filter((guest) => guest.remaining > 0);

  const handleSidebarDrop = (tableId) => {
    if (!dragGuest) {
      setDragOver(null);
      return;
    }

    const table = tables.find((item) => item.id === tableId);
    if (table && countAtTable(tableId) >= Number(table.capacity)) {
      alert('השולחן מלא!');
      setDragGuest(null);
      setDragOver(null);
      return;
    }

    setSeatMap((prev) => ({
      ...prev,
      [dragGuest.id]: {
        ...(prev[dragGuest.id] || {}),
        [tableId]: ((prev[dragGuest.id] || {})[tableId] || 0) + 1,
      },
    }));
    setDragGuest(null);
    setDragOver(null);
  };

  const handleSeatPointerDown = (e, seat, fromTableId) => {
    e.preventDefault();
    setTableDrag({
      guestId: seat.guestId,
      fromTableId,
      name: seat.name,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    });
  };

  const handlePointerMove = (e) => {
    if (!tableDrag) return;

    const moved = Math.hypot(e.clientX - tableDrag.startX, e.clientY - tableDrag.startY) > 5;
    setTableDrag((prev) => ({ ...prev, x: e.clientX, y: e.clientY, moved: prev.moved || moved }));

    if (moved) {
      let hoverTableId = null;
      document.querySelectorAll('[data-table-id]').forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          hoverTableId = Number(element.dataset.tableId);
        }
      });
      setDragOver(hoverTableId);
    }
  };

  const handlePointerUp = (e) => {
    if (!tableDrag) return;

    if (!tableDrag.moved) {
      setSeatMap((prev) => {
        const guestTables = { ...(prev[tableDrag.guestId] || {}) };
        guestTables[tableDrag.fromTableId] = (guestTables[tableDrag.fromTableId] || 0) - 1;
        if (guestTables[tableDrag.fromTableId] <= 0) delete guestTables[tableDrag.fromTableId];
        return { ...prev, [tableDrag.guestId]: guestTables };
      });
      setTableDrag(null);
      setDragOver(null);
      return;
    }

    let targetId = null;
    document.querySelectorAll('[data-table-id]').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetId = Number(element.dataset.tableId);
      }
    });

    if (targetId && targetId !== tableDrag.fromTableId) {
      const table = tables.find((item) => item.id === targetId);
      if (table && countAtTable(targetId) >= Number(table.capacity)) {
        alert('השולחן מלא!');
      } else {
        setSeatMap((prev) => {
          const guestTables = { ...(prev[tableDrag.guestId] || {}) };
          guestTables[tableDrag.fromTableId] = (guestTables[tableDrag.fromTableId] || 0) - 1;
          if (guestTables[tableDrag.fromTableId] <= 0) delete guestTables[tableDrag.fromTableId];
          guestTables[targetId] = (guestTables[targetId] || 0) + 1;
          return { ...prev, [tableDrag.guestId]: guestTables };
        });
      }
    }

    setTableDrag(null);
    setDragOver(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const assignments = [];

    for (const [guestId, byTable] of Object.entries(activeSeatMap)) {
      for (const [tableId, count] of Object.entries(byTable)) {
        if (count > 0) assignments.push({ guestId: Number(guestId), tableId: Number(tableId), count });
      }
    }

    await onSave(assignments);
    setSaving(false);
  };

  return (
    <div
      className={`sc-root${tableDrag ? ' sc-dragging' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {tableDrag?.moved && (
        <div className="floating-chip" style={{ left: tableDrag.x, top: tableDrag.y }}>
          {tableDrag.name}
        </div>
      )}

      <div className="sc-save-row">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'שומר...' : 'שמור שיבוץ'}
        </button>
      </div>

      <div className="seating-chart">
        <div className="guest-pool">
          <h4 className="pool-title">ממתינים לשיבוץ</h4>
          <p className="pool-hint">גרור לשולחן - כל גרירה = אדם אחד</p>

          {sidebarGuests.length === 0 ? (
            <p className="pool-empty">כולם שובצו</p>
          ) : (
            sidebarGuests.map((guest) => (
              <div
                key={guest.id}
                className="guest-chip"
                draggable
                onDragStart={() => setDragGuest(guest)}
                onDragEnd={() => setDragGuest(null)}
                style={guest.category ? { borderLeft: `4px solid ${categoryColors[guest.category]}` } : {}}
              >
                <div className="chip-info">
                  <span className="chip-name">{guest.guest_name}</span>
                  {guest.category && <span className="chip-cat">{guest.category}</span>}
                </div>
                <span className="chip-count">{guest.remaining}</span>
              </div>
            ))
          )}

          {Object.keys(categoryColors).length > 0 && (
            <div className="cat-legend">
              <p className="legend-title">קטגוריות</p>
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="legend-row">
                  <span className="legend-dot" style={{ background: color }} />
                  <span className="legend-label">{category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="floor-plan">
          {tables.map((table) => (
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

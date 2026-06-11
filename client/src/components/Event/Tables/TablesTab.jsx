import { useState, useEffect } from 'react';
import { getTables, addTable, deleteTable } from '../../../services/tableService';
import { getGuests, updateGuest, autoArrangeSave, getAssignments } from '../../../services/guestService';
import { autoArrangeSeating } from '../../../utils/seatingArrangement';
import ConfirmModal from '../../Common/ConfirmModal';
import SeatingChart from './SeatingChart';

function effectiveCount(guest) {
  return Number(
    guest.status === 'confirmed' && guest.confirmed_count != null
      ? guest.confirmed_count
      : guest.guests_count || 1
  );
}

export default function TablesTab({ eventId }) {
  const [tables, setTables] = useState([]);
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({ capacity: 10 });
  const [arranging, setArranging] = useState(false);
  const [arrangedTables, setArrangedTables] = useState(null);
  const [savedAssignments, setSavedAssignments] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getTables(eventId).then(setTables).catch(console.error);
    getGuests(eventId).then(setGuests).catch(console.error);
    getAssignments(eventId).then(rows => {
      if (rows.length > 0) {
        const map = {};
        rows.forEach(({ guestId, tableId, count }) => {
          if (!map[guestId]) map[guestId] = {};
          map[guestId][tableId] = count;
        });
        setSavedAssignments(map);
      }
    }).catch(console.error);
  }, [eventId]);

  const nextTableNumber = Math.max(...tables.map(t => t.table_number), 0) + 1;

  const handleAddTable = async (e) => {
    e.preventDefault();
    const { id } = await addTable(eventId, { ...form, table_number: nextTableNumber });
    setTables([...tables, { id, ...form, table_number: nextTableNumber, assigned_guests: 0 }]);
    setForm({ capacity: 10 });
  };

  const handleDeleteTable = async (id) => {
    await deleteTable(eventId, id);
    setTables(tables.filter((t) => t.id !== id));
    setGuests(guests.map((g) => (g.table_id === id ? { ...g, table_id: null } : g)));
    if (arrangedTables) {
      setArrangedTables(arrangedTables.filter((t) => t.id !== id));
    }
    setConfirmDelete(null);
  };

  const handleSave = async (assignments) => {
    await autoArrangeSave(eventId, assignments);
    const primaryByGuest = {};
    assignments.forEach(({ guestId, tableId }) => {
      if (!primaryByGuest[guestId]) primaryByGuest[guestId] = tableId;
    });
    setGuests(guests.map((g) => ({ ...g, table_id: primaryByGuest[g.id] ?? null })));
  };

  const handleAutoArrange = async () => {
    if (!tables.length) return alert('צריך להוסיף שולחנות קודם');
    setArranging(true);
    try {
      const result = autoArrangeSeating(guests, tables);
      const assignments = result.flatMap((t) =>
        t.seated_guests.map((g) => ({ guestId: g.id, tableId: t.id, count: g.effective_count }))
      );
      const primaryByGuest = {};
      assignments.forEach(({ guestId, tableId }) => {
        if (!primaryByGuest[guestId]) primaryByGuest[guestId] = tableId;
      });
      setArrangedTables(result);
      setGuests(
        guests.map((g) => (primaryByGuest[g.id] ? { ...g, table_id: primaryByGuest[g.id] } : g))
      );
      await autoArrangeSave(eventId, assignments);
    } catch (err) {
      console.error(err);
      alert('שגיאה בשמירת הסידור לשרת');
    } finally {
      setArranging(false);
    }
  };

  return (
    <div className="tab-content">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '8px' }}>
        <form className="inline-form" onSubmit={handleAddTable} style={{ margin: 0 }}>
          <span>שולחן מספר {nextTableNumber}</span>
          <input
            type="number"
            placeholder="קיבולת"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
          <button type="submit" className="btn-primary">+ הוסף שולחן</button>
        </form>
        <button className="btn-secondary" onClick={handleAutoArrange} disabled={arranging}>
          {arranging ? 'מסדר...' : '✨ סידור אוטומטי'}
        </button>
        {tables.map((t) => (
          <button
            key={t.id}
            className="btn-ghost"
            style={{ fontSize: '12px', padding: '4px 10px', color: '#c0392b' }}
            onClick={() => setConfirmDelete(t)}
          >
            🗑 שולחן {t.table_number}
          </button>
        ))}
      </div>

      <SeatingChart
        tables={tables}
        arrangedTables={arrangedTables}
        savedAssignments={savedAssignments}
        guests={guests}
        onSave={handleSave}
      />

      {confirmDelete && (
        <ConfirmModal
          title="מחיקת שולחן"
          message={`האם למחוק את שולחן ${confirmDelete.table_number}? כל האורחים ישוחררו מהשולחן.`}
          confirmText="מחק"
          onConfirm={() => handleDeleteTable(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

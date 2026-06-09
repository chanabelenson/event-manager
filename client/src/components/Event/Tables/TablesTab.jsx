import { useState, useEffect } from 'react';
import { getTables, addTable, deleteTable } from '../../../services/tableService';
import { getGuests, updateGuestTable, autoArrangeSave } from '../../../services/guestService';
import { autoArrangeSeating } from '../../../utils/seatingArrangement';
import ConfirmModal from '../../Common/ConfirmModal';

export default function TablesTab({ eventId }) {
  const [tables, setTables] = useState([]);
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({ table_number: '', capacity: 10 });
  const [arranging, setArranging] = useState(false);
  const [arrangedTables, setArrangedTables] = useState(null);
  const [overrideSplit, setOverrideSplit] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getTables(eventId).then(setTables).catch(console.error);
    getGuests(eventId).then(setGuests).catch(console.error);
  }, [eventId]);

  const handleAddTable = async (e) => {
    e.preventDefault();
    const { id } = await addTable(eventId, form);
    setTables([...tables, { id, ...form, assigned_guests: 0 }]);
    setForm({ table_number: '', capacity: 10 });
  };

  const handleDeleteTable = async (id) => {
    await deleteTable(eventId, id);
    setTables(tables.filter((t) => t.id !== id));
    setGuests(guests.map((g) => (g.table_id === id ? { ...g, table_id: null } : g)));
    setConfirmDelete(null);
  };

  const handleAssign = async (guestId, tableId) => {
    await updateGuestTable(eventId, guestId, tableId || null);
    setArrangedTables(null);
    setGuests(guests.map((g) => (g.id === Number(guestId) ? { ...g, table_id: tableId ? Number(tableId) : null } : g)));
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
      assignments.forEach(({ guestId, tableId }) => { if (!primaryByGuest[guestId]) primaryByGuest[guestId] = tableId; });
      setArrangedTables(result);
      setGuests(guests.map((g) => primaryByGuest[g.id] ? { ...g, table_id: primaryByGuest[g.id] } : g));
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
      <form className="inline-form" onSubmit={handleAddTable}>
        <input type="number" placeholder="מספר שולחן" value={form.table_number} onChange={(e) => setForm({ ...form, table_number: e.target.value })} required />
        <input type="number" placeholder="קיבולת" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <button type="submit" className="btn-primary">+ הוסף שולחן</button>
        <button type="button" className="btn-secondary" onClick={handleAutoArrange} disabled={arranging}>
          {arranging ? 'מסדר...' : '✨ סידור אוטומטי'}
        </button>
      </form>

      <div className="tables-grid">
        {tables.map((table) => {
          const arranged = arrangedTables?.find((t) => t.id === table.id);
          const seated = arranged
            ? arranged.seated_guests
            : guests.filter((g) => g.table_id === table.id);
          const totalSeated = arranged
            ? arranged.current_seats
            : seated.reduce((s, g) => s + Number(g.status === 'confirmed' && g.confirmed_count != null ? g.confirmed_count : g.status === 'confirmed' ? g.guests_count : 0), 0);
          return (
            <div key={table.id} className="table-card">
              <div className="table-card-header">
                <span>שולחן {table.table_number}</span>
                <span className="table-capacity">{totalSeated}/{table.capacity}</span>
                <button onClick={() => setConfirmDelete(table)}>🗑️</button>
              </div>
              <ul className="table-guests-list">
                {seated.map((g) => (
                  <li key={`${g.id}-${table.id}`}>
                    {g.guest_name}
                    {arranged && g.effective_count > 0 && <span style={{ color: '#888', marginRight: '4px' }}>({g.effective_count})</span>}
                    {g.category && <span className="guest-category-badge">{g.category}</span>}
                  </li>
                ))}
                {seated.length === 0 && <li className="empty-row">ריק</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <h3 className="section-title">שיבוץ ידני</h3>
      <table className="data-table">
        <thead><tr><th>אורח</th><th>קטגוריה</th><th>אנשים</th><th>שולחן</th></tr></thead>
        <tbody>
          {(() => {
            const splitMap = {};
            if (arrangedTables) {
              arrangedTables.forEach((t) => {
                t.seated_guests.forEach((g) => {
                  if (!splitMap[g.id]) splitMap[g.id] = [];
                  splitMap[g.id].push(t.table_number);
                });
              });
              Object.keys(splitMap).forEach((id) => { if (splitMap[id].length <= 1) delete splitMap[id]; });
            }
            return guests.map((g) => (
              <tr key={g.id}>
                <td>{g.guest_name}</td>
                <td>{g.category || '-'}</td>
                <td>{g.status === 'confirmed' && g.confirmed_count != null ? g.confirmed_count : g.status === 'confirmed' ? g.guests_count : '-'}</td>
                <td>
                  {splitMap[g.id] && !overrideSplit.has(g.id) ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="guest-category-badge" style={{ background: '#fff3cd', color: '#856404' }}>
                        מפוצל (שולחנות {splitMap[g.id].join(', ')})
                      </span>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: '12px', padding: '2px 8px' }}
                        onClick={() => setOverrideSplit((prev) => new Set([...prev, g.id]))}
                      >שנה</button>
                    </span>
                  ) : (
                    <select value={g.table_id || ''} onChange={(e) => handleAssign(g.id, e.target.value)} className="status-select">
                      <option value="">ללא שולחן</option>
                      {tables.map((t) => <option key={t.id} value={t.id}>שולחן {t.table_number}</option>)}
                    </select>
                  )}
                </td>
              </tr>
            ));
          })()}
        </tbody>
      </table>

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

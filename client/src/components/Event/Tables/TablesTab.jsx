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
    setGuests(guests.map((g) => (g.id === Number(guestId) ? { ...g, table_id: tableId ? Number(tableId) : null } : g)));
  };

  const handleAutoArrange = async () => {
    if (!tables.length) return alert('צריך להוסיף שולחנות קודם');
    setArranging(true);
    try {
      const result = autoArrangeSeating(guests, tables);
      const assignments = result.flatMap((t) =>
        t.seated_guests.map((g) => ({ guestId: g.id, tableId: t.id }))
      );
      await autoArrangeSave(eventId, assignments);
      setGuests(guests.map((g) => {
        const found = assignments.find((a) => a.guestId === g.id);
        return found ? { ...g, table_id: found.tableId } : g;
      }));
    } catch (err) {
      console.error(err);
      alert('שגיאה בסידור האוטומטי');
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
          const seated = guests.filter((g) => g.table_id === table.id);
          const totalSeated = seated.reduce((s, g) => s + Number(g.status === 'confirmed' && g.confirmed_count != null ? g.confirmed_count : g.status === 'confirmed' ? g.guests_count : 0), 0);
          return (
            <div key={table.id} className="table-card">
              <div className="table-card-header">
                <span>שולחן {table.table_number}</span>
                <span className="table-capacity">{totalSeated}/{table.capacity}</span>
                <button onClick={() => setConfirmDelete(table)}>🗑️</button>
              </div>
              <ul className="table-guests-list">
                {seated.map((g) => (
                  <li key={g.id}>
                    {g.guest_name}
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
          {guests.map((g) => (
            <tr key={g.id}>
              <td data-label="אורח">{g.guest_name}</td>
              <td data-label="קטגוריה">{g.category || '-'}</td>
              <td data-label="אנשים">{g.status === 'confirmed' && g.confirmed_count != null ? g.confirmed_count : g.status === 'confirmed' ? g.guests_count : '-'}</td>
              <td data-label="שולחן">
                <select value={g.table_id || ''} onChange={(e) => handleAssign(g.id, e.target.value)} className="status-select">
                  <option value="">ללא שולחן</option>
                  {tables.map((t) => <option key={t.id} value={t.id}>שולחן {t.table_number}</option>)}
                </select>
              </td>
            </tr>
          ))}
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

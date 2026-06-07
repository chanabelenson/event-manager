import { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../../../services/taskService';
import ConfirmModal from '../../Common/ConfirmModal';

const EMPTY = { item_name: '', category: '', estimated_cost: '', actual_cost: '', notes: '' };

export default function BudgetTab({ eventId }) {
  const [items, setItems] = useState([]);

  useEffect(() => { getTasks(eventId).then(setItems).catch(console.error); }, [eventId]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // BudgetTab נפרד מ-Tasks - משימות לא מופיעות כאן
  // TODO: יש להוסיף budget API בשרת

  const totalEstimated = items.reduce((s, i) => s + Number(i.estimated_cost), 0);
  const totalActual = items.reduce((s, i) => s + Number(i.actual_cost), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateTask(eventId, editId, form);
      setItems(items.map((i) => (i.id === editId ? { ...i, ...form } : i)));
      setEditId(null);
    } else {
      const { id } = await addTask(eventId, form);
      setItems([...items, { id, ...form, is_completed: false }]);
    }
    setForm(EMPTY);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ task_name: item.task_name, category: item.category || '', estimated_cost: item.estimated_cost, actual_cost: item.actual_cost || '', notes: item.notes || '' });
  };

  const handleDelete = async (id) => {
    await deleteTask(eventId, id);
    setItems(items.filter((i) => i.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="tab-content">
      <div className="budget-summary">
        <div className="budget-summary-item"><span>עלות צפויה</span><strong>₪{totalEstimated.toLocaleString()}</strong></div>
        <div className="budget-summary-item actual"><span>עלות בפועל</span><strong>₪{totalActual.toLocaleString()}</strong></div>
        <div className={`budget-summary-item ${totalActual > totalEstimated ? 'over' : 'under'}`}>
          <span>הפרש</span><strong>₪{Math.abs(totalEstimated - totalActual).toLocaleString()}</strong>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input placeholder="שם פריט" value={form.task_name} onChange={(e) => setForm({ ...form, task_name: e.target.value })} required />
        <input placeholder="קטגוריה" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="number" placeholder="עלות צפויה" value={form.estimated_cost} onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })} />
        <input type="number" placeholder="עלות בפועל" value={form.actual_cost} onChange={(e) => setForm({ ...form, actual_cost: e.target.value })} />
        <input placeholder="הערות" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit" className="btn-primary">{editId ? 'עדכן' : '+ הוסף'}</button>
        {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm(EMPTY); }}>ביטול</button>}
      </form>

      <table className="data-table">
        <thead><tr><th>פריט</th><th>קטגוריה</th><th>צפוי</th><th>בפועל</th><th>הערות</th><th></th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.task_name}</td>
              <td>{item.category || '-'}</td>
              <td>₪{Number(item.estimated_cost).toLocaleString()}</td>
              <td>₪{Number(item.actual_cost || 0).toLocaleString()}</td>
              <td>{item.notes || '-'}</td>
              <td className="row-actions">
                <button onClick={() => startEdit(item)}>✏️</button>
                <button onClick={() => setConfirmDelete(item)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDelete && (
        <ConfirmModal
          title="מחיקת פריט"
          message={`האם למחוק את "${confirmDelete.task_name}"?`}
          confirmText="מחק"
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

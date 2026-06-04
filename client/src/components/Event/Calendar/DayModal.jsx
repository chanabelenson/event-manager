import { useState } from 'react';
import ConfirmModal from '../../Common/ConfirmModal';

function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function DayModal({ date, tasks, onClose, onAdd, onToggle, onDelete }) {
  const [input, setInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const past = isPast(date);

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(date, input.trim());
    setInput('');
  };

  const handleDeleteClick = (task) => {
    setConfirmDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    await onDelete(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card day-modal" onClick={(e) => e.stopPropagation()}>
          <div className="day-modal-header">
            <h3>{formatDate(date)}</h3>
            <button className="btn-ghost" onClick={onClose}>✕</button>
          </div>

          <ul className="task-list">
            {tasks.length === 0 && <li className="empty-row">אין משימות ליום זה</li>}
            {tasks.map((t) => (
              <li key={t.id} className={t.is_completed ? 'done' : ''}>
                <input type="checkbox" checked={!!t.is_completed} onChange={() => onToggle(t.id, t.is_completed)} />
                <span>{t.task_name}</span>
                <button onClick={() => handleDeleteClick(t)}>🗑️</button>
              </li>
            ))}
          </ul>

          {!past && (
            <div className="task-add-row">
              <input
                placeholder="משימה חדשה..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
              />
              <button className="btn-primary" onClick={handleAdd}>+</button>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="אישור מחיקה"
          message={`האם למחוק את "${confirmDelete.task_name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

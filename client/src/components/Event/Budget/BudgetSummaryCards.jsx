import { useState } from 'react';

export default function BudgetSummaryCards({ totalBudget, totalCost, totalPaid, totalUnpaid, remaining, onCeilingUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const isOver = remaining < 0;

  const startEdit = () => {
    setDraft(String(totalBudget));
    setEditing(true);
  };

  const save = async () => {
    const val = parseFloat(draft);
    if (!isNaN(val) && val >= 0) await onCeilingUpdate(val);
    setEditing(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div className="budget-summary">
      <div className="budget-summary-item ceiling">
        <span>תקציב מוגדר</span>
        {editing ? (
          <div className="ceiling-edit">
            <input
              type="number"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKey}
              autoFocus
              min="0"
            />
            <button onClick={save} title="שמור">✓</button>
            <button onClick={() => setEditing(false)} title="ביטול">✗</button>
          </div>
        ) : (
          <strong onClick={startEdit} title="לחץ לעריכה">
            ₪{totalBudget.toLocaleString()} <span className="ceiling-edit-icon">✏️</span>
          </strong>
        )}
      </div>

      <div className="budget-summary-item">
        <span>עלויות צפויות</span>
        <strong>₪{totalCost.toLocaleString()}</strong>
      </div>

      <div className="budget-summary-item actual">
        <span>שולם בפועל</span>
        <strong>₪{totalPaid.toLocaleString()}</strong>
      </div>

      <div className="budget-summary-item">
        <span>נותר לתשלום</span>
        <strong>₪{totalUnpaid.toLocaleString()}</strong>
      </div>

      <div className={`budget-summary-item ${isOver ? 'over' : 'under'}`}>
        <span>{isOver ? 'חריגה מתקציב' : 'יתרה זמינה'}</span>
        <strong>₪{Math.abs(remaining).toLocaleString()}</strong>
        {isOver && <small className="over-alert">⚠️ חרגת מהתקציב!</small>}
      </div>
    </div>
  );
}

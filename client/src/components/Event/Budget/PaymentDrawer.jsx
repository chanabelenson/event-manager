import { useState } from 'react';

const EMPTY = { amount: '', paid_at: '', note: '' };

export default function PaymentDrawer({ item, onAdd, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const payments = item.payments || [];
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const actualCost = Number(item.cost);
  const remaining = actualCost - totalPaid;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (parseFloat(form.amount) > remaining) { setError('סכום התשלום עולה על היתרה'); return; }
    setSaving(true);
    await onAdd(item.id, { ...form, amount: parseFloat(form.amount) });
    setForm(EMPTY);
    setSaving(false);
  };

  return (
    <div className="payment-drawer" onClick={e => e.stopPropagation()}>
      <div className="payment-drawer-summary">
        <span>מחיר: <strong>₪{actualCost.toLocaleString()}</strong></span>
        <span>שולם: <strong className="payment-paid">₪{totalPaid.toLocaleString()}</strong></span>
        <span className={remaining > 0 ? 'payment-remaining' : 'payment-done'}>
          {remaining > 0
            ? `יתרה לתשלום: ₪${remaining.toLocaleString()}`
            : '✓ שולם במלואו'}
        </span>
      </div>

      {payments.length > 0 && (
        <table className="payment-table">
          <thead>
            <tr><th>תאריך</th><th>סכום</th><th>הערה</th><th></th></tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.paid_at).toLocaleDateString('he-IL')}</td>
                <td>₪{Number(p.amount).toLocaleString()}</td>
                <td>{p.note || '-'}</td>
                <td>
                  <button
                    className="payment-delete-btn"
                    onClick={() => onDelete(item.id, p.id)}
                    title="מחק תשלום"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form className="payment-add-form" onSubmit={handleAdd}>
        <input
          type="date"
          value={form.paid_at}
          onChange={e => setForm(f => ({ ...f, paid_at: e.target.value }))}
          required
        />
        <input
          type="number"
          placeholder="סכום ₪"
          value={form.amount}
          onChange={e => { setError(null); setForm(f => ({ ...f, amount: e.target.value })); }}
          required
          min="0.01"
          step="0.01"
        />
        <input
          placeholder="הערה (אופציונלי)"
          value={form.note}
          onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
        />
        <button type="submit" className="btn-primary" disabled={saving}>
          + הוסף תשלום
        </button>
        {error && <span className="form-error">{error}</span>}
      </form>
    </div>
  );
}

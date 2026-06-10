import { useState } from 'react';
import { BUDGET_CATEGORIES } from './budgetCategories';

const EMPTY = { item_name: '', category: '', estimated_cost: '', actual_cost: '', notes: '' };

function resolveCategory(category) {
  if (!category) return { select: '', custom: '' };
  if (BUDGET_CATEGORIES.includes(category)) return { select: category, custom: '' };
  return { select: '__custom__', custom: category };
}

export default function BudgetItemForm({ initial, onSubmit, onCancel }) {
  const resolved = resolveCategory(initial?.category);
  const [form, setForm] = useState(initial
    ? { item_name: initial.item_name, category: resolved.select, estimated_cost: initial.estimated_cost, actual_cost: initial.actual_cost || '', notes: initial.notes || '' }
    : EMPTY
  );
  const [customCat, setCustomCat] = useState(resolved.custom);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const isCustom = form.category === '__custom__';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const finalCategory = isCustom ? customCat : form.category;
    await onSubmit({ ...form, category: finalCategory });
    if (!initial) {
      setForm(EMPTY);
      setCustomCat('');
    }
    setSaving(false);
  };

  return (
    <form className="inline-form budget-item-form" onSubmit={handleSubmit}>
      <input
        placeholder="שם פריט *"
        value={form.item_name}
        onChange={e => set('item_name', e.target.value)}
        required
      />
      <select
        value={form.category}
        onChange={e => set('category', e.target.value)}
        className="budget-cat-select"
      >
        <option value="">-- קטגוריה --</option>
        {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        <option value="__custom__">+ קטגוריה חדשה</option>
      </select>
      {isCustom && (
        <input
          placeholder="שם הקטגוריה"
          value={customCat}
          onChange={e => setCustomCat(e.target.value)}
          required
        />
      )}
      <input
        type="number"
        placeholder="עלות צפויה ₪"
        value={form.estimated_cost}
        onChange={e => set('estimated_cost', e.target.value)}
        min="0"
      />
      <input
        type="number"
        placeholder="מחיר סגור ₪"
        value={form.actual_cost}
        onChange={e => set('actual_cost', e.target.value)}
        min="0"
      />
      <input
        placeholder="הערות"
        value={form.notes}
        onChange={e => set('notes', e.target.value)}
      />
      <button type="submit" className="btn-primary" disabled={saving}>
        {initial ? 'עדכן' : '+ הוסף'}
      </button>
      {onCancel && (
        <button type="button" className="btn-secondary" onClick={onCancel}>ביטול</button>
      )}
    </form>
  );
}

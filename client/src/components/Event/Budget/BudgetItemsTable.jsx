import { Fragment, useState } from 'react';
import PaymentDrawer from './PaymentDrawer';
import ConfirmModal from '../../Common/ConfirmModal';

function itemTotalPaid(item) {
  return (item.payments || []).reduce((s, p) => s + Number(p.amount), 0);
}

export default function BudgetItemsTable({ items, onEdit, onDelete, onAddPayment, onDeletePayment }) {
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const toggleRow = (id) => setExpandedId(prev => (prev === id ? null : id));

  const handleDelete = async () => {
    await onDelete(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>פריט</th>
            <th>קטגוריה</th>
            <th>עלות צפויה</th>
            <th>מחיר סגור</th>
            <th>שולם</th>
            <th>יתרה</th>
            <th>הערות</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!items.length && (
            <tr>
              <td colSpan={8} className="empty-row" style={{ textAlign: 'center', padding: '24px' }}>
                אין פריטים עדיין — הוסף פריט ראשון למעלה
              </td>
            </tr>
          )}
          {items.map(item => {
            const paid      = itemTotalPaid(item);
            const actual    = Number(item.actual_cost);
            const estimated = Number(item.estimated_cost);
            const balance   = actual - paid;
            const isOver    = actual > 0 && actual > estimated;
            const isOpen    = expandedId === item.id;

            return (
              <Fragment key={item.id}>
                <tr
                  className={`budget-row${isOpen ? ' budget-row-open' : ''}`}
                  onClick={() => toggleRow(item.id)}
                  title="לחץ לפתיחת מעקב תשלומים"
                >
                  <td data-label="פריט">{item.item_name}</td>
                  <td data-label="קטגוריה">
                    {item.category
                      ? <span className="category-badge">{item.category}</span>
                      : <span className="text-muted">-</span>}
                  </td>
                  <td data-label="עלות צפויה">₪{estimated.toLocaleString()}</td>
                  <td data-label="מחיר סגור" className={isOver ? 'text-over' : ''}>
                    ₪{actual.toLocaleString()}
                    {isOver && <span className="over-icon" title="חריגה מהצפוי"> ⚠️</span>}
                  </td>
                  <td data-label="שולם">₪{paid.toLocaleString()}</td>
                  <td data-label="יתרה" className={balance > 0 ? 'text-remaining' : 'text-done'}>
                    {balance > 0 ? `₪${balance.toLocaleString()}` : '✓'}
                  </td>
                  <td data-label="הערות">{item.notes || '-'}</td>
                  <td className="row-actions" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onEdit(item)} title="ערוך">✏️</button>
                    <button onClick={() => setConfirmDelete(item)} title="מחק">🗑️</button>
                  </td>
                </tr>

                {isOpen && (
                  <tr className="drawer-row">
                    <td colSpan={8} className="drawer-cell">
                      <PaymentDrawer
                        item={item}
                        onAdd={onAddPayment}
                        onDelete={onDeletePayment}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {confirmDelete && (
        <ConfirmModal
          title="מחיקת פריט"
          message={`האם למחוק את "${confirmDelete.item_name}"?`}
          confirmText="מחק"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

import { useState } from 'react';
import { useBudget } from './useBudget';
import BudgetSummaryCards from './BudgetSummaryCards';
import BudgetCategoryChart from './BudgetCategoryChart';
import BudgetItemForm from './BudgetItemForm';
import BudgetItemsTable from './BudgetItemsTable';
import './Budget.css';

export default function BudgetTab({ eventId }) {
  const budget = useBudget(eventId);
  const [editItem, setEditItem] = useState(null);

  if (budget.loading) return <div className="loading">טוען...</div>;

  const handleEdit = async (form) => {
    await budget.editItem(editItem.id, form);
    setEditItem(null);
  };

  return (
    <div className="tab-content">
      <BudgetSummaryCards
        totalBudget={budget.totalBudget}
        totalEstimated={budget.totalEstimated}
        totalPaid={budget.totalPaid}
        remaining={budget.remaining}
        onCeilingUpdate={budget.updateCeiling}
      />

      {budget.items.length > 0 && (
        <BudgetCategoryChart items={budget.items} />
      )}

      {editItem ? (
        <BudgetItemForm
          key={editItem.id}
          initial={editItem}
          onSubmit={handleEdit}
          onCancel={() => setEditItem(null)}
        />
      ) : (
        <BudgetItemForm onSubmit={budget.createItem} />
      )}

      <BudgetItemsTable
        items={budget.items}
        onEdit={setEditItem}
        onDelete={budget.removeItem}
        onAddPayment={budget.createPayment}
        onDeletePayment={budget.removePayment}
      />
    </div>
  );
}

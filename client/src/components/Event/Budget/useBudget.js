import { useState, useEffect, useCallback } from 'react';
import {
  getBudgetData,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  setBudgetCeiling,
  addPayment,
  deletePayment,
} from '../../../services/budgetService';

export function useBudget(eventId) {
  const [items, setItems] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getBudgetData(eventId);
    setItems(data.items);
    setTotalBudget(Number(data.total_budget));
    setLoading(false);
  }, [eventId]);

  useEffect(() => { load().catch(console.error); }, [load]);

  // ── Derived totals ──
  const totalEstimated = items.reduce((s, i) => s + Number(i.estimated_cost), 0);
  const totalActual    = items.reduce((s, i) => s + Number(i.actual_cost), 0);
  const totalPaid      = items.reduce(
    (s, i) => s + (i.payments || []).reduce((ps, p) => ps + Number(p.amount), 0),
    0
  );
  const remaining = totalBudget - totalEstimated;

  // ── Item CRUD ──
  const createItem = async (form) => {
    const { id } = await addBudgetItem(eventId, form);
    setItems(prev => [...prev, { id, ...form, estimated_cost: Number(form.estimated_cost) || 0, actual_cost: Number(form.actual_cost) || 0, payments: [] }]);
  };

  const editItem = async (itemId, form) => {
    await updateBudgetItem(eventId, itemId, form);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...form, estimated_cost: Number(form.estimated_cost) || 0, actual_cost: Number(form.actual_cost) || 0 } : i));
  };

  const removeItem = async (itemId) => {
    await deleteBudgetItem(eventId, itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // ── Ceiling ──
  const updateCeiling = async (amount) => {
    await setBudgetCeiling(eventId, amount);
    setTotalBudget(Number(amount));
  };

  // ── Payments ──
  const createPayment = async (itemId, paymentData) => {
    const { id } = await addPayment(eventId, itemId, paymentData);
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, payments: [...(i.payments || []), { id, ...paymentData, amount: Number(paymentData.amount) }] }
        : i
    ));
  };

  const removePayment = async (itemId, paymentId) => {
    await deletePayment(eventId, paymentId);
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, payments: (i.payments || []).filter(p => p.id !== paymentId) }
        : i
    ));
  };

  return {
    items, totalBudget, loading,
    totalEstimated, totalActual, totalPaid, remaining,
    createItem, editItem, removeItem,
    updateCeiling,
    createPayment, removePayment,
  };
}

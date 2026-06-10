import * as BudgetItem from '../models/BudgetItem.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function getBudgetData(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const items = await BudgetItem.getBudgetItems(eventId);
  const payments = await BudgetItem.getPaymentsByItems(items.map((i) => i.id));

  const paymentsByItem = {};
  payments.forEach((p) => {
    if (!paymentsByItem[p.budget_item_id]) paymentsByItem[p.budget_item_id] = [];
    paymentsByItem[p.budget_item_id].push(p);
  });

  return {
    total_budget: event.total_budget,
    items: items.map((i) => ({ ...i, payments: paymentsByItem[i.id] || [] })),
  };
}

export async function addBudgetItem(eventId, userId, data) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!data.item_name) throw new AppError('שם פריט חובה', 400);
  const id = await BudgetItem.addBudgetItem(eventId, data);
  return { id };
}

export async function updateBudgetItem(itemId, userId, data) {
  const owned = await BudgetItem.verifyOwnership(itemId, userId);
  if (!owned) throw new AppError('פריט לא נמצא', 404);
  await BudgetItem.updateBudgetItem(itemId, data);
}

export async function deleteBudgetItem(itemId, userId) {
  const owned = await BudgetItem.verifyOwnership(itemId, userId);
  if (!owned) throw new AppError('פריט לא נמצא', 404);
  await BudgetItem.deleteBudgetItem(itemId);
}

export async function updateBudgetCeiling(eventId, userId, total_budget) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  await Event.updateTotalBudget(eventId, userId, total_budget);
}

export async function addPayment(itemId, userId, data) {
  const owned = await BudgetItem.verifyOwnership(itemId, userId);
  if (!owned) throw new AppError('פריט לא נמצא', 404);
  if (!data.amount || Number(data.amount) <= 0) throw new AppError('סכום חובה', 400);
  if (!data.paid_at) throw new AppError('תאריך חובה', 400);
  const id = await BudgetItem.addPayment(itemId, data);
  return { id };
}

export async function deletePayment(paymentId, userId) {
  const owned = await BudgetItem.verifyPaymentOwnership(paymentId, userId);
  if (!owned) throw new AppError('תשלום לא נמצא', 404);
  await BudgetItem.deletePayment(paymentId);
}

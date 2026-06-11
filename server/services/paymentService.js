import * as BudgetItem from '../models/BudgetItem.js';
import { AppError } from '../utils/AppError.js';

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

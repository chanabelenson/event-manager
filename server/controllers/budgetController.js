import * as BudgetService from '../services/budgetService.js';

export const getBudgetData = async (req, res) => {
  const data = await BudgetService.getBudgetData(req.params.eventId, req.user.id);
  res.json(data);
};

export const addBudgetItem = async (req, res) => {
  const { id } = await BudgetService.addBudgetItem(req.params.eventId, req.user.id, req.body);
  res.status(201).json({ id });
};

export const updateBudgetItem = async (req, res) => {
  await BudgetService.updateBudgetItem(req.params.id, req.user.id, req.body);
  res.json({ message: 'עודכן' });
};

export const deleteBudgetItem = async (req, res) => {
  await BudgetService.deleteBudgetItem(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
};

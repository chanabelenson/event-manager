import * as Budget from '../models/Budget.js';

export const getItems = async (req, res) => {
  try {
    const items = await Budget.getBudgetItems(req.params.eventId);
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addItem = async (req, res) => {
  try {
    const id = await Budget.addBudgetItem(req.params.eventId, req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateItem = async (req, res) => {
  try {
    await Budget.updateBudgetItem(req.params.id, req.body);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Budget.deleteBudgetItem(req.params.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

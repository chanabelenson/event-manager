import * as TableService from '../services/tableService.js';

export const getTables = async (req, res) => {
  try {
    const tables = await TableService.getTables(req.params.eventId, req.user.id);
    res.json(tables);
  } catch (err) {
    console.error('getTables error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const addTable = async (req, res) => {
  try {
    const id = await TableService.addTable(req.params.eventId, req.user.id, req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error('addTable error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    await TableService.deleteTable(req.params.id, req.user.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error('deleteTable error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

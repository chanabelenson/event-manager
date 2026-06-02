import * as Table from '../models/Table.js';

export const getTables = async (req, res) => {
  try {
    const tables = await Table.getTables(req.params.eventId);
    res.json(tables);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addTable = async (req, res) => {
  try {
    const id = await Table.addTable(req.params.eventId, req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    await Table.deleteTable(req.params.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

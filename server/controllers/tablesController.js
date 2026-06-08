import * as TableService from '../services/tableService.js';

export const getTables = async (req, res) => {
  const tables = await TableService.getTables(req.params.eventId, req.user.id);
  res.json(tables);
};

export const addTable = async (req, res) => {
  const id = await TableService.addTable(req.params.eventId, req.user.id, req.body);
  res.status(201).json({ id });
};

export const deleteTable = async (req, res) => {
  await TableService.deleteTable(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
};

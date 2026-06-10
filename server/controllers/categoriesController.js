import * as CategoryService from '../services/categoryService.js';

export const getCategories = async (req, res) => {
  const data = await CategoryService.getCategories(req.params.eventId, req.user.id);
  res.json(data);
};

export const addCategory = async (req, res) => {
  const data = await CategoryService.addCategory(req.params.eventId, req.user.id, req.body.category_name);
  res.status(201).json(data);
};

export const deleteCategory = async (req, res) => {
  await CategoryService.deleteCategory(req.params.eventId, req.user.id, req.params.categoryId);
  res.json({ message: 'נמחק' });
};

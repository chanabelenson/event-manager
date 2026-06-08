import { Router } from 'express';
import { getCategories, addCategory, deleteCategory } from '../controllers/categoriesController.js';

const router = Router({ mergeParams: true });

router.get('/', getCategories);
router.post('/', addCategory);
router.delete('/:categoryId', deleteCategory);

export default router;

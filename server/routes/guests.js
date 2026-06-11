import { Router } from 'express';
import { getGuests, addGuest, updateGuest, bulkUpdateTables, deleteGuest } from '../controllers/guestsController.js';
const router = Router({ mergeParams: true });

router.get('/', getGuests);
router.post('/', addGuest);
router.put('/:id', updateGuest);
router.put('/', bulkUpdateTables);
router.delete('/:id', deleteGuest);

export default router;

import { Router } from 'express';
import { getGuests, addGuest, updateStatus, updateTable, bulkUpdateTables, deleteGuest } from '../controllers/guestsController.js';
const router = Router({ mergeParams: true });

router.get('/', getGuests);
router.post('/', addGuest);
router.post('/auto-arrange', bulkUpdateTables);
router.patch('/:id/status', updateStatus);
router.patch('/:id/table', updateTable);
router.delete('/:id', deleteGuest);

export default router;

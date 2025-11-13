import express from 'express';
import {
  createPart,
  getAllParts,
  updatePart,
  deletePart,
  getLowStock,
  addReplacement,
  getReplacementsByMachine
} from '../controllers/sparePartController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllParts);
router.get('/low-stock', getLowStock);
router.post('/', checkRole('Admin', 'Manager'), createPart);
router.put('/:id', checkRole('Admin', 'Manager'), updatePart);
router.delete('/:id', checkRole('Admin'), deletePart);

router.post('/replacements', checkRole('Admin', 'Technician'), addReplacement);
router.get('/replacements/:machineId', getReplacementsByMachine);

export default router;
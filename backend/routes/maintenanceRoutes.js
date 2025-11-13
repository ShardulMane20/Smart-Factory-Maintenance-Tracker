import express from 'express';
import {
  createMaintenance,
  getAllMaintenance,
  updateMaintenance,
  deleteMaintenance
} from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllMaintenance);
router.post('/', checkRole('Admin', 'Manager', 'Technician'), createMaintenance);
router.put('/:id', checkRole('Admin', 'Manager', 'Technician'), updateMaintenance);
router.delete('/:id', checkRole('Admin'), deleteMaintenance);

export default router;
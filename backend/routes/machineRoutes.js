import express from 'express';
import {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
  getMachineStats,
  addReading,
  getMachineReadings,
  predictFailure
} from '../controllers/machineController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/stats', getMachineStats);
router.get('/', getAllMachines);
router.get('/:id', getMachineById);
router.post('/', checkRole('Admin', 'Manager'), createMachine);
router.put('/:id', checkRole('Admin', 'Manager', 'Technician'), updateMachine);
router.delete('/:id', checkRole('Admin'), deleteMachine);

router.post('/:id/readings', checkRole('Admin', 'Technician', 'Operator'), addReading);
router.get('/:id/readings', getMachineReadings);
router.post('/:id/predict', predictFailure);

export default router;
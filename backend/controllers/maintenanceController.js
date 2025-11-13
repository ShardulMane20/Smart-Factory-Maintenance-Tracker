import { Maintenance } from '../models/Maintenance.js';
import { Machine } from '../models/Machine.js';

export const createMaintenance = (req, res) => {
  try {
    const result = Maintenance.create(req.body);
    
    // Update machine's last maintenance date
    if (req.body.status === 'Completed') {
      const machine = Machine.getById(req.body.machine_id);
      Machine.update(req.body.machine_id, {
        ...machine,
        last_maintenance_date: req.body.maintenance_date,
        status: 'OK'
      });
    }

    res.status(201).json({ 
      message: 'Maintenance record created successfully',
      maintenanceId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllMaintenance = (req, res) => {
  try {
    const maintenance = Maintenance.getAll();
    res.json(maintenance);
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMaintenance = (req, res) => {
  try {
    Maintenance.update(req.params.id, req.body);
    res.json({ message: 'Maintenance updated successfully' });
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMaintenance = (req, res) => {
  try {
    Maintenance.delete(req.params.id);
    res.json({ message: 'Maintenance deleted successfully' });
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
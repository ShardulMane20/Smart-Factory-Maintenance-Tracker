import { db } from '../config/db.js';
import { Machine } from '../models/Machine.js';
import { Reading } from '../models/Reading.js';
import { Maintenance } from '../models/Maintenance.js';
import axios from 'axios';

export const createMachine = (req, res) => {
  try {
    const result = Machine.create(req.body);
    res.status(201).json({ 
      message: 'Machine created successfully',
      machineId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllMachines = (req, res) => {
  try {
    const machines = Machine.getAll();
    res.json(machines);
  } catch (error) {
    console.error('Get machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMachineById = (req, res) => {
  try {
    const machine = Machine.getById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Get readings
    const readings = Reading.getByMachineId(req.params.id);
    
    // Get maintenance history
    const maintenanceHistory = Maintenance.getByMachineId(req.params.id);

    res.json({
      ...machine,
      readings,
      maintenanceHistory
    });
  } catch (error) {
    console.error('Get machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMachine = (req, res) => {
  try {
    Machine.update(req.params.id, req.body);
    res.json({ message: 'Machine updated successfully' });
  } catch (error) {
    console.error('Update machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMachine = (req, res) => {
  try {
    Machine.delete(req.params.id);
    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    console.error('Delete machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMachineStats = (req, res) => {
  try {
    const stats = Machine.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addReading = (req, res) => {
  try {
    const { temperature, pressure, vibration, runtime_hours, operator_name, notes } = req.body;
    const machine_id = req.params.id;

    // Check for abnormal values (example thresholds)
    const is_abnormal = temperature > 80 || vibration > 5 ? 1 : 0;

    const readingData = {
      machine_id,
      temperature,
      pressure,
      vibration,
      runtime_hours,
      operator_name,
      is_abnormal,
      notes
    };

    const result = Reading.create(readingData);

    // Update machine's total hours
    const machine = Machine.getById(machine_id);
    Machine.update(machine_id, {
      ...machine,
      total_hours_run: parseFloat(machine.total_hours_run) + parseFloat(runtime_hours)
    });

    res.status(201).json({ 
      message: 'Reading added successfully',
      readingId: result.lastInsertRowid,
      is_abnormal
    });
  } catch (error) {
    console.error('Add reading error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMachineReadings = (req, res) => {
  try {
    const readings = Reading.getByMachineId(req.params.id);
    res.json(readings);
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const predictFailure = async (req, res) => {
  try {
    const machine = Machine.getById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const latestReading = Reading.getLatestByMachineId(req.params.id);
    if (!latestReading) {
      return res.status(404).json({ error: 'No readings available for prediction' });
    }

    // Calculate days since last maintenance
    const lastMaintenance = new Date(machine.last_maintenance_date);
    const today = new Date();
    const daysDiff = Math.floor((today - lastMaintenance) / (1000 * 60 * 60 * 24));

    // Prepare data for ML service
    const predictionData = {
      temperature: latestReading.temperature,
      vibration: latestReading.vibration,
      runtime: machine.total_hours_run,
      maintenance_gap: daysDiff
    };

    // Call Python ML service
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      predictionData
    );

    const { failure_probability, risk_level } = mlResponse.data;

    // Update machine status based on prediction
    if (risk_level === 'High') {
      Machine.updateStatus(req.params.id, 'At Risk');
    }

    // Store prediction in database
    const stmt = db.prepare(
      'INSERT INTO predictions (machine_id, failure_probability, risk_level) VALUES (?, ?, ?)'
    );
    stmt.run(req.params.id, failure_probability, risk_level);

    res.json({
      machine_id: req.params.id,
      failure_probability,
      risk_level,
      predicted_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'ML service unavailable or error occurred' });
  }
};
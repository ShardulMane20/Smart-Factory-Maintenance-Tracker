import { db } from '../config/db.js';

export const Reading = {
  create: (readingData) => {
    const { machine_id, temperature, pressure, vibration, runtime_hours, operator_name, is_abnormal, notes } = readingData;
    const stmt = db.prepare(
      `INSERT INTO readings (machine_id, temperature, pressure, vibration, runtime_hours, operator_name, is_abnormal, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    return stmt.run(machine_id, temperature, pressure, vibration, runtime_hours, operator_name, is_abnormal, notes);
  },

  getByMachineId: (machineId) => {
    const stmt = db.prepare('SELECT * FROM readings WHERE machine_id = ? ORDER BY reading_date DESC');
    return stmt.all(machineId);
  },

  getRecent: (limit = 100) => {
    const stmt = db.prepare('SELECT * FROM readings ORDER BY reading_date DESC LIMIT ?');
    return stmt.all(limit);
  },

  getLatestByMachineId: (machineId) => {
    const stmt = db.prepare('SELECT * FROM readings WHERE machine_id = ? ORDER BY reading_date DESC LIMIT 1');
    return stmt.get(machineId);
  }
};
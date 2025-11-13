import { db } from '../config/db.js';

export const Machine = {
  create: (machineData) => {
    const { name, model, department, last_maintenance_date, frequency_days, frequency_hours } = machineData;
    const stmt = db.prepare(
      `INSERT INTO machines (name, model, department, last_maintenance_date, frequency_days, frequency_hours) 
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    return stmt.run(name, model, department, last_maintenance_date, frequency_days, frequency_hours);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT * FROM machines ORDER BY created_at DESC');
    return stmt.all();
  },

  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM machines WHERE id = ?');
    return stmt.get(id);
  },

  update: (id, machineData) => {
    const { name, model, department, last_maintenance_date, frequency_days, frequency_hours, total_hours_run, status } = machineData;
    const stmt = db.prepare(
      `UPDATE machines 
       SET name = ?, model = ?, department = ?, last_maintenance_date = ?, 
           frequency_days = ?, frequency_hours = ?, total_hours_run = ?, status = ?
       WHERE id = ?`
    );
    return stmt.run(name, model, department, last_maintenance_date, frequency_days, frequency_hours, total_hours_run, status, id);
  },

  updateStatus: (id, status) => {
    const stmt = db.prepare('UPDATE machines SET status = ? WHERE id = ?');
    return stmt.run(status, id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM machines WHERE id = ?');
    return stmt.run(id);
  },

  getStats: () => {
    const total = db.prepare('SELECT COUNT(*) as count FROM machines').get();
    const dueSoon = db.prepare("SELECT COUNT(*) as count FROM machines WHERE status = 'Due Soon'").get();
    const overdue = db.prepare("SELECT COUNT(*) as count FROM machines WHERE status = 'Overdue'").get();
    const atRisk = db.prepare("SELECT COUNT(*) as count FROM machines WHERE status = 'At Risk'").get();
    
    return {
      total: total.count,
      dueSoon: dueSoon.count,
      overdue: overdue.count,
      atRisk: atRisk.count
    };
  }
};
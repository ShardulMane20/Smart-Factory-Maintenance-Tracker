import { db } from '../config/db.js';

export const Maintenance = {
  create: (maintenanceData) => {
    const { machine_id, maintenance_type, performed_by, maintenance_date, next_maintenance_date, notes, status } = maintenanceData;
    const stmt = db.prepare(
      `INSERT INTO maintenance (machine_id, maintenance_type, performed_by, maintenance_date, next_maintenance_date, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    return stmt.run(machine_id, maintenance_type, performed_by, maintenance_date, next_maintenance_date, notes, status);
  },

  getAll: () => {
    const stmt = db.prepare(`
      SELECT m.*, ma.name as machine_name 
      FROM maintenance m 
      LEFT JOIN machines ma ON m.machine_id = ma.id 
      ORDER BY m.maintenance_date DESC
    `);
    return stmt.all();
  },

  getByMachineId: (machineId) => {
    const stmt = db.prepare('SELECT * FROM maintenance WHERE machine_id = ? ORDER BY maintenance_date DESC');
    return stmt.all(machineId);
  },

  update: (id, maintenanceData) => {
    const { maintenance_type, performed_by, maintenance_date, next_maintenance_date, notes, status } = maintenanceData;
    const stmt = db.prepare(
      `UPDATE maintenance 
       SET maintenance_type = ?, performed_by = ?, maintenance_date = ?, next_maintenance_date = ?, notes = ?, status = ?
       WHERE id = ?`
    );
    return stmt.run(maintenance_type, performed_by, maintenance_date, next_maintenance_date, notes, status, id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM maintenance WHERE id = ?');
    return stmt.run(id);
  }
};
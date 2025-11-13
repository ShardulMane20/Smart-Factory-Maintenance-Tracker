import { db } from '../config/db.js';

export const SparePart = {
  create: (partData) => {
    const { part_name, part_number, quantity, min_quantity, location } = partData;
    const stmt = db.prepare(
      `INSERT INTO spare_parts (part_name, part_number, quantity, min_quantity, location) 
       VALUES (?, ?, ?, ?, ?)`
    );
    return stmt.run(part_name, part_number, quantity, min_quantity, location);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT * FROM spare_parts ORDER BY part_name');
    return stmt.all();
  },

  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM spare_parts WHERE id = ?');
    return stmt.get(id);
  },

  update: (id, partData) => {
    const { part_name, part_number, quantity, min_quantity, location } = partData;
    const stmt = db.prepare(
      `UPDATE spare_parts 
       SET part_name = ?, part_number = ?, quantity = ?, min_quantity = ?, location = ?
       WHERE id = ?`
    );
    return stmt.run(part_name, part_number, quantity, min_quantity, location, id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM spare_parts WHERE id = ?');
    return stmt.run(id);
  },

  getLowStock: () => {
    const stmt = db.prepare('SELECT * FROM spare_parts WHERE quantity <= min_quantity');
    return stmt.all();
  },

  // Part replacements
  addReplacement: (replacementData) => {
    const { machine_id, part_id, quantity_used, replaced_by, notes } = replacementData;
    const stmt = db.prepare(
      `INSERT INTO part_replacements (machine_id, part_id, quantity_used, replaced_by, notes) 
       VALUES (?, ?, ?, ?, ?)`
    );
    const result = stmt.run(machine_id, part_id, quantity_used, replaced_by, notes);
    
    // Update inventory
    const updateStmt = db.prepare('UPDATE spare_parts SET quantity = quantity - ? WHERE id = ?');
    updateStmt.run(quantity_used, part_id);
    
    return result;
  },

  getReplacementsByMachine: (machineId) => {
    const stmt = db.prepare(`
      SELECT pr.*, sp.part_name, sp.part_number 
      FROM part_replacements pr 
      LEFT JOIN spare_parts sp ON pr.part_id = sp.id 
      WHERE pr.machine_id = ? 
      ORDER BY pr.replacement_date DESC
    `);
    return stmt.all(machineId);
  }
};
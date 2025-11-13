import { db } from '../config/db.js';

export const User = {
  create: (username, email, hashedPassword, role) => {
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
    );
    return stmt.run(username, email, hashedPassword, role);
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT id, username, email, role, created_at FROM users');
    return stmt.all();
  },

  update: (id, username, email, role) => {
    const stmt = db.prepare(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?'
    );
    return stmt.run(username, email, role, id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
};
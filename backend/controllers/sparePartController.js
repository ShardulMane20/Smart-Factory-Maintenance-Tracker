import { SparePart } from '../models/SparePart.js';

export const createPart = (req, res) => {
  try {
    const result = SparePart.create(req.body);
    res.status(201).json({ 
      message: 'Spare part created successfully',
      partId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create part error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllParts = (req, res) => {
  try {
    const parts = SparePart.getAll();
    res.json(parts);
  } catch (error) {
    console.error('Get parts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePart = (req, res) => {
  try {
    SparePart.update(req.params.id, req.body);
    res.json({ message: 'Spare part updated successfully' });
  } catch (error) {
    console.error('Update part error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePart = (req, res) => {
  try {
    SparePart.delete(req.params.id);
    res.json({ message: 'Spare part deleted successfully' });
  } catch (error) {
    console.error('Delete part error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLowStock = (req, res) => {
  try {
    const lowStockParts = SparePart.getLowStock();
    res.json(lowStockParts);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addReplacement = (req, res) => {
  try {
    const result = SparePart.addReplacement(req.body);
    res.status(201).json({ 
      message: 'Part replacement recorded successfully',
      replacementId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Add replacement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReplacementsByMachine = (req, res) => {
  try {
    const replacements = SparePart.getReplacementsByMachine(req.params.machineId);
    res.json(replacements);
  } catch (error) {
    console.error('Get replacements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
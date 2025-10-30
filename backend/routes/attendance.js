const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Get all attendance records
router.get('/', (req, res) => {
  console.log('📥 Fetching attendance records...');
  
  const sql = 'SELECT * FROM attendance ORDER BY date DESC, created_at DESC';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database error:', err.message);
      return res.status(500).json({ error: 'Cannot read from database' });
    }
    
    console.log(`✅ Found ${results.length} records`);
    res.json(results);
  });
});

// POST - Add new attendance record
router.post('/', (req, res) => {
  const { employeeName, employeeID, date, status } = req.body;
  
  console.log('💾 Saving record:', { employeeName, employeeID, date, status });

  // Validation
  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!['Present', 'Absent'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Present or Absent' });
  }

  const sql = 'INSERT INTO attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [employeeName, employeeID, date, status], (err, result) => {
    if (err) {
      console.error('❌ Save failed:', err.message);
      return res.status(500).json({ error: 'Failed to save record: ' + err.message });
    }
    
    console.log('✅ Record saved. ID:', result.insertId);
    res.json({ 
      success: true,
      message: `Attendance recorded for ${employeeName}`,
      id: result.insertId
    });
  });
});

// DELETE - Remove attendance record
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Deleting record ID:', id);
  
  const sql = 'DELETE FROM attendance WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Delete failed:', err.message);
      return res.status(500).json({ error: 'Failed to delete record' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    console.log('✅ Record deleted');
    res.json({ message: 'Record deleted successfully' });
  });
});

// GET - Search records
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query required' });
  }
  
  const sql = `
    SELECT * FROM attendance 
    WHERE employeeName LIKE ? OR employeeID LIKE ? 
    ORDER BY date DESC
  `;
  
  const searchTerm = `%${query}%`;
  
  db.query(sql, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('❌ Search failed:', err.message);
      return res.status(500).json({ error: 'Search failed' });
    }
    
    res.json(results);
  });
});

module.exports = router;
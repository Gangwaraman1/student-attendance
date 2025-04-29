const mantraService = require('../fingerprint/mantra_service');

exports.getStudents = (db) => (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    res.json(rows);
  });
};

exports.addStudent = (db) => async (req, res) => {
  const { name, roll_number } = req.body;
  try {
    const fingerprint_data = await mantraService.captureFingerprint();
    db.run('INSERT INTO students (name, roll_number, fingerprint_data) VALUES (?, ?, ?)', [name, roll_number, fingerprint_data]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fingerprint capture failed' });
  }
};

exports.deleteStudent = (db) => (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ success: true });
};

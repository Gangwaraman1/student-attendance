const mantraService = require('../fingerprint/mantra_service');

exports.captureFingerprint = (db) => async (req, res) => {
  try {
    const fingerprintData = await mantraService.captureFingerprint();
    db.get('SELECT * FROM students WHERE fingerprint_data = ?', [fingerprintData], (err, student) => {
      if (student) {
        db.run('INSERT INTO attendance (student_id, date) VALUES (?, DATE("now"))', [student.id]);
        res.json({ success: true, student });
      } else {
        res.json({ success: false });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.getAttendance = (db) => (req, res) => {
  db.all(`SELECT students.name, students.roll_number, attendance.date
          FROM attendance JOIN students ON attendance.student_id = students.id`, [], (err, rows) => {
    res.json(rows);
  });
};

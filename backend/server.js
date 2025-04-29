const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authController = require('./controllers/authController');
const studentController = require('./controllers/studentController');
const attendanceController = require('./controllers/attendanceController');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./backend/db.sqlite');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'attendanceSecret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '../frontend/public')));

// Database Setup
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll_number TEXT,
    fingerprint_data TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date DATE,
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);

  db.get('SELECT * FROM admins WHERE username = ?', ['admin'], (err, row) => {
    if (!row) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
    }
  });
});

// Routes
app.post('/admin/login', authController.login(db));
app.get('/admin/students', authController.isAuthenticated, studentController.getStudents(db));
app.post('/admin/students', authController.isAuthenticated, studentController.addStudent(db));
app.delete('/admin/students/:id', authController.isAuthenticated, studentController.deleteStudent(db));

app.post('/capture-fingerprint', attendanceController.captureFingerprint(db));
app.get('/admin/attendance', authController.isAuthenticated, attendanceController.getAttendance(db));

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

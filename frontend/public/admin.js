document.getElementById('logout').addEventListener('click', () => {
    window.location.href = '/login.html';
  });
  
  document.getElementById('add-student').addEventListener('click', () => {
    const name = prompt('Enter student name');
    const roll_number = prompt('Enter roll number');
    if (name && roll_number) {
      fetch('/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roll_number })
      }).then(response => response.json())
        .then(result => alert(result.success ? 'Student added!' : 'Failed to add student'));
    }
  });
  
  async function loadStudents() {
    const response = await fetch('/admin/students');
    const students = await response.json();
    const studentsTableBody = document.querySelector('#students-table tbody');
    studentsTableBody.innerHTML = '';
    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.roll_number}</td>
        <td><button onclick="deleteStudent(${student.id})">Delete</button></td>
      `;
      studentsTableBody.appendChild(row);
    });
  }
  
  async function loadAttendance() {
    const response = await fetch('/admin/attendance');
    const attendance = await response.json();
    const attendanceTableBody = document.querySelector('#attendance-table tbody');
    attendanceTableBody.innerHTML = '';
    attendance.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.name}</td>
        <td>${record.roll_number}</td>
        <td>${record.date}</td>
      `;
      attendanceTableBody.appendChild(row);
    });
  }
  
  async function deleteStudent(id) {
    const response = await fetch(`/admin/students/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) {
      loadStudents();  // Reload the student list
    }
  }
  
  loadStudents();
  loadAttendance();
  
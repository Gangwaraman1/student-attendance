document.getElementById('capture-fingerprint').addEventListener('click', async () => {
    try {
      const response = await fetch('/capture-fingerprint', {
        method: 'POST'
      });
      const result = await response.json();
      const message = result.success ? 'Attendance marked successfully!' : 'Fingerprint not recognized!';
      document.getElementById('message').innerText = message;
    } catch (error) {
      document.getElementById('message').innerText = 'Error capturing fingerprint';
    }
  });
  
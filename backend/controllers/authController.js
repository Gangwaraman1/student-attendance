const bcrypt = require('bcryptjs');

exports.login = (db) => (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.admin = true;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.session.admin) return next();
  res.redirect('/login.html');
};

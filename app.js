const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const csurf = require('csurf');
const { body, validationResult } = require('express-validator');


const app = express();

let database = {};

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(csurf({ cookie: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { csrfToken: req.csrfToken() });
});

app.post('/login', (req, res) => {
  // Validate and authenticate the user
  app.post('/submit-form', 
  body('username').isLength({ min: 5 }).trim().escape(), 
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // User input is validated and sanitized
    let username = req.body.username;
    let email = req.body.email;
    
    // Simulating saving data to a 'database'
    database[email] = { email };
    database[username] = { username};
    res.send(`User ${username} registered with email ${email}`);
});
 
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    req.session.isAuthenticated = true;
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

app.get('/dashboard', (req, res) => {
  // Secure the dashboard route to only allow authenticated users
  if (req.session.isAuthenticated) {
    res.render('dashboard');
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

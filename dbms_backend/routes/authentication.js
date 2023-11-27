var express = require('express');
var router = express.Router();
const sequelize = require('../database/oracle');


// Signup endpoint
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await sequelize.query(
        `INSERT INTO inglepranil.users (username, password) VALUES ('${username}', '${password}')`
      );
  
      res.status(201).json({ message: 'User created successfully' });
  
    } catch (err) {
      console.error('Error signing up:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Login endpoint
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Request received at root route');
    try {
      const result = await sequelize.query(
        `SELECT * FROM inglepranil.users WHERE username = '${username}' AND password = '${password}'`
      );
      console.lo
      if (result[0].length > 0) {
        res.json({ message: 'Login successful' ,result});
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//export this router to use in our index.js
module.exports = router;
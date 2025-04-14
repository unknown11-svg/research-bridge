const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/protected-data', auth, (req, res) => {
  res.json({ 
    data: "Sensitive info", 
    user: req.user // Contains userId and role
  });
});
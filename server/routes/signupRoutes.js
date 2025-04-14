const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Role-specific field validation
const validateFields = (role, body) => {
  const commonFields = ['name', 'surname', 'email', 'contactNo', 'password', 'department', 'academicRole'];
  
  switch (role) {
    case 'Researcher':
      return [...commonFields, 'researchArea', 'researchExperience'].every(field => body[field]);
    case 'Reviewer':
      return [...commonFields, 'researchExperience'].every(field => body[field]);
    case 'Admin':
      return commonFields.every(field => body[field]);
    default:
      return false;
  }
};

router.post('/signup', async (req, res) => {
  try {
    const { role, ...data } = req.body;

    // Validate Wits domain
    if (!data.email.endsWith('@students.wits.ac.za')) {
      return res.status(400).json({ error: 'Only Wits student emails allowed' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Role-based validation
    if (!validateFields(role, data)) {
      return res.status(400).json({ error: 'Missing required fields for this role' });
    }

    // Create user
    const user = new User({
      ...data,
      role,
      isVerified: false // Admin must verify non-researcher roles
    });

    await user.save();

    res.status(201).json({ message: 'Signup successful. Awaiting verification.' });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

module.exports = router;
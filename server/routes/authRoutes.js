const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '15m',
      algorithm: 'HS256'
    }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        error: 'Authorization token missing',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify Google token with timeout
    const ticket = await Promise.race([
      client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Verification timeout')), 5000)
      )
    ]);

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Strict Wits domain validation
    const WITS_DOMAIN = 'students.wits.ac.za';
    if (!email || !email.endsWith(`@${WITS_DOMAIN}`) || !email.match(/^[a-zA-Z0-9._-]+@students\.wits\.ac\.za$/)) {
      return res.status(403).json({ 
        error: `Only valid ${WITS_DOMAIN} emails allowed`,
        code: 'INVALID_DOMAIN'
      });
    }

    // Find user with case-insensitive email search
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Complete registration first',
        code: 'USER_NOT_REGISTERED',
        suggestedAction: '/api/auth/signup'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Secure cookie settings for production
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      role: user.role,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: picture || null
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    
    const statusCode = error.message.includes('Verification timeout') ? 504 : 500;
    
    res.status(statusCode).json({
      error: 'Authentication failed',
      code: 'AUTH_FAILURE',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Role-specific signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { role, email, password, ...userData } = req.body;
    const WITS_DOMAIN = 'students.wits.ac.za';

    // Validate Wits email
    if (!email.endsWith(`@${WITS_DOMAIN}`)) {
      return res.status(400).json({
        error: `Only ${WITS_DOMAIN} emails allowed`,
        code: 'INVALID_EMAIL_DOMAIN'
      });
    }

    // Check for existing user - FIXED: Added missing parenthesis
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    // Create new user with auto-verification for Researchers
    const user = new User({
      ...userData,
      email,
      password,
      role,
      isVerified: role === 'Researcher'
    });

    await user.save();

    // Generate tokens (auto-login after signup)
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_FAILED',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current authenticated user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -__v -createdAt -updatedAt');

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      code: 'SERVER_ERROR' 
    });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ 
        error: 'Refresh token required',
        code: 'MISSING_REFRESH_TOKEN' 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      });
    }

    const { accessToken } = generateTokens(user);

    res.json({ 
      accessToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid refresh token',
      code: 'INVALID_REFRESH_TOKEN' 
    });
  }
});

// Logout user
router.post('/logout', auth, (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.json({ 
      message: 'Logged out successfully',
      code: 'LOGOUT_SUCCESS'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Logout failed',
      code: 'LOGOUT_FAILED' 
    });
  }
});

module.exports = router;
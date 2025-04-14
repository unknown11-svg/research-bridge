const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['Researcher', 'Admin', 'Reviewer']
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@students\.wits\.ac\.za$/, 'Only Wits student emails allowed']
  },
  password: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  academicRole: {
    type: String,
    required: true,
    enum: ['Student', 'Lecturer', 'Academic Researcher']
  },
  researchArea: {
    type: String,
    required: function() { return this.role === 'Researcher'; }
  },
  researchExperience: {
    type: String,
    enum: ['Bachelor', 'Honours', 'Masters', 'PhD', null],
    required: function() { 
      return this.role === 'Researcher' || this.role === 'Reviewer'; 
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', UserSchema);
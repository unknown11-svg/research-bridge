import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    role: 'Researcher',
    name: '',
    surname: '',
    email: '',
    password: '',
    contactNo: '',
    department: '',
    academicRole: 'Student',
    researchArea: '',
    researchExperience: 'Bachelor'
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/signup', formData);
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  const renderRoleFields = () => {
    switch (formData.role) {
      case 'Researcher':
        return (
          <>
            <div className="form-group">
              <label>Research Area</label>
              <input
                type="text"
                name="researchArea"
                value={formData.researchArea}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Research Experience</label>
              <select
                name="researchExperience"
                value={formData.researchExperience}
                onChange={handleChange}
                required
              >
                <option value="Bachelor">Bachelor</option>
                <option value="Honours">Honours</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </>
        );
      case 'Reviewer':
        return (
          <div className="form-group">
            <label>Research Experience</label>
            <select
              name="researchExperience"
              value={formData.researchExperience}
              onChange={handleChange}
              required
            >
              <option value="Bachelor">Bachelor</option>
              <option value="Honours">Honours</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <h1>Research Bridge Signup</h1>
      <form onSubmit={handleSubmit}>
        {errors.general && <div className="error">{errors.general}</div>}

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Researcher">Researcher</option>
            <option value="Admin">Admin</option>
            <option value="Reviewer">Reviewer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Surname</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Wits Student Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="user@students.wits.ac.za"
          />
          {errors.code === 'INVALID_EMAIL_DOMAIN' && (
            <div className="error">Only Wits student emails allowed</div>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Academic Role</label>
          <select
            name="academicRole"
            value={formData.academicRole}
            onChange={handleChange}
            required
          >
            <option value="Student">Student</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Academic Researcher">Academic Researcher</option>
          </select>
        </div>

        {renderRoleFields()}

        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
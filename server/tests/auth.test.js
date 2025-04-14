const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth System', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Signup creates new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        role: "Researcher",
        name: "Test",
        surname: "User",
        email: "test.user@students.wits.ac.za",
        password: "test123",
        contactNo: "1234567890",
        department: "Computer Science",
        academicRole: "Student",
        researchArea: "AI",
        researchExperience: "Bachelor"
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.user.email).toBe("test.user@students.wits.ac.za");
    
    // Verify DB record
    const user = await User.findOne({ email: "test.user@students.wits.ac.za" });
    expect(user).not.toBeNull();
    expect(user.role).toBe("Researcher");
  });
});
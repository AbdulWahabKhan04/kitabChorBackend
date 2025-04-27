const Teacher = require("../models/Teacher");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password,institution } = req.body;
    const user = await User.create({ name, email, password,institution });
    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,     // important for HTTPS sites like Railway+Vercel
      sameSite: 'None', // 3 days
    });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, institution:user.institution } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password ,role } = req.body;
    if(role == "teacher"){
      const teacher = await Teacher.findOne({ email });
      console.log(teacher)
      if (!teacher) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = createToken(teacher);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        secure: true,     // important for HTTPS sites like Railway+Vercel
        sameSite: 'None',
      });
      return res.json(teacher);
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,     // important for HTTPS sites like Railway+Vercel
      sameSite: 'None',
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0),  secure: true,     // important for HTTPS sites like Railway+Vercel
    sameSite: 'None', });
  res.json({ message: "Logged out successfully" });
};

// middleware/verifyTeacher.js
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const verifyTeacher = async (req, res, next) => {
  try {
    const {token} = req.cookies
    // console.log(token)
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id);

    if (!teacher) return res.status(401).json({ message: "Unauthorized. Teacher not found." });

    req.user = teacher;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyTeacher;

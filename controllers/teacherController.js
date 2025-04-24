const Teacher = require("../models/Teacher");
const bcryptjs = require("bcryptjs");

// Create Teacher Controller
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, referCode, password } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Teacher already exists" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newTeacher = new Teacher({
      ...req.body,
      password: hashedPassword,
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

// GET single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Error getting teacher" });
  }
};

// DELETE a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher" });
  }
};

// UPDATE teacher info
exports.updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTeacher)
      return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher" });
  }
};

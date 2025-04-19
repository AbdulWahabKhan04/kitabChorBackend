const express = require("express");
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  deleteTeacher,
  updateTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

// POST - Create new teacher
router.post("/", createTeacher);

// GET - All teachers
router.get("/", getAllTeachers);

// GET - Single teacher
router.get("/:id", getTeacherById);

// PUT - Update teacher
router.put("/:id", updateTeacher);

// DELETE - Delete teacher
router.delete("/:id", deleteTeacher);

module.exports = router;

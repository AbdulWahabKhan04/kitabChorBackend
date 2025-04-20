const express = require("express");
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  deleteTeacher,
  updateTeacher,
} = require("../controllers/teacherController");
const Teacher = require("../models/Teacher");

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

router.get("/getRefer/:referCode", async (req, res) => {
  const { referCode } = req.params;
  try {
    const teacher = await Teacher.findOne({ referCode });
    if (!teacher) {
      return res.status(404).json({ message: "Refer code not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher by refer code:", error);
    res.status(500).json({ message: "Server error" });
  }
}
);

module.exports = router;

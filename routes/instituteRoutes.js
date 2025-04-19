const express = require("express");
const router = express.Router();
const instituteController = require("../controllers/instituteController");

// Create a new institute
router.post("/", instituteController.createInstitute);

// Get all institutes
router.get("/", instituteController.getAllInstitutes);

// Get a single institute by ID
router.get("/:id", instituteController.getInstituteById);

// Update an institute
router.put("/:id", instituteController.updateInstitute);

// Delete an institute
router.delete("/:id", instituteController.deleteInstitute);

module.exports = router;

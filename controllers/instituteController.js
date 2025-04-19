const Institute = require("../models/Institute");

// Create a new institute
const createInstitute = async (req, res) => {
  try {
    const { name, branchs, expressDelivery } = req.body;

    // Check if the institute already exists
    const existingInstitute = await Institute.findOne({ name });
    if (existingInstitute) {
      return res.status(400).json({ message: "Institute already exists" });
    }

    const newInstitute = new Institute({
      name,
      branchs,
      expressDelivery,
    });

    await newInstitute.save();
    res.status(201).json(newInstitute);
  } catch (error) {
    res.status(500).json({ message: "Failed to create institute", error });
  }
};

// Get all institutes
const getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch institutes", error });
  }
};

// Get a single institute by ID
const getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }
    res.status(200).json(institute);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch institute", error });
  }
};

// Update an institute
const updateInstitute = async (req, res) => {
  try {
    const { name, branchs, expressDelivery } = req.body;
    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      { name, branchs, expressDelivery },
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    res.status(200).json(updatedInstitute);
  } catch (error) {
    res.status(500).json({ message: "Failed to update institute", error });
  }
};

// Delete an institute
const deleteInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndDelete(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }
    res.status(200).json({ message: "Institute deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete institute", error });
  }
};

module.exports = {
  createInstitute,
  getAllInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
};

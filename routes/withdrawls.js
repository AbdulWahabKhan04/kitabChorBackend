// routes/withdrawals.js
const express = require("express");
const router = express.Router();
const WithdrawalRequest = require("../models/WithdrawalRequest");
const Teacher = require("../models/Teacher");

// Middleware to verify the logged-in teacher (authentication)
const verifyTeacher = require("../middleware/verifyTeacher");  // Add your auth middleware here

// Route to request a withdrawal
router.post("/request", verifyTeacher, async (req, res) => {
  const { amount, paymentMethod, accountTitle, accountNo, note } = req.body;
//   console.log(req.body);
  if (!amount || !paymentMethod || !accountTitle || !accountNo) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const teacher = await Teacher.findById(req.user._id);  // Assuming the logged-in teacher's ID is stored in req.user._id

    // Check if teacher has enough earnings
    if (teacher.earnings < amount) {
    //   console.log("Insufficient earnings to withdraw.");
      return res.status(400).json({ message: "Insufficient earnings to withdraw." });
    }

    // Create the withdrawal request
    const newRequest = new WithdrawalRequest({
      teacher: teacher._id,
      amount,
      paymentMethod,
      accountTitle,
      accountNo,
      note,
    });

    await newRequest.save();

    // Return success message
    res.status(200).json({ message: "Withdrawal request submitted successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Route to get all withdrawal requests for an admin
router.get("/", async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find().populate("teacher", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch withdrawal requests." });
  }
});

// Route to approve or reject a withdrawal request (admin only)
router.put("/approve/:id", async (req, res) => {
  const { status } = req.body;  // status can be 'approved' or 'rejected'
  
  try {
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found." });
    }

    withdrawal.status = status;

    if (status === "approved") {
      const teacher = await Teacher.findById(withdrawal.teacher);
      teacher.earnings -= withdrawal.amount; // Deduct from teacher's earnings
      teacher.paidPreviously += withdrawal.amount; // Add to paidPreviously
      await teacher.save();
    }

    await withdrawal.save();
    res.status(200).json({ message: `Withdrawal request ${status}.` });

  } catch (err) {
    res.status(500).json({ message: "Unable to update withdrawal request." });
  }
});

router.get("/my", verifyTeacher, async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ teacher: req.user._id }).populate("teacher", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch your withdrawal requests." });
  }
}
);

module.exports = router;

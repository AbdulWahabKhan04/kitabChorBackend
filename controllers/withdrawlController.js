// controllers/withdrawalController.js
const WithdrawalRequest = require("../models/WithdrawalRequest");
const Teacher = require("../models/Teacher");

// Handle Withdrawal Request
exports.createWithdrawalRequest = async (req, res) => {
  const { amount, paymentMethod, accountTitle, accountNo, note } = req.body;

  if (!amount || !paymentMethod || !accountTitle || !accountNo) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const teacher = await Teacher.findById(req.user._id);

    // Ensure teacher has enough earnings
    if (teacher.earnings < amount) {
      return res.status(400).json({ message: "Insufficient earnings to withdraw." });
    }

    const newRequest = new WithdrawalRequest({
      teacher: teacher._id,
      amount,
      paymentMethod,
      accountTitle,
      accountNo,
      note,
    });

    await newRequest.save();

    res.status(200).json({ message: "Withdrawal request submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

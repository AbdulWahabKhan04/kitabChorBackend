const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
  markResponded,
} = require('../controllers/messageController');

// POST: Contact form submission
router.post('/', sendMessage);

// GET: Admin fetch all messages
router.get('/', getAllMessages);

// PUT: Mark a message as responded
router.put('/:id/responded', markResponded);

module.exports = router;

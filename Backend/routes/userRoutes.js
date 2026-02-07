const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/users');
const { protect, restrictTo } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Admin-only routes
router.get('/stats', restrictTo('admin'), getUserStats);
router.get('/', restrictTo('admin'), getUsers);
router.delete('/:id', restrictTo('admin'), deleteUser);

// Admin or self routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;
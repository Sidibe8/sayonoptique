const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/',  authController.getAllUsers);
router.get('/:id', authController.getUserById);

router.post('/register',  authController.register);
router.put('/users/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, authController.updateUser);
router.delete('/users/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, authController.deleteUser);

module.exports = router;


// Assigner un gestionnaire à un cabinet plus tard
// PUT /api/auth/users/2
// {
//   "cabinetId": 1
// }
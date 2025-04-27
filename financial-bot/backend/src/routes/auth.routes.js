const express = require('express');
const router = express.Router();
const {
    register,
    activate,
    login,
    getMe,
    updatePassword,
    regenerateActivation,
    logout
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { roles } = require('../config/config');

// Public routes
router.post('/register', register);
router.post('/activate', activate);
router.post('/login', login);

// Protected routes
router.use(protect); // Apply protection to all routes below this
router.get('/me', getMe);
router.put('/updatepassword', updatePassword);
router.post('/logout', logout);

// Admin only routes
router.post('/regenerate-activation', authorize(roles.ADMIN), regenerateActivation);

module.exports = router;

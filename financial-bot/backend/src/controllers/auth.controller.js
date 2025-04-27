const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user.model');
const WhatsappSession = require('../models/whatsapp-session.model');
const ErrorResponse = require('../utils/errorResponse');
const config = require('../config/config');
const { asyncHandler } = require('../middleware/error.middleware');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpire
    });
};

// Generate Activation Code
const generateActivationCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

    // Generate activation code
    const activationCode = generateActivationCode();
    const activationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default

    // Create user
    const user = await User.create({
        username,
        password,
        role: role || config.roles.USER,
        activationCode,
        activationExpiry,
        activationStatus: config.activationStatus.PENDING
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            username: user.username,
            activationCode: user.activationCode,
            expiresIn: user.activationExpiry
        }
    });
});

// @desc    Activate user account
// @route   POST /api/auth/activate
// @access  Public
exports.activate = asyncHandler(async (req, res) => {
    const { username, activationCode } = req.body;

    // Find user
    const user = await User.findOne({ username, activationCode });

    if (!user) {
        throw new ErrorResponse('Invalid activation credentials', 401);
    }

    if (user.activationStatus === config.activationStatus.EXPIRED) {
        throw new ErrorResponse('Activation code has expired', 401);
    }

    if (user.activationExpiry < new Date()) {
        user.activationStatus = config.activationStatus.EXPIRED;
        await user.save();
        throw new ErrorResponse('Activation code has expired', 401);
    }

    // Activate user
    user.activationStatus = config.activationStatus.ACTIVE;
    await user.save();

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Account activated successfully',
        token
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check activation status
    if (!user.isActivationValid()) {
        throw new ErrorResponse('Account is not activated or has expired', 401);
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        }
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
        throw new ErrorResponse('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    // Create new token
    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token
    });
});

// @desc    Generate new activation code
// @route   POST /api/auth/regenerate-activation
// @access  Private (Admin only)
exports.regenerateActivation = asyncHandler(async (req, res) => {
    const { userId, duration } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    // Generate new activation code
    const activationCode = generateActivationCode();
    const activationExpiry = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

    user.activationCode = activationCode;
    user.activationExpiry = activationExpiry;
    user.activationStatus = config.activationStatus.PENDING;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'New activation code generated successfully',
        data: {
            username: user.username,
            activationCode: user.activationCode,
            expiresIn: user.activationExpiry
        }
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
    // Find and deactivate WhatsApp sessions
    await WhatsappSession.updateMany(
        { user: req.user.id, status: 'active' },
        { status: 'inactive' }
    );

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

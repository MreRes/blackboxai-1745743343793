const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);

            // Get user from token
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user's activation is valid
            if (!user.isActivationValid()) {
                return res.status(403).json({
                    success: false,
                    message: 'Your activation has expired'
                });
            }

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'User role is not authorized to access this route'
            });
        }
        next();
    };
};

exports.validateActivation = async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
            activationCode: req.body.activationCode
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid activation credentials'
            });
        }

        if (user.activationStatus === config.activationStatus.EXPIRED) {
            return res.status(403).json({
                success: false,
                message: 'Activation code has expired'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

exports.validateWhatsappSession = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        
        // Check if user has reached their WhatsApp number limit
        if (!req.user.canAddWhatsappNumber()) {
            return res.status(403).json({
                success: false,
                message: 'Maximum number of WhatsApp numbers reached'
            });
        }

        // Check if phone number is already registered
        const existingNumber = req.user.whatsappNumbers.find(n => n.number === phoneNumber);
        if (existingNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

exports.validateAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== config.roles.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

const express = require('express');
const router = express.Router();
const {
    initializeSession,
    getQRCode,
    getSessionStatus,
    updateSettings,
    disconnectSession,
    getSessions,
    deleteSession,
    addCustomPhrases,
    getErrorLogs
} = require('../controllers/whatsapp.controller');
const { protect, authorize, validateWhatsappSession } = require('../middleware/auth.middleware');
const { roles } = require('../config/config');

// All routes are protected
router.use(protect);

// Session management routes
router.route('/init')
    .post(validateWhatsappSession, initializeSession);

router.route('/sessions')
    .get(getSessions);

router.route('/qr/:sessionId')
    .get(getQRCode);

router.route('/status/:sessionId')
    .get(getSessionStatus);

router.route('/settings/:sessionId')
    .put(updateSettings);

router.route('/disconnect/:sessionId')
    .post(disconnectSession);

router.route('/sessions/:sessionId')
    .delete(deleteSession);

// NLP and customization routes
router.route('/nlp/:sessionId')
    .post(addCustomPhrases);

// Logging routes
router.route('/logs/:sessionId')
    .get(getErrorLogs);

// Admin routes
router.route('/admin/sessions')
    .get(authorize(roles.ADMIN), async (req, res) => {
        // Implementation for admin to view all sessions
        res.status(501).json({ message: 'Not implemented' });
    });

router.route('/admin/logs')
    .get(authorize(roles.ADMIN), async (req, res) => {
        // Implementation for admin to view all logs
        res.status(501).json({ message: 'Not implemented' });
    });

module.exports = router;

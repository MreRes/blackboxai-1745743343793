const WhatsappSession = require('../models/whatsapp-session.model');
const whatsappService = require('../services/whatsapp.service');
const ErrorResponse = require('../utils/errorResponse');
const { asyncHandler } = require('../middleware/error.middleware');

// @desc    Initialize WhatsApp session
// @route   POST /api/whatsapp/init
// @access  Private
exports.initializeSession = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;

    // Check if session already exists
    let session = await WhatsappSession.findOne({
        user: req.user.id,
        phoneNumber
    });

    if (!session) {
        session = await WhatsappSession.create({
            user: req.user.id,
            phoneNumber,
            sessionData: '',
            status: 'inactive'
        });
    }

    // Initialize WhatsApp client
    await whatsappService.initializeClient(req.user.id, session._id);

    res.status(200).json({
        success: true,
        message: 'WhatsApp session initialization started',
        data: {
            sessionId: session._id,
            status: session.status
        }
    });
});

// @desc    Get QR code for WhatsApp Web
// @route   GET /api/whatsapp/qr/:sessionId
// @access  Private
exports.getQRCode = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    if (!session.qrCode) {
        throw new ErrorResponse('QR code not yet generated', 404);
    }

    res.status(200).json({
        success: true,
        data: {
            qrCode: session.qrCode
        }
    });
});

// @desc    Get session status
// @route   GET /api/whatsapp/status/:sessionId
// @access  Private
exports.getSessionStatus = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    res.status(200).json({
        success: true,
        data: {
            status: session.status,
            lastActive: session.lastActive
        }
    });
});

// @desc    Update session settings
// @route   PUT /api/whatsapp/settings/:sessionId
// @access  Private
exports.updateSettings = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    // Update settings
    if (req.body.settings) {
        session.settings = {
            ...session.settings,
            ...req.body.settings
        };
    }

    // Update NLP settings
    if (req.body.nlpSettings) {
        session.nlpSettings = {
            ...session.nlpSettings,
            ...req.body.nlpSettings
        };
    }

    await session.save();

    res.status(200).json({
        success: true,
        data: session
    });
});

// @desc    Disconnect WhatsApp session
// @route   POST /api/whatsapp/disconnect/:sessionId
// @access  Private
exports.disconnectSession = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    // Disconnect WhatsApp client
    await whatsappService.disconnect(req.user.id);

    // Update session status
    session.status = 'inactive';
    session.lastActive = new Date();
    await session.save();

    res.status(200).json({
        success: true,
        message: 'WhatsApp session disconnected successfully'
    });
});

// @desc    Get all sessions for user
// @route   GET /api/whatsapp/sessions
// @access  Private
exports.getSessions = asyncHandler(async (req, res) => {
    const sessions = await WhatsappSession.find({ user: req.user.id })
        .select('-sessionData')
        .sort('-lastActive');

    res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions
    });
});

// @desc    Delete WhatsApp session
// @route   DELETE /api/whatsapp/sessions/:sessionId
// @access  Private
exports.deleteSession = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    // Disconnect if active
    if (session.status === 'active') {
        await whatsappService.disconnect(req.user.id);
    }

    await session.remove();

    res.status(200).json({
        success: true,
        message: 'Session deleted successfully'
    });
});

// @desc    Add custom NLP phrases
// @route   POST /api/whatsapp/nlp/:sessionId
// @access  Private
exports.addCustomPhrases = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    const { phrases } = req.body;

    // Add new phrases to existing ones
    session.nlpSettings.customPhrases = [
        ...session.nlpSettings.customPhrases,
        ...phrases
    ];

    await session.save();

    res.status(200).json({
        success: true,
        message: 'Custom phrases added successfully',
        data: session.nlpSettings.customPhrases
    });
});

// @desc    Get session error logs
// @route   GET /api/whatsapp/logs/:sessionId
// @access  Private
exports.getErrorLogs = asyncHandler(async (req, res) => {
    const session = await WhatsappSession.findOne({
        _id: req.params.sessionId,
        user: req.user.id
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const logs = session.errorLogs
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(startIndex, startIndex + limit);

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });
});

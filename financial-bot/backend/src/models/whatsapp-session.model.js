const mongoose = require('mongoose');
const config = require('../config/config');

const whatsappSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    sessionData: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'inactive'
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    deviceInfo: {
        platform: String,
        browser: String,
        version: String
    },
    settings: {
        autoReply: {
            enabled: {
                type: Boolean,
                default: false
            },
            message: {
                type: String,
                default: 'Terima kasih atas pesannya. Saya akan memproses transaksi keuangan Anda segera.'
            }
        },
        notifications: {
            budgetAlerts: {
                type: Boolean,
                default: true
            },
            dailySummary: {
                type: Boolean,
                default: false
            },
            weeklyReport: {
                type: Boolean,
                default: true
            }
        },
        language: {
            type: String,
            enum: ['id', 'en'],
            default: 'id'
        },
        timezone: {
            type: String,
            default: 'Asia/Jakarta'
        }
    },
    nlpSettings: {
        enabled: {
            type: Boolean,
            default: true
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.7
        },
        customPhrases: [{
            phrase: String,
            intent: String,
            examples: [String]
        }]
    },
    messageQueue: [{
        content: String,
        type: String,
        priority: {
            type: Number,
            default: 1
        },
        scheduledFor: Date,
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending'
        }
    }],
    errorLogs: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        error: String,
        context: Object
    }]
}, {
    timestamps: true
});

// Indexes
whatsappSessionSchema.index({ user: 1, phoneNumber: 1 }, { unique: true });
whatsappSessionSchema.index({ status: 1, lastActive: -1 });

// Methods
whatsappSessionSchema.methods.isActive = function() {
    return this.status === 'active';
};

whatsappSessionSchema.methods.updateLastActive = async function() {
    this.lastActive = new Date();
    await this.save();
};

whatsappSessionSchema.methods.addToMessageQueue = async function(message) {
    this.messageQueue.push(message);
    await this.save();
};

whatsappSessionSchema.methods.logError = async function(error, context = {}) {
    this.errorLogs.push({
        error: error.toString(),
        context
    });
    await this.save();
};

// Statics
whatsappSessionSchema.statics.findActiveSessions = function() {
    return this.find({
        status: 'active',
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Active in last 24 hours
    });
};

const WhatsappSession = mongoose.model('WhatsappSession', whatsappSessionSchema);

module.exports = WhatsappSession;

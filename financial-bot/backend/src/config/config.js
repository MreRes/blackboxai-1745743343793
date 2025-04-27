require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '24h',
    whatsappSessionDir: process.env.WHATSAPP_SESSION_DIR || './whatsapp-sessions',
    defaultActivationDurations: {
        trial: '7d',
        monthly: '30d',
        yearly: '365d'
    },
    roles: {
        ADMIN: 'admin',
        USER: 'user'
    },
    maxWhatsappNumbers: 1, // Default max numbers per user
    activationStatus: {
        PENDING: 'pending',
        ACTIVE: 'active',
        EXPIRED: 'expired'
    }
};

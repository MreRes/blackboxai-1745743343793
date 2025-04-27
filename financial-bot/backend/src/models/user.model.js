const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: [config.roles.ADMIN, config.roles.USER],
        default: config.roles.USER
    },
    activationCode: {
        type: String,
        required: true,
        unique: true
    },
    activationStatus: {
        type: String,
        enum: [config.activationStatus.PENDING, config.activationStatus.ACTIVE, config.activationStatus.EXPIRED],
        default: config.activationStatus.PENDING
    },
    activationExpiry: {
        type: Date,
        required: true
    },
    whatsappNumbers: [{
        number: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{10,15}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    }],
    maxWhatsappNumbers: {
        type: Number,
        default: config.maxWhatsappNumbers
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user can add more WhatsApp numbers
userSchema.methods.canAddWhatsappNumber = function() {
    return this.whatsappNumbers.length < this.maxWhatsappNumbers;
};

// Method to check if activation is valid
userSchema.methods.isActivationValid = function() {
    return this.activationStatus === config.activationStatus.ACTIVE && 
           this.activationExpiry > new Date();
};

const User = mongoose.model('User', userSchema);

module.exports = User;

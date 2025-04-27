const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    source: {
        type: String,
        enum: ['web', 'whatsapp'],
        required: true
    },
    whatsappNumber: {
        type: String,
        validate: {
            validator: function(v) {
                return !this.source || this.source !== 'whatsapp' || /^\d{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'document'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        name: String
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            validate: {
                validator: function(v) {
                    return !v || v.length === 2;
                },
                message: props => `${props.value} is not a valid location!`
            }
        }
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    },
    recurringTransaction: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: function() {
                return this.recurringTransaction.isRecurring;
            }
        },
        endDate: {
            type: Date
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });

// Method to calculate total amount for a period
transactionSchema.statics.getTotalByType = async function(userId, type, startDate, endDate) {
    const match = {
        user: userId,
        type,
        date: { $gte: startDate, $lte: endDate }
    };

    const result = await this.aggregate([
        { $match: match },
        { $group: {
            _id: null,
            total: { $sum: '$amount' }
        }}
    ]);

    return result.length > 0 ? result[0].total : 0;
};

// Method to get category-wise summary
transactionSchema.statics.getCategorySummary = async function(userId, type, startDate, endDate) {
    const match = {
        user: userId,
        type,
        date: { $gte: startDate, $lte: endDate }
    };

    return await this.aggregate([
        { $match: match },
        { $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
        }},
        { $sort: { total: -1 } }
    ]);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

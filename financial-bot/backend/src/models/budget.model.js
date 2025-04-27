const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Budget name is required'],
        trim: true
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    categories: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        limit: {
            type: Number,
            required: true,
            min: [0, 'Budget limit cannot be negative']
        },
        spent: {
            type: Number,
            default: 0,
            min: [0, 'Spent amount cannot be negative']
        },
        color: {
            type: String,
            default: '#000000'
        },
        notifications: {
            enabled: {
                type: Boolean,
                default: true
            },
            threshold: {
                type: Number,
                min: [0, 'Threshold percentage cannot be negative'],
                max: [100, 'Threshold percentage cannot exceed 100'],
                default: 80
            }
        }
    }],
    totalBudget: {
        type: Number,
        required: true,
        min: [0, 'Total budget cannot be negative']
    },
    totalSpent: {
        type: Number,
        default: 0,
        min: [0, 'Total spent cannot be negative']
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    notifications: {
        enabled: {
            type: Boolean,
            default: true
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'never'],
            default: 'weekly'
        },
        channels: {
            whatsapp: {
                type: Boolean,
                default: true
            },
            email: {
                type: Boolean,
                default: false
            }
        }
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringConfig: {
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'yearly'],
            required: function() {
                return this.isRecurring;
            }
        },
        autoRenew: {
            type: Boolean,
            default: true
        }
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
budgetSchema.index({ user: 1, status: 1 });
budgetSchema.index({ user: 1, startDate: -1 });

// Method to calculate remaining budget
budgetSchema.methods.getRemainingBudget = function() {
    return this.totalBudget - this.totalSpent;
};

// Method to check if budget is exceeded
budgetSchema.methods.isExceeded = function() {
    return this.totalSpent > this.totalBudget;
};

// Method to update spent amount
budgetSchema.methods.updateSpentAmount = async function(categoryName, amount) {
    const category = this.categories.find(c => c.name === categoryName);
    if (category) {
        category.spent += amount;
        this.totalSpent += amount;
        await this.save();
    }
};

// Method to get category status
budgetSchema.methods.getCategoryStatus = function(categoryName) {
    const category = this.categories.find(c => c.name === categoryName);
    if (!category) return null;

    const percentageUsed = (category.spent / category.limit) * 100;
    return {
        name: category.name,
        limit: category.limit,
        spent: category.spent,
        remaining: category.limit - category.spent,
        percentageUsed,
        isExceeded: category.spent > category.limit,
        needsNotification: category.notifications.enabled && 
                         percentageUsed >= category.notifications.threshold
    };
};

// Static method to get active budgets for a user
budgetSchema.statics.getActiveBudgets = function(userId) {
    return this.find({
        user: userId,
        status: 'active',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
    });
};

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;

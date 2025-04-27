const Budget = require('../models/budget.model');
const Transaction = require('../models/transaction.model');
const ErrorResponse = require('../utils/errorResponse');
const { asyncHandler } = require('../middleware/error.middleware');

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = asyncHandler(async (req, res) => {
    // Add user to request body
    req.body.user = req.user.id;

    // Validate total budget matches sum of category limits
    const categoryTotal = req.body.categories.reduce((sum, category) => sum + category.limit, 0);
    if (categoryTotal !== req.body.totalBudget) {
        throw new ErrorResponse('Total budget must match sum of category limits', 400);
    }

    const budget = await Budget.create(req.body);

    res.status(201).json({
        success: true,
        data: budget
    });
});

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = { user: req.user.id };

    // Add status filter if provided
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
        query.$or = [
            {
                startDate: { 
                    $gte: new Date(req.query.startDate),
                    $lte: new Date(req.query.endDate)
                }
            },
            {
                endDate: {
                    $gte: new Date(req.query.startDate),
                    $lte: new Date(req.query.endDate)
                }
            }
        ];
    }

    const total = await Budget.countDocuments(query);
    const budgets = await Budget.find(query)
        .sort({ startDate: -1 })
        .skip(startIndex)
        .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: budgets.length,
        pagination,
        data: budgets
    });
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!budget) {
        throw new ErrorResponse('Budget not found', 404);
    }

    // Get transactions for this budget period
    const transactions = await Transaction.find({
        user: req.user.id,
        type: 'expense',
        date: {
            $gte: budget.startDate,
            $lte: budget.endDate
        }
    }).sort({ date: -1 });

    res.status(200).json({
        success: true,
        data: {
            budget,
            transactions
        }
    });
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = asyncHandler(async (req, res) => {
    let budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!budget) {
        throw new ErrorResponse('Budget not found', 404);
    }

    // Validate total budget matches sum of category limits if categories are being updated
    if (req.body.categories) {
        const categoryTotal = req.body.categories.reduce((sum, category) => sum + category.limit, 0);
        if (categoryTotal !== (req.body.totalBudget || budget.totalBudget)) {
            throw new ErrorResponse('Total budget must match sum of category limits', 400);
        }
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: budget
    });
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!budget) {
        throw new ErrorResponse('Budget not found', 404);
    }

    await budget.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get budget summary
// @route   GET /api/budgets/summary
// @access  Private
exports.getBudgetSummary = asyncHandler(async (req, res) => {
    const activeBudgets = await Budget.getActiveBudgets(req.user.id);

    const summaries = await Promise.all(activeBudgets.map(async (budget) => {
        const transactions = await Transaction.find({
            user: req.user.id,
            type: 'expense',
            date: {
                $gte: budget.startDate,
                $lte: budget.endDate
            }
        });

        const categoryStatus = budget.categories.map(category => {
            const categoryTransactions = transactions.filter(t => t.category === category.name);
            const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
            
            return {
                name: category.name,
                limit: category.limit,
                spent,
                remaining: category.limit - spent,
                percentageUsed: (spent / category.limit) * 100,
                transactions: categoryTransactions
            };
        });

        return {
            budgetId: budget._id,
            name: budget.name,
            period: budget.period,
            startDate: budget.startDate,
            endDate: budget.endDate,
            totalBudget: budget.totalBudget,
            totalSpent: budget.totalSpent,
            remaining: budget.totalBudget - budget.totalSpent,
            percentageUsed: (budget.totalSpent / budget.totalBudget) * 100,
            categories: categoryStatus
        };
    }));

    res.status(200).json({
        success: true,
        count: summaries.length,
        data: summaries
    });
});

// @desc    Get budget alerts
// @route   GET /api/budgets/alerts
// @access  Private
exports.getBudgetAlerts = asyncHandler(async (req, res) => {
    const activeBudgets = await Budget.getActiveBudgets(req.user.id);
    
    const alerts = [];
    
    for (const budget of activeBudgets) {
        // Check overall budget
        const overallPercentage = (budget.totalSpent / budget.totalBudget) * 100;
        if (overallPercentage >= 80) {
            alerts.push({
                type: 'overall',
                budgetId: budget._id,
                budgetName: budget.name,
                message: `Overall budget is at ${overallPercentage.toFixed(1)}%`,
                severity: overallPercentage >= 100 ? 'high' : 'medium'
            });
        }

        // Check individual categories
        budget.categories.forEach(category => {
            const status = budget.getCategoryStatus(category.name);
            if (status && status.needsNotification) {
                alerts.push({
                    type: 'category',
                    budgetId: budget._id,
                    budgetName: budget.name,
                    category: category.name,
                    message: `Category ${category.name} is at ${status.percentageUsed.toFixed(1)}%`,
                    severity: status.isExceeded ? 'high' : 'medium'
                });
            }
        });
    }

    res.status(200).json({
        success: true,
        count: alerts.length,
        data: alerts
    });
});

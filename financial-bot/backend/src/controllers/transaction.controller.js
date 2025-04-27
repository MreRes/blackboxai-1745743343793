const Transaction = require('../models/transaction.model');
const Budget = require('../models/budget.model');
const ErrorResponse = require('../utils/errorResponse');
const { asyncHandler } = require('../middleware/error.middleware');

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = asyncHandler(async (req, res) => {
    // Add user to request body
    req.body.user = req.user.id;
    req.body.source = req.body.source || 'web';

    const transaction = await Transaction.create(req.body);

    // Update budget if transaction is an expense
    if (transaction.type === 'expense') {
        const activeBudgets = await Budget.getActiveBudgets(req.user.id);
        for (const budget of activeBudgets) {
            const category = budget.categories.find(c => c.name === transaction.category);
            if (category) {
                await budget.updateSpentAmount(transaction.category, transaction.amount);
            }
        }
    }

    res.status(201).json({
        success: true,
        data: transaction
    });
});

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = { user: req.user.id };

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
        query.date = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    // Add type filter if provided
    if (req.query.type) {
        query.type = req.query.type;
    }

    // Add category filter if provided
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Add source filter if provided
    if (req.query.source) {
        query.source = req.query.source;
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
        .sort({ date: -1 })
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
        count: transactions.length,
        pagination,
        data: transactions
    });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!transaction) {
        throw new ErrorResponse('Transaction not found', 404);
    }

    res.status(200).json({
        success: true,
        data: transaction
    });
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = asyncHandler(async (req, res) => {
    let transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!transaction) {
        throw new ErrorResponse('Transaction not found', 404);
    }

    // If amount or category is being updated and it's an expense,
    // we need to update the budget accordingly
    if (transaction.type === 'expense' && 
        (req.body.amount !== transaction.amount || req.body.category !== transaction.category)) {
        const activeBudgets = await Budget.getActiveBudgets(req.user.id);
        
        // Reverse the old transaction amount
        for (const budget of activeBudgets) {
            const oldCategory = budget.categories.find(c => c.name === transaction.category);
            if (oldCategory) {
                await budget.updateSpentAmount(transaction.category, -transaction.amount);
            }
        }
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Add the new amount to budget if it's an expense
    if (transaction.type === 'expense') {
        const activeBudgets = await Budget.getActiveBudgets(req.user.id);
        for (const budget of activeBudgets) {
            const newCategory = budget.categories.find(c => c.name === transaction.category);
            if (newCategory) {
                await budget.updateSpentAmount(transaction.category, transaction.amount);
            }
        }
    }

    res.status(200).json({
        success: true,
        data: transaction
    });
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!transaction) {
        throw new ErrorResponse('Transaction not found', 404);
    }

    // If it's an expense, update the budget
    if (transaction.type === 'expense') {
        const activeBudgets = await Budget.getActiveBudgets(req.user.id);
        for (const budget of activeBudgets) {
            const category = budget.categories.find(c => c.name === transaction.category);
            if (category) {
                await budget.updateSpentAmount(transaction.category, -transaction.amount);
            }
        }
    }

    await transaction.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get transaction summary
// @route   GET /api/transactions/summary
// @access  Private
exports.getTransactionSummary = asyncHandler(async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(1));
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const totalIncome = await Transaction.getTotalByType(req.user.id, 'income', startDate, endDate);
    const totalExpense = await Transaction.getTotalByType(req.user.id, 'expense', startDate, endDate);
    const categorySummary = await Transaction.getCategorySummary(req.user.id, 'expense', startDate, endDate);

    res.status(200).json({
        success: true,
        data: {
            totalIncome,
            totalExpense,
            netAmount: totalIncome - totalExpense,
            categorySummary
        }
    });
});

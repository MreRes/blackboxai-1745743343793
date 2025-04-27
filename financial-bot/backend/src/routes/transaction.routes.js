const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
} = require('../controllers/transaction.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { roles } = require('../config/config');

// All routes are protected
router.use(protect);

// Regular user routes
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/summary')
    .get(getTransactionSummary);

router.route('/:id')
    .get(getTransaction)
    .put(updateTransaction)
    .delete(deleteTransaction);

// Admin routes - could be added here if needed
// router.route('/admin/all')
//     .get(authorize(roles.ADMIN), getAllUsersTransactions);

module.exports = router;

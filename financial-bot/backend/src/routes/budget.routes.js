const express = require('express');
const router = express.Router();
const {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget,
    getBudgetSummary,
    getBudgetAlerts
} = require('../controllers/budget.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { roles } = require('../config/config');

// All routes are protected
router.use(protect);

// Regular user routes
router.route('/')
    .get(getBudgets)
    .post(createBudget);

router.route('/summary')
    .get(getBudgetSummary);

router.route('/alerts')
    .get(getBudgetAlerts);

router.route('/:id')
    .get(getBudget)
    .put(updateBudget)
    .delete(deleteBudget);

// Admin routes - could be added here if needed
// router.route('/admin/all')
//     .get(authorize(roles.ADMIN), getAllUsersBudgets);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAdminDashboard, getUserDashboard } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/admin', auth, getAdminDashboard);
router.get('/user', auth, getUserDashboard);

module.exports = router;
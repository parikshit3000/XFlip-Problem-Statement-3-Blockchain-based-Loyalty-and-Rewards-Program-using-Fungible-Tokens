const express = require('express');
const { addCoins, getCoins, burnCoins } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.route('/coins/add').post(isAuthenticatedUser, addCoins);
router.route('/coins/get').post(isAuthenticatedUser, getCoins);
router.route('/coins/burn').post(isAuthenticatedUser, burnCoins);

module.exports = router;
const express = require('express');
const router = express.Router();


const {getAuth , registerUser} = require('../controllers/authController');

router.get('/auth', getAuth);
router.post('/register', registerUser);

module.exports = router;

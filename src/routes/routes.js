const express = require('express');
const router = express.Router();


const {getAuth , registerUser, loginUser} = require('../controllers/authController');

router.get('/auth', getAuth);
router.post('/register', registerUser);
router.post('/login',loginUser);
module.exports = router;

const router = require('express').Router();
const authController = require('../controller/auth-controller');
const authValidator = require('../validators/auth-validator');
const validate = require('../middleware/validator-middleware');
const authMiddleware = require("../middleware/auth-middleware");

router.post('/signup',validate(authValidator.signupSchema),authController.signup);
router.post('/login',validate(authValidator.loginSchema),authController.login);
router.get('/profile',authMiddleware,authController.getProfile);
router.get('/verify',authController.verifyUser);


module.exports = router;
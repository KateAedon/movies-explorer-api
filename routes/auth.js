const authRouter = require('express').Router();
const { validateLogin, validateUser } = require('../middlewares/validator');

const {
  login, createUser,
} = require('../controllers/users');

authRouter.post('/signin', validateLogin, login);
authRouter.post('/signup', validateUser, createUser);

module.exports = authRouter;

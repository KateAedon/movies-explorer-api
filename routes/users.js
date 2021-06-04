const usersRouter = require('express').Router();
const { validateUserUpdate } = require('../middlewares/validator');

const {
  updateUserData,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('users/me', getCurrentUser);
usersRouter.patch('users/me', validateUserUpdate, updateUserData);

module.exports = usersRouter;

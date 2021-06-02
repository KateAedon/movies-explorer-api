const usersRouter = require('express').Router();
const { validateUserUpdate } = require('../middlewares/validator');

const {
  updateUserData,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', validateUserUpdate, updateUserData);

module.exports = usersRouter;

const usersRouter = require('express').Router();


const {
  updateUserData,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateUserData);

module.exports = usersRouter;

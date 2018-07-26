var Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      status: Joi.string().required(),
      role: Joi.string().required()
    }
  },
  // UPDATE /api/users/:userId
  updateUser: {
    body: {
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  // POST /api/auth/register
  register: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      repeatPassword: Joi.string().required()
    }
  },
  // POST /api/mails/invitation/users/:userId
  sendInvitation: {
    params: {
      userId: Joi.string().required()
    }
  }
};
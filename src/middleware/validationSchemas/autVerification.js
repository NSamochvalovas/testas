/* eslint-disable linebreak-style */
const Joi = require('joi');

const reigstrationSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().trim()
    .required(),
  password: Joi.string().required(),
});

const loginschema = Joi.object({
  email: Joi.string().email().lowercase().trim()
    .required(),
  password: Joi.string().required(),
});

const changePasswords = Joi.object({
  email: Joi.string().email().lowercase().trim()
    .required(),
  password: Joi.string().required(),
  passwordNew: Joi.string().required(),
});

const addWine = Joi.object({
  title: Joi.string().lowercase().trim().required(),
  region: Joi.string().required(),
  year: Joi.string().required(),
});

const selectWine = Joi.object({
  wine_id: Joi.required(),
  quantity: Joi.required(),
});

module.exports = {
  reigstrationSchema,
  loginschema,
  changePasswords,
  addWine,
  selectWine,
};

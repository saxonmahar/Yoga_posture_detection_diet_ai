// middlewares/validateLogin.js
const Joi = require("joi");

// Define schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
});

// Middleware
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false }); // Validate all fields
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ success: false, errors });
  }
  next();
};

module.exports = validateLogin;

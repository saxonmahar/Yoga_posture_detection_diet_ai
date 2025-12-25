const Joi = require("joi");

const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.base": "Name must be a valid string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 50 characters",
      "any.required": "Name is required",
    }),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.base": "Email must be a valid string",
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
      }),

    password: Joi.string().min(6).required().messages({
      "string.base": "Password must be a valid string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required",
        "any.required": "Confirm password is required",
      }),

    level: Joi.string()
      .valid("beginner", "intermediate", "advanced")
      .required()
      .messages({
        "string.base": "Level must be a valid string",
        "any.only": "Level must be beginner, intermediate, or advanced",
        "any.required": "Experience level is required",
      }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

 next();
};

module.exports = registerValidation;

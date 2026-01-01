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

    age: Joi.number()
      .integer()
      .min(1)
      .max(120)
      .required()
      .messages({
        "number.base": "Age must be a valid number",
        "number.min": "Age must be at least 1",
        "number.max": "Age must not exceed 120",
        "any.required": "Age is required",
      }),

    weight: Joi.number()
      .min(1)
      .max(500)
      .required()
      .messages({
        "number.base": "Weight must be a valid number",
        "number.min": "Weight must be at least 1 kg",
        "number.max": "Weight must not exceed 500 kg",
        "any.required": "Weight is required",
      }),

    height: Joi.number()
      .min(50)
      .max(300)
      .required()
      .messages({
        "number.base": "Height must be a valid number",
        "number.min": "Height must be at least 50 cm",
        "number.max": "Height must not exceed 300 cm",
        "any.required": "Height is required",
      }),

    bodyType: Joi.string()
      .valid("ectomorphic", "mesomorphic", "endomorphic")
      .optional()
      .default("mesomorphic")
      .messages({
        "string.base": "Body type must be a valid string",
        "any.only": "Body type must be ectomorphic, mesomorphic, or endomorphic",
      }),

    goal: Joi.string()
      .valid("weight_loss", "maintain", "weight_gain", "muscle-gain")
      .optional()
      .default("maintain")
      .messages({
        "string.base": "Goal must be a valid string",
        "any.only": "Goal must be weight_loss, maintain, weight_gain, or muscle-gain",
      }),

    bmi: Joi.number()
      .min(10)
      .max(100)
      .optional()
      .messages({
        "number.base": "BMI must be a valid number",
        "number.min": "BMI must be at least 10",
        "number.max": "BMI must not exceed 100",
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

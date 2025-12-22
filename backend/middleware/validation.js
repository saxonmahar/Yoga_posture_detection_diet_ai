const joi = require("joi");

const registerValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
      fullName: joi.string().min(3).required().messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters long",
        "any.required": "Full name is required",
      }),

      email: joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),

      password: joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters",
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),

      fitnessLevel: joi
        .string()
        .valid("Beginner", "Intermediate", "Advanced")
        .required()
        .messages({
          "any.only":
            "Fitness level must be Beginner, Intermediate, or Advanced",
          "any.required": "Fitness level is required",
        }),

      wellnessGoals: joi
        .array()
        .items(
          joi.string().valid(
            "Weight Loss",
            "Flexibility",
            "Strength",
            "Stress Relief",
            "Mindfulness"
          )
        )
        .min(1)
        .required()
        .messages({
          "array.min": "Please select at least one wellness goal",
          "any.required": "Wellness goals are required",
        }),

      agreedToTerms: joi.boolean().valid(true).required().messages({
        "any.only": "You must agree to the terms and conditions",
        "any.required": "Terms agreement is required",
      }),
    });

    // Validate & sanitize
    const value = await schema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Replace req.body with sanitized data
    req.body = value;

    next();
  } catch (error) {
    console.error(`Validation error: ${error.message}`);

    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
};

module.exports = registerValidation;

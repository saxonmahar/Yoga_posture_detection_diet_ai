const Joi = require('joi');

const validators = {
  // User validation
  userRegister: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(13).max(100),
    weight: Joi.number().min(30).max(300),
    height: Joi.number().min(100).max(250),
    fitnessLevel: Joi.string().valid('beginner', 'intermediate', 'advanced')
  }),

  // User login validation
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Yoga pose detection validation
  poseDetection: Joi.object({
    imageUrl: Joi.string().uri().optional(),
    userId: Joi.string().optional()
  }),

  // Diet plan validation
  dietPlan: Joi.object({
    planName: Joi.string().required(),
    caloriesPerDay: Joi.number().min(1000).max(5000).required(),
    duration: Joi.number().min(1).max(365).required()
  })
};

/**
 * Validate data against schema
 */
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { valid: false, errors };
  }

  return { valid: true, data: value };
};

module.exports = {
  validators,
  validate
};

const bcrypt = require("bcryptjs");
const User = require("../models/user"); // adjust path if needed
const { generateOTP, sendVerificationEmail } = require("../services/emailService");
const { validateEmail, quickDomainCheck } = require("../services/emailValidationService");

const registerController = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. Extract validated data from request
    |--------------------------------------------------------------------------
    */
    const { name, email, password, level, age, weight, height, bodyType, goal, bmi } = req.body;

    /*
    |--------------------------------------------------------------------------
    | 2. Validate email domain (quick check first)
    |--------------------------------------------------------------------------
    */
    const quickCheck = quickDomainCheck(email);
    
    if (!quickCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: quickCheck.reason,
        emailError: true
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Enhanced email validation (async)
    |--------------------------------------------------------------------------
    */
    const emailValidation = await validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.errors.join(', '),
        emailError: true,
        validationDetails: emailValidation
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Check if user already exists
    |--------------------------------------------------------------------------
    */
    const existingUser = await User.findOne({ email: emailValidation.email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Hash password
    |--------------------------------------------------------------------------
    */
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /*
    |--------------------------------------------------------------------------
    | 6. Calculate BMI if not provided
    |--------------------------------------------------------------------------
    */
    let calculatedBMI = bmi;
    if (!calculatedBMI && weight && height) {
      const heightInMeters = height / 100;
      calculatedBMI = weight / (heightInMeters * heightInMeters);
    }

    /*
    |--------------------------------------------------------------------------
    | 7. Generate email verification token
    |--------------------------------------------------------------------------
    */
    const verificationToken = generateOTP();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    /*
    |--------------------------------------------------------------------------
    | 8. Create user document (unverified)
    |--------------------------------------------------------------------------
    */
    const user = await User.create({
      fullName: name, // frontend → schema mapping
      email: emailValidation.email, // Use validated email
      password: hashedPassword,
      fitnessLevel: level,
      age: age || undefined,
      weight: weight || undefined,
      height: height || undefined,
      bmi: calculatedBMI || undefined,
      bodyType: bodyType || "mesomorphic",
      goal: goal || "maintain",
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    /*
    |--------------------------------------------------------------------------
    | 9. Send verification email
    |--------------------------------------------------------------------------
    */
    const emailResult = await sendVerificationEmail(emailValidation.email, verificationToken, name);
    
    if (!emailResult.success) {
      // If email fails, still create account but warn user
      console.warn('Email sending failed, but account created:', emailResult.error);
      
      return res.status(201).json({
        success: true,
        message: "Account created but verification email failed to send. Please try resending.",
        requiresVerification: true,
        email: emailValidation.email,
        emailWarning: true,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 10. Send response (password already excluded by schema)
    |--------------------------------------------------------------------------
    */
    return res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for verification code.",
      requiresVerification: true,
      email: emailValidation.email,
      emailValidation: {
        domain: emailValidation.domain,
        trusted: emailValidation.checks.trusted,
        warnings: emailValidation.warnings
      },
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | 11. Handle known MongoDB errors
    |--------------------------------------------------------------------------
    */
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    console.error("Register Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = registerController;

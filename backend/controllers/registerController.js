const bcrypt = require("bcryptjs");
const User = require("../models/User"); // adjust path if needed

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
    | 2. Check if user already exists
    |--------------------------------------------------------------------------
    */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Hash password
    |--------------------------------------------------------------------------
    */
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /*
    |--------------------------------------------------------------------------
    | 4. Calculate BMI if not provided
    |--------------------------------------------------------------------------
    */
    let calculatedBMI = bmi;
    if (!calculatedBMI && weight && height) {
      const heightInMeters = height / 100;
      calculatedBMI = weight / (heightInMeters * heightInMeters);
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Create user document
    |--------------------------------------------------------------------------
    */
    const user = await User.create({
      fullName: name, // frontend → schema mapping
      email,
      password: hashedPassword,
      fitnessLevel: level,
      age: age || undefined,
      weight: weight || undefined,
      height: height || undefined,
      bmi: calculatedBMI || undefined,
      bodyType: bodyType || "mesomorphic",
      goal: goal || "maintain",
    });

    /*
    |--------------------------------------------------------------------------
    | 6. Send response (password already excluded by schema)
    |--------------------------------------------------------------------------
    */
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | 7. Handle known MongoDB errors
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

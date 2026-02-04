const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },

    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailVerificationToken: {
      type: String,
      select: false
    },

    emailVerificationExpires: {
      type: Date,
      select: false
    },

    // Password reset fields
    passwordResetToken: {
      type: String,
      select: false
    },

    passwordResetExpires: {
      type: Date,
      select: false
    },

    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },

    wellnessGoals: {
      type: [String],
      enum: [
        "Weight Loss",
        "Flexibility",
        "Strength",
        "Stress Relief",
        "Mindfulness"
      ],
      default: ["Stress Relief"]
    },

    agreedToTerms: {
      type: Boolean,
      default: true
    },

    // Dashboard statistics
    stats: {
      totalWorkouts: { type: Number, default: 0 },
      totalCaloriesBurned: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageAccuracy: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 },
      completedSessions: { type: Number, default: 0 },
      lastLogin: { type: Date }
    },

    // Subscription & preferences
    isPremium: { type: Boolean, default: false },
    subscriptionType: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free"
    },
    subscriptionExpiry: { type: Date },

    // Profile
    avatar: { type: String },
    profilePhoto: {
      type: String,
      default: null
    },
    profilePhotoPublicId: {
      type: String,
      default: null
    },
    bio: { type: String, maxlength: 500 },
    age: { type: Number, min: 1 },
    weight: { type: Number }, // kg
    height: { type: Number },  // cm
    bmi: { type: Number }, // Body Mass Index
    bodyType: {
      type: String,
      enum: ["ectomorphic", "mesomorphic", "endomorphic"],
      default: "mesomorphic"
    },
    goal: {
      type: String,
      enum: ["weight_loss", "maintain", "weight_gain", "muscle-gain"],
      default: "maintain"
    }
  },
  {
    timestamps: true
  }
);

//
// ===== Instance Methods =====
//

// Update last login timestamp
userSchema.methods.updateLastLogin = function () {
  this.stats.lastLogin = new Date();
  return this.save();
};

// Update login streak
userSchema.methods.updateStreak = function () {
  const now = new Date();
  const lastLogin = this.stats.lastLogin || this.createdAt;
  const diffDays = Math.floor(
    (now - lastLogin) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    this.stats.currentStreak += 1;
    this.stats.longestStreak = Math.max(
      this.stats.longestStreak,
      this.stats.currentStreak
    );
  } else if (diffDays > 1) {
    this.stats.currentStreak = 1;
  }

  this.stats.lastLogin = now;
  return this.save();
};

// Add workout statistics
userSchema.methods.addWorkoutStats = function (
  calories,
  accuracy,
  duration
) {
  this.stats.totalWorkouts += 1;
  this.stats.totalCaloriesBurned += calories;
  this.stats.completedSessions += 1;
  this.stats.totalMinutes += duration;

  const totalAccuracy =
    this.stats.averageAccuracy * (this.stats.completedSessions - 1) +
    accuracy;

  this.stats.averageAccuracy =
    totalAccuracy / this.stats.completedSessions;

  return this.save();
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

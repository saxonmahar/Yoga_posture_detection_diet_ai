import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, Target, Award, Edit, 
  Camera, Save, X, TrendingUp, Zap, Heart, Brain, 
  Settings, Bell, Moon, Globe, Ruler, Clock,
  Shield, Download, Trash2, CheckCircle
} from 'lucide-react';
import PhotoUpload from '../components/common/PhotoUpload';
import { useAuth } from '../context/AuthContext';
import photoService from '../services/photoService';

function ProfilePage() {
  const { user, updateUserPhoto } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(
    user?.profilePhoto ? photoService.getPhotoUrl(user.profilePhoto) : null
  );
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Yoga enthusiast and wellness seeker',
    age: user?.age || 28,
    height: user?.height || 175,
    weight: user?.weight || 70,
    goal: user?.stats?.goal || 'weight-loss',
    activityLevel: user?.stats?.activityLevel || 'active',
    yogaExperience: 'beginner',
    dietaryRestrictions: user?.dietaryRestrictions || ['Vegetarian'],
    fitnessGoals: user?.fitnessGoals || ['Improve flexibility', 'Lose 5kg'],
    notifications: {
      yogaReminders: true,
      dietUpdates: true,
      progressReports: true,
      newFeatures: false,
      marketingEmails: false,
      weeklySummary: true
    },
    theme: 'dark',
    language: 'en',
    units: 'metric',
    timeFormat: '24h',
    autoSave: true,
    dataSharing: false
  });

  const goals = [
    { id: 'weight-loss', label: 'Weight Loss', icon: '⚖️' },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
    { id: 'flexibility', label: 'Flexibility', icon: '🤸' },
    { id: 'stress-relief', label: 'Stress Relief', icon: '🧘' },
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
    { id: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { id: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'very-active', label: 'Very Active', description: 'Very hard exercise & physical job' },
  ];

  const yogaExperiences = [
    { id: 'beginner', label: 'Beginner', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', icon: '🌿' },
    { id: 'advanced', label: 'Advanced', icon: '🌳' },
  ];

  // Calculate BMI
  const calculateBMI = () => {
    if (!formData.weight || !formData.height) return 0;
    const heightInMeters = formData.height / 100;
    return formData.weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { category: 'Obese', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const handleSave = () => {
    // TODO: Implement API call to update user profile
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  // Handle photo upload
  const handlePhotoChange = async (file, preview) => {
    setProfilePhoto(file);
    setProfilePhotoPreview(preview);
    
    if (file) {
      // Validate file first
      const validation = photoService.validateImageFile(file);
      if (!validation.isValid) {
        alert('Invalid file: ' + validation.errors.join(', '));
        setProfilePhoto(null);
        setProfilePhotoPreview(user?.profilePhoto ? photoService.getPhotoUrl(user.profilePhoto) : null);
        return;
      }

      // Upload photo to server
      try {
        const result = await photoService.uploadProfilePhoto(file);
        if (result.success) {
          // Update user context with new photo URL
          updateUserPhoto(result.photoUrl);
          alert('Profile photo updated successfully!');
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Photo upload error:', error);
        alert('Failed to upload photo: ' + error.message);
        // Reset photo on error
        setProfilePhoto(null);
        setProfilePhotoPreview(user?.profilePhoto ? photoService.getPhotoUrl(user.profilePhoto) : null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  // Redirect if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view profile</h2>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-text-muted">Manage your personal information and preferences</p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 bg-surface hover:bg-secondary rounded-lg font-semibold transition border border-white/10 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {isEditing ? (
                    <PhotoUpload
                      currentPhoto={profilePhotoPreview}
                      onPhotoChange={handlePhotoChange}
                      size="xlarge"
                    />
                  ) : (
                    profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-slate-600/50"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-4xl font-bold mx-auto">
                        {formData.name?.charAt(0) || 'U'}
                      </div>
                    )
                  )}
                </div>
                <h2 className="text-xl font-bold">{formData.name || 'User'}</h2>
                <p className="text-text-muted text-sm">{formData.email || 'user@example.com'}</p>
                <div className="mt-3">
                  <span className={`px-3 py-1 ${formData.yogaExperience === 'beginner' ? 'bg-green-500/20 text-green-400' : formData.yogaExperience === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} rounded-full text-sm`}>
                    {formData.yogaExperience?.charAt(0).toUpperCase() + formData.yogaExperience?.slice(1)} Level
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-surface/50 rounded-xl">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-text-muted">Activity Level</span>
                    <span className="font-medium capitalize">{formData.activityLevel?.replace('-', ' ')}</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        formData.activityLevel === 'sedentary' ? 'w-1/5 bg-gray-500' :
                        formData.activityLevel === 'light' ? 'w-2/5 bg-blue-500' :
                        formData.activityLevel === 'moderate' ? 'w-3/5 bg-green-500' :
                        formData.activityLevel === 'active' ? 'w-4/5 bg-yellow-500' :
                        'w-full bg-red-500'
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-surface/50 rounded-xl">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-text-muted">Primary Goal</span>
                    <span className="font-medium capitalize">{formData.goal?.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Stats */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4">Health Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">BMI</span>
                  <div className="text-right">
                    <span className="font-bold">{bmi.toFixed(1)}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${bmiInfo.bg} ${bmiInfo.color}`}>
                      {bmiInfo.category}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Age</span>
                  <span className="font-medium">{formData.age}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Weight</span>
                  <span className="font-medium">{formData.weight} kg</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Height</span>
                  <span className="font-medium">{formData.height} cm</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="font-medium mb-3">Daily Calorie Needs</h4>
                <div className="p-4 bg-surface/50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {(() => {
                        // BMR calculation
                        const bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
                        const activity = {
                          sedentary: 1.2,
                          light: 1.375,
                          moderate: 1.55,
                          active: 1.725,
                          'very-active': 1.9
                        }[formData.activityLevel] || 1.55;
                        
                        return Math.round(bmr * activity);
                      })()}
                    </div>
                    <p className="text-sm text-text-muted">calories/day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'dietary', label: 'Dietary', icon: Heart },
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'preferences', label: 'Preferences', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-primary hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Yoga Experience
                      </label>
                      <select
                        name="yogaExperience"
                        value={formData.yogaExperience}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {yogaExperiences.map(exp => (
                          <option key={exp.id} value={exp.id}>
                            {exp.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Activity Level
                      </label>
                      <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {activityLevels.map(level => (
                          <option key={level.id} value={level.id}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Primary Goal
                      </label>
                      <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {goals.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'dietary' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Dietary Preferences</h3>
                  
                  <div>
                    <h4 className="font-medium mb-4">Dietary Restrictions</h4>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb', 'Low-Fat', 'High-Protein'].map(restriction => (
                        <label key={restriction} className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.dietaryRestrictions.includes(restriction)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
                                }));
                              }
                            }}
                            disabled={!isEditing}
                            className="w-4 h-4"
                          />
                          <span>{restriction}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Meal Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Preferred Cuisine
                        </label>
                        <select
                          name="preferredCuisine"
                          value={formData.preferredCuisine || 'mediterranean'}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="mediterranean">Mediterranean</option>
                          <option value="indian">Indian</option>
                          <option value="asian">Asian</option>
                          <option value="american">American</option>
                          <option value="mexican">Mexican</option>
                          <option value="italian">Italian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Meals per Day
                        </label>
                        <select
                          name="mealsPerDay"
                          value={formData.mealsPerDay || '3'}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="2">2 meals</option>
                          <option value="3">3 meals</option>
                          <option value="4">4 meals</option>
                          <option value="5">5+ meals</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Fitness Goals</h3>
                  
                  <div>
                    <h4 className="font-medium mb-4">Current Goals</h4>
                    <div className="space-y-3">
                      {formData.fitnessGoals.map((goal, index) => (
                        <div key={index} className="p-4 bg-surface rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              🎯
                            </div>
                            <div>
                              <h5 className="font-medium">{goal}</h5>
                              <p className="text-sm text-text-muted">Added on {new Date().toLocaleDateString()}</p>
                            </div>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  fitnessGoals: prev.fitnessGoals.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-text-muted hover:text-red-400"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div>
                      <h4 className="font-medium mb-3">Add New Goal</h4>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Enter a new fitness goal..."
                          className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                fitnessGoals: [...prev.fitnessGoals, e.target.value.trim()]
                              }));
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Enter a new fitness goal..."]');
                            if (input.value.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                fitnessGoals: [...prev.fitnessGoals, input.value.trim()]
                              }));
                              input.value = '';
                            }
                          }}
                          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">App Preferences</h3>
                  
                  <div>
                    <h4 className="font-medium mb-4">Notification Settings</h4>
                    <div className="space-y-4">
                      {Object.entries(formData.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-3 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                          <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => handleNotificationChange(key)}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-600'}`}>
                              <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} style={{ marginTop: 1 }}></div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Display Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Theme
                        </label>
                        <select
                          name="theme"
                          value={formData.theme}
                          onChange={handleInputChange}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="light">Light Mode</option>
                          <option value="dark">Dark Mode</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Measurement Units
                        </label>
                        <select
                          name="units"
                          value={formData.units}
                          onChange={handleInputChange}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="metric">Metric (kg, cm)</option>
                          <option value="imperial">Imperial (lbs, in)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Time Format
                        </label>
                        <select
                          name="timeFormat"
                          value={formData.timeFormat}
                          onChange={handleInputChange}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="24h">24-hour</option>
                          <option value="12h">12-hour</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Data & Privacy</h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                        <div>
                          <span className="font-medium">Auto-save Progress</span>
                          <p className="text-sm text-text-muted">Automatically save your yoga sessions</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.autoSave}
                          onChange={() => setFormData(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                          className="w-5 h-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                        <div>
                          <span className="font-medium">Share Anonymous Data</span>
                          <p className="text-sm text-text-muted">Help improve AI models (anonymous)</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.dataSharing}
                          onChange={() => setFormData(prev => ({ ...prev, dataSharing: !prev.dataSharing }))}
                          className="w-5 h-5"
                        />
                      </label>

                      <button
                        onClick={() => {
                          const data = { profile: formData, timestamp: new Date().toISOString() };
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'yogaai-profile.json';
                          a.click();
                        }}
                        className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5" />
                          <div>
                            <span className="font-medium">Export Data</span>
                            <p className="text-sm text-text-muted">Download your profile data</p>
                          </div>
                        </div>
                        <span>📥</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors"
          >
            View Progress
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-3 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            App Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
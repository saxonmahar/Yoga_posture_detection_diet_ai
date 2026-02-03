import { useState, useEffect } from 'react';
import { 
  X, Save, Trash2, CheckCircle
} from 'lucide-react';

const SessionModal = ({ 
  isOpen, 
  onClose, 
  session = null, 
  selectedDate = null,
  onSave,
  onDelete,
  onComplete,
  mode = 'create' // 'create', 'edit', 'view'
}) => {
  const [formData, setFormData] = useState({
    title: 'Yoga Session',
    date: '',
    time: '07:00',
    duration: 30,
    poses: [],
    difficulty: 'beginner',
    recurring: {
      enabled: false,
      pattern: 'weekly',
      daysOfWeek: [],
      endDate: ''
    },
    reminders: {
      enabled: true,
      minutes: [30, 15, 5]
    },
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const availablePoses = [
    { id: 'warrior2', name: 'Warrior II', difficulty: 'intermediate' },
    { id: 'tpose', name: 'T Pose', difficulty: 'beginner' },
    { id: 'tree', name: 'Tree Pose', difficulty: 'beginner' },
    { id: 'goddess', name: 'Goddess Pose', difficulty: 'intermediate' },
    { id: 'downdog', name: 'Downward Dog', difficulty: 'intermediate' },
    { id: 'plank', name: 'Plank', difficulty: 'advanced' }
  ];

  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ];

  // Initialize form data
  useEffect(() => {
    if (session) {
      // Edit mode - populate with session data
      setFormData({
        title: session.title || 'Yoga Session',
        date: new Date(session.date).toISOString().split('T')[0],
        time: session.time || '07:00',
        duration: session.duration || 30,
        poses: session.poses || [],
        difficulty: session.difficulty || 'beginner',
        recurring: session.recurring || {
          enabled: false,
          pattern: 'weekly',
          daysOfWeek: [],
          endDate: ''
        },
        reminders: session.reminders || {
          enabled: true,
          minutes: [30, 15, 5]
        },
        notes: session.notes || ''
      });
    } else if (selectedDate) {
      // Create mode - use selected date
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [session, selectedDate]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle pose selection
  const handlePoseToggle = (poseId) => {
    setFormData(prev => ({
      ...prev,
      poses: prev.poses.includes(poseId)
        ? prev.poses.filter(id => id !== poseId)
        : [...prev.poses, poseId]
    }));
  };

  // Handle day of week selection for recurring
  const handleDayToggle = (dayId) => {
    setFormData(prev => ({
      ...prev,
      recurring: {
        ...prev.recurring,
        daysOfWeek: prev.recurring.daysOfWeek.includes(dayId)
          ? prev.recurring.daysOfWeek.filter(id => id !== dayId)
          : [...prev.recurring.daysOfWeek, dayId]
      }
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.duration < 5) newErrors.duration = 'Duration must be at least 5 minutes';
    if (formData.poses.length === 0) newErrors.poses = 'Select at least one pose';

    if (formData.recurring.enabled) {
      if (formData.recurring.pattern === 'weekly' && formData.recurring.daysOfWeek.length === 0) {
        newErrors.recurringDays = 'Select at least one day for weekly recurring';
      }
      if (!formData.recurring.endDate) {
        newErrors.recurringEndDate = 'End date is required for recurring sessions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save session error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setLoading(true);
      try {
        await onDelete(session._id);
        onClose();
      } catch (error) {
        console.error('Delete session error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle complete
  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(session._id);
      onClose();
    } catch (error) {
      console.error('Complete session error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isCreateMode ? 'Schedule New Session' : 
               isEditMode ? 'Edit Session' : 'Session Details'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Session Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isViewMode}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 disabled:opacity-50"
                placeholder="Enter session title"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                disabled={isViewMode}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={isViewMode}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                disabled={isViewMode}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
              />
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                disabled={isViewMode}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
              />
              {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Poses Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select Poses
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePoses.map(pose => (
                <button
                  key={pose.id}
                  type="button"
                  onClick={() => !isViewMode && handlePoseToggle(pose.id)}
                  disabled={isViewMode}
                  className={`p-3 rounded-lg border transition-all text-left disabled:opacity-50 ${
                    formData.poses.includes(pose.id)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">{pose.name}</div>
                  <div className="text-xs opacity-70 capitalize">{pose.difficulty}</div>
                </button>
              ))}
            </div>
            {errors.poses && <p className="text-red-400 text-sm mt-1">{errors.poses}</p>}
          </div>

          {/* Recurring Options */}
          {!isViewMode && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring.enabled}
                  onChange={(e) => handleNestedChange('recurring', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-slate-300">
                  Make this a recurring session
                </label>
              </div>

              {formData.recurring.enabled && (
                <div className="space-y-4 pl-7">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Repeat Pattern
                      </label>
                      <select
                        value={formData.recurring.pattern}
                        onChange={(e) => handleNestedChange('recurring', 'pattern', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.recurring.endDate}
                        onChange={(e) => handleNestedChange('recurring', 'endDate', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
                      />
                      {errors.recurringEndDate && <p className="text-red-400 text-sm mt-1">{errors.recurringEndDate}</p>}
                    </div>
                  </div>

                  {formData.recurring.pattern === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Days of Week
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map(day => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => handleDayToggle(day.id)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              formData.recurring.daysOfWeek.includes(day.id)
                                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                                : 'bg-slate-700/30 border border-slate-600 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {day.short}
                          </button>
                        ))}
                      </div>
                      {errors.recurringDays && <p className="text-red-400 text-sm mt-1">{errors.recurringDays}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={isViewMode}
              rows="3"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 disabled:opacity-50 resize-none"
              placeholder="Add any notes or reminders..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
            <div className="flex items-center space-x-3">
              {session && session.status === 'scheduled' && (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  <span>Mark Complete</span>
                </button>
              )}
              
              {session && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
              
              {!isViewMode && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : 'Save Session'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionModal;
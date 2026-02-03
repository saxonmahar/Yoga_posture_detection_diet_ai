import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Clock, Target, Users,
  TrendingUp, CheckCircle, AlertCircle, Settings
} from 'lucide-react';
import Calendar from '../components/schedule/Calendar';
import SessionModal from '../components/schedule/SessionModal';
import { scheduleAPI } from '../services/api/schedule';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    completionRate: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  // Templates state
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Load schedule data
  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleAPI.getSchedule();
      
      if (response.success) {
        setSchedule(response.data.schedule);
        setTodaySessions(response.data.todaySessions);
        setUpcomingSessions(response.data.upcomingSessions);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Load schedule error:', error);
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  // Load templates
  const loadTemplates = async () => {
    try {
      const response = await scheduleAPI.getTemplates();
      if (response.success) {
        setTemplates(response.data.templates);
      }
    } catch (error) {
      console.error('Load templates error:', error);
    }
  };

  useEffect(() => {
    loadSchedule();
    loadTemplates();
  }, []);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle session click
  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setModalMode('view');
    setIsModalOpen(true);
  };

  // Handle create session
  const handleCreateSession = (date = null) => {
    setSelectedDate(date || new Date());
    setSelectedSession(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Handle edit session
  const handleEditSession = (session) => {
    setSelectedSession(session);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle save session
  const handleSaveSession = async (sessionData) => {
    try {
      if (modalMode === 'create') {
        await scheduleAPI.createSession(sessionData);
      } else if (modalMode === 'edit') {
        await scheduleAPI.updateSession(selectedSession._id, sessionData);
      }
      
      await loadSchedule(); // Refresh data
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save session error:', error);
      throw error;
    }
  };

  // Handle delete session
  const handleDeleteSession = async (sessionId) => {
    try {
      await scheduleAPI.deleteSession(sessionId);
      await loadSchedule(); // Refresh data
    } catch (error) {
      console.error('Delete session error:', error);
      throw error;
    }
  };

  // Handle complete session
  const handleCompleteSession = async (sessionId) => {
    try {
      await scheduleAPI.completeSession(sessionId, {
        accuracy: 85, // Default accuracy
        sessionData: {
          totalPoses: selectedSession?.poses?.length || 0,
          averageAccuracy: 85,
          duration: selectedSession?.duration || 30
        }
      });
      await loadSchedule(); // Refresh data
    } catch (error) {
      console.error('Complete session error:', error);
      throw error;
    }
  };

  // Handle apply template
  const handleApplyTemplate = async (templateId, startDate, customTime) => {
    try {
      await scheduleAPI.applyTemplate({
        templateId,
        startDate: startDate.toISOString(),
        customTime
      });
      await loadSchedule(); // Refresh data
      setShowTemplates(false);
    } catch (error) {
      console.error('Apply template error:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadSchedule}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Yoga Schedule
              </h1>
              <p className="text-slate-400">
                Plan and track your yoga sessions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button
                onClick={() => handleCreateSession()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-emerald-400">{stats.completedSessions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.completionRate}%</p>
                </div>
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Current Streak</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.currentStreak}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Calendar
              schedule={schedule}
              onDateSelect={handleDateSelect}
              onSessionClick={handleSessionClick}
              onCreateSession={handleCreateSession}
              selectedDate={selectedDate}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Sessions */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emerald-400" />
                Today's Sessions
              </h3>
              
              {todaySessions.length === 0 ? (
                <p className="text-slate-400 text-sm">No sessions scheduled for today</p>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => (
                    <div
                      key={session._id}
                      className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 cursor-pointer hover:bg-slate-600/30 transition-colors"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{session.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          session.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          session.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{session.time} • {session.duration}min</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400 mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{session.poses?.length || 0} poses</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-400" />
                Upcoming Sessions
              </h3>
              
              {upcomingSessions.length === 0 ? (
                <p className="text-slate-400 text-sm">No upcoming sessions</p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 cursor-pointer hover:bg-slate-600/30 transition-colors"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{session.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSession(session);
                          }}
                          className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(session.date).toLocaleDateString()} • {session.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400 mt-1">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="capitalize">{session.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Session Modal */}
        <SessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          session={selectedSession}
          selectedDate={selectedDate}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
          onComplete={handleCompleteSession}
          mode={modalMode}
        />

        {/* Templates Modal */}
        {showTemplates && (
          <TemplatesModal
            templates={templates}
            onClose={() => setShowTemplates(false)}
            onApply={handleApplyTemplate}
          />
        )}
      </div>
    </div>
  );
};

// Templates Modal Component
const TemplatesModal = ({ templates, onClose, onApply }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState('07:00');

  const handleApply = () => {
    if (selectedTemplate) {
      onApply(selectedTemplate.id, new Date(startDate), customTime);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Schedule Templates</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'bg-emerald-500/20 border-emerald-500/50'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{template.sessions} sessions/week</span>
                  <span className="text-slate-300">{template.duration}min each</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    template.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    template.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-white mb-3">Customize Schedule</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Preferred Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedTemplate}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
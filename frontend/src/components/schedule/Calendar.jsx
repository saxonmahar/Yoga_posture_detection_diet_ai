import { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Clock,
  CheckCircle, XCircle, Calendar as CalendarIcon
} from 'lucide-react';

const Calendar = ({ 
  schedule = [], 
  onDateSelect, 
  onSessionClick, 
  onCreateSession,
  selectedDate,
  view = 'month' 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Get sessions for a specific date
  const getSessionsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get status color for session
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'scheduled': return 'bg-blue-500';
      case 'missed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'scheduled': return Clock;
      case 'missed': return XCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <CalendarIcon className="w-6 h-6 mr-3 text-emerald-400" />
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors text-sm"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'This Month', value: schedule.filter(s => new Date(s.date).getMonth() === currentDate.getMonth()).length, color: 'text-blue-400' },
            { label: 'Completed', value: schedule.filter(s => s.status === 'completed').length, color: 'text-emerald-400' },
            { label: 'Scheduled', value: schedule.filter(s => s.status === 'scheduled').length, color: 'text-yellow-400' },
            { label: 'Missed', value: schedule.filter(s => s.status === 'missed').length, color: 'text-red-400' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 text-center text-slate-400 font-medium text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const sessions = getSessionsForDate(date);
            const isCurrentMonthDate = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);

            return (
              <div
                key={index}
                className={`relative min-h-[80px] p-2 border border-slate-700/30 rounded-lg cursor-pointer transition-all hover:bg-slate-700/30 ${
                  !isCurrentMonthDate ? 'opacity-40' : ''
                } ${
                  isTodayDate ? 'ring-2 ring-emerald-500/50 bg-emerald-500/10' : ''
                } ${
                  isSelectedDate ? 'bg-blue-500/20 border-blue-500/50' : ''
                }`}
                onClick={() => onDateSelect && onDateSelect(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Date Number */}
                <div className={`text-sm font-medium mb-1 ${
                  isTodayDate ? 'text-emerald-400' : 
                  isCurrentMonthDate ? 'text-white' : 'text-slate-500'
                }`}>
                  {date.getDate()}
                </div>

                {/* Sessions */}
                <div className="space-y-1">
                  {sessions.slice(0, 2).map((session, sessionIndex) => {
                    const StatusIcon = getStatusIcon(session.status);
                    return (
                      <div
                        key={sessionIndex}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs text-white ${getStatusColor(session.status)} cursor-pointer hover:opacity-80`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSessionClick && onSessionClick(session);
                        }}
                      >
                        <StatusIcon size={10} />
                        <span className="truncate">{session.time}</span>
                      </div>
                    );
                  })}
                  
                  {/* More sessions indicator */}
                  {sessions.length > 2 && (
                    <div className="text-xs text-slate-400 px-2">
                      +{sessions.length - 2} more
                    </div>
                  )}
                </div>

                {/* Add Session Button (on hover) */}
                {hoveredDate && hoveredDate.toDateString() === date.toDateString() && isCurrentMonthDate && (
                  <button
                    className="absolute top-1 right-1 p-1 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateSession && onCreateSession(date);
                    }}
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span className="text-slate-400">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-400">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-400">Missed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span className="text-slate-400">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, ArrowLeft, AlertCircle, CheckCircle, Info, 
  XCircle, Filter, Download, RefreshCw
} from 'lucide-react';

export default function AdminLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('all'); // all, error, warning, info, success
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setRefreshing(true);
    // Simulate fetching logs
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock log data
    const mockLogs = [
      {
        id: 1,
        type: 'success',
        message: 'User login successful',
        details: 'User: sanjaymahar2058@gmail.com logged in from 192.168.1.1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: 2,
        type: 'info',
        message: 'New user registration',
        details: 'User: john@example.com registered successfully',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 3,
        type: 'warning',
        message: 'High memory usage detected',
        details: 'Memory usage: 85% - Consider optimizing queries',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 4,
        type: 'error',
        message: 'Database connection timeout',
        details: 'Failed to connect to MongoDB after 3 retries',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 5,
        type: 'success',
        message: 'Yoga session completed',
        details: 'User completed 5 poses with 85% accuracy',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: 6,
        type: 'info',
        message: 'System backup completed',
        details: 'Database backup saved to /backups/2024-02-09.sql',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 7,
        type: 'error',
        message: 'Email service failure',
        details: 'SMTP connection refused - Check email configuration',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 8,
        type: 'warning',
        message: 'Slow API response',
        details: 'GET /api/users took 3.5s to respond',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ];

    setLogs(mockLogs);
    setRefreshing(false);
  };

  const filteredLogs = filterType === 'all' 
    ? logs 
    : logs.filter(log => log.type === filterType);

  const getLogIcon = (type) => {
    switch(type) {
      case 'error':
        return <XCircle className="text-red-400" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleExport = () => {
    alert('Exporting logs...\nThis will download logs as a CSV file.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">System Logs</h1>
              <p className="text-slate-400 text-sm">View system logs and errors</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchLogs}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-slate-400" size={20} />
            <h3 className="text-white font-semibold">Filter Logs</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilterType('error')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Errors ({logs.filter(l => l.type === 'error').length})
            </button>
            <button
              onClick={() => setFilterType('warning')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Warnings ({logs.filter(l => l.type === 'warning').length})
            </button>
            <button
              onClick={() => setFilterType('success')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Success ({logs.filter(l => l.type === 'success').length})
            </button>
            <button
              onClick={() => setFilterType('info')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'info'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Info ({logs.filter(l => l.type === 'info').length})
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
              <FileText size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No logs found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border ${getLogColor(log.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold">{log.message}</h3>
                      <span className="text-slate-500 text-sm">{getTimeAgo(log.timestamp)}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{log.details}</p>
                    <p className="text-slate-500 text-xs">
                      {log.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, XCircle, AlertTriangle, Home } from "lucide-react";
import api from "../services/api/client";

export default function SecurityConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const token = searchParams.get('token');
  const action = window.location.pathname.includes('/deny') ? 'deny' : 'confirm';

  useEffect(() => {
    if (!token) {
      setError("Invalid security link");
      setLoading(false);
      return;
    }

    handleSecurityAction();
  }, [token, action]);

  const handleSecurityAction = async () => {
    try {
      setLoading(true);
      
      const endpoint = action === 'deny' ? '/security/deny' : '/security/confirm';
      const response = await api.get(`${endpoint}?token=${token}`);
      
      if (response.data.success) {
        setResult({
          success: true,
          message: response.data.message,
          user: response.data.user,
          securityActions: response.data.securityActions
        });
      }
    } catch (err) {
      console.error('Security action error:', err);
      setError(err.response?.data?.message || 'Failed to process security action');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Processing security action...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg ${
            error ? 'bg-gradient-to-br from-red-500 to-red-600' :
            action === 'deny' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
            'bg-gradient-to-br from-emerald-500 to-cyan-500'
          }`}>
            {error ? <XCircle size={32} className="text-white" /> :
             action === 'deny' ? <AlertTriangle size={32} className="text-white" /> :
             <Shield size={32} className="text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-white">
            {error ? 'Security Error' :
             action === 'deny' ? 'Account Secured' :
             'Login Confirmed'}
          </h1>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/50">
          {error ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-red-400">{error}</p>
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors mx-auto"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>
          ) : result ? (
            <div className="text-center">
              <div className={`mb-6 p-4 rounded-lg border ${
                action === 'deny' 
                  ? 'bg-orange-500/10 border-orange-500/30' 
                  : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {action === 'deny' ? (
                  <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                )}
                <p className={action === 'deny' ? 'text-orange-400' : 'text-emerald-400'}>
                  {result.message}
                </p>
              </div>

              {result.user && (
                <p className="text-slate-300 mb-4">
                  Hello <strong>{result.user}</strong>!
                </p>
              )}

              {action === 'deny' && result.securityActions && (
                <div className="mb-6 p-4 bg-slate-700/30 rounded-lg text-left">
                  <h3 className="text-white font-semibold mb-3">Security Actions Taken:</h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    {result.securityActions.map((action, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {action === 'deny' && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-400 text-sm">
                    <strong>Important:</strong> Please change your password immediately and review your account security settings.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all shadow-lg"
                >
                  Go to Login
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          YogaAI Security Team - Keeping your account safe
        </p>
      </div>
    </div>
  );
}
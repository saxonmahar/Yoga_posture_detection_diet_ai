import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowRight, Download, Sparkles } from 'lucide-react';

function PaymentSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get payment details from URL params
  const oid = searchParams.get('oid');
  const amt = searchParams.get('amt');
  const refId = searchParams.get('refId');

  useEffect(() => {
    // Set premium status in localStorage
    if (user?._id || user?.id) {
      const userId = user._id || user.id;
      localStorage.setItem(`premium_${userId}`, 'true');
      localStorage.setItem(`premium_since_${userId}`, new Date().toISOString());
      localStorage.setItem(`premium_plan_${userId}`, amt === '6000' ? 'yearly' : 'monthly');
      console.log('✅ Premium status activated for user:', userId);
    }

    // Auto-redirect to Premium Dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/premium-dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, navigate, amt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/30 shadow-2xl text-center">
            
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Thank you for upgrading to Premium. Your payment has been processed successfully.
            </p>

            {/* Payment Details */}
            <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
              <div className="space-y-3 text-left">
                {oid && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-white font-mono">{oid}</span>
                  </div>
                )}
                {amt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-emerald-400 font-bold">Rs {amt}</span>
                  </div>
                )}
                {refId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference ID:</span>
                    <span className="text-white font-mono">{refId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-semibold">✓ Verified</span>
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 mb-8 border border-emerald-500/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                🎁 Premium Features Unlocked
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div>✓ Advanced AI Coaching</div>
                <div>✓ Custom Diet Plans</div>
                <div>✓ Live Yoga Classes</div>
                <div>✓ Priority Support</div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-500/20">
                <p className="text-emerald-400 text-sm font-semibold">
                  🚀 Redirecting to Premium Dashboard in 5 seconds...
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/premium-dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center group"
              >
                Go to Premium Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => window.print()}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all border border-slate-600/50 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </button>
            </div>

            {/* Support */}
            <p className="text-slate-500 text-sm mt-8">
              Need help? Contact us at{' '}
              <a href="mailto:support@yogaai.com" className="text-emerald-400 hover:text-emerald-300">
                support@yogaai.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;

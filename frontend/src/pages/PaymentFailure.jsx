import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';

function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-red-500/30 shadow-2xl text-center">
            
            {/* Error Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/30">
              <XCircle className="w-12 h-12 text-white" />
            </div>

            {/* Error Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              We couldn't process your payment. Don't worry, no charges were made to your account.
            </p>

            {/* Common Reasons */}
            <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-700/50 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Common Reasons:</h3>
              <ul className="space-y-2 text-slate-400">
                <li>• Insufficient balance in your account</li>
                <li>• Payment was cancelled by user</li>
                <li>• Network connection issue</li>
                <li>• Incorrect payment credentials</li>
                <li>• Transaction timeout</li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 mb-8 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">💡 What to do next?</h3>
              <p className="text-slate-300 text-sm">
                Check your account balance and try again. If the problem persists, 
                please contact our support team for assistance.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/premium')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center group"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold text-white transition-all border border-slate-600/50 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
            </div>

            {/* Support */}
            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <p className="text-slate-400 mb-4">Need help with your payment?</p>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl font-semibold text-blue-400 transition-all border border-blue-500/30"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;

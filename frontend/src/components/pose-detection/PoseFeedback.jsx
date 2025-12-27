// components/pose-detection/PoseFeedback.jsx
import React from 'react';
import { CheckCircle, AlertCircle, Info, Target, Zap } from 'lucide-react';

const PoseFeedback = ({ corrections, poseName, confidence }) => {
  // If no corrections, show positive feedback
  if (!corrections || corrections.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Perfect Form! 🎉</h3>
        </div>
        <p className="text-slate-300 mb-3">
          Your <span className="font-bold text-emerald-300">{poseName}</span> form is excellent! 
          You've achieved <span className="font-bold">{Math.round(confidence * 100)}%</span> accuracy.
        </p>
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Zap className="w-4 h-4" />
          <span>Keep up the great work! Maintain this pose for 30-60 seconds.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-amber-400" />
        AI Feedback & Corrections
      </h3>
      
      <div className="space-y-4">
        {corrections.map((correction, index) => (
          <div 
            key={correction.id || index}
            className={`p-4 rounded-xl border transition-all ${
              correction.severity === 'low' 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : correction.severity === 'medium'
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                correction.severity === 'low' 
                  ? 'bg-emerald-500/20' 
                  : correction.severity === 'medium'
                  ? 'bg-amber-500/20'
                  : 'bg-red-500/20'
              }`}>
                {correction.severity === 'low' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : correction.severity === 'medium' ? (
                  <Info className="w-5 h-5 text-amber-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">
                    {correction.icon || '🎯'} {correction.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    correction.severity === 'low' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : correction.severity === 'medium'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {correction.severity === 'low' ? 'Low Priority' : 
                     correction.severity === 'medium' ? 'Medium Priority' : 'High Priority'}
                  </span>
                </div>
                <p className="text-slate-300 mb-3">{correction.message}</p>
                {correction.suggestion && (
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400 font-medium mb-1">Suggestion:</p>
                    <p className="text-slate-300">{correction.suggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <div>
            <h4 className="font-medium text-white mb-1">Pro Tip</h4>
            <p className="text-sm text-slate-300">
              Focus on one correction at a time. Start with high priority items and work your way down.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseFeedback;
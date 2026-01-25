// components/pose-detection/PoseFeedback.jsx
import React from 'react';
import { CheckCircle, AlertCircle, Info, Target, Zap, Award, TrendingUp } from 'lucide-react';

const PoseFeedback = ({ corrections, poseName, confidence, result }) => {
  // Extract professional feedback data
  const accuracyScore = result?.accuracy_score || (confidence * 100);
  const angles = result?.angles || {};
  const isCorrect = result?.is_correct || accuracyScore >= 70;
  const feedback = result?.feedback || corrections?.map(c => c.message) || [];
  
  // If no corrections and good accuracy, show positive feedback
  if ((!corrections || corrections.length === 0) && isCorrect) {
    return (
      <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Perfect Professional Form! 🎉</h3>
        </div>
        <p className="text-slate-300 mb-3">
          Your <span className="font-bold text-emerald-300">{poseName}</span> demonstrates excellent technique! 
          Professional AI analysis shows <span className="font-bold">{Math.round(accuracyScore)}%</span> accuracy.
        </p>
        
        {/* Professional Analysis Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-emerald-500/10 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Angle Analysis</span>
            </div>
            <p className="text-xs text-slate-300">All joint angles within optimal range</p>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Form Score</span>
            </div>
            <p className="text-xs text-slate-300">Professional level alignment achieved</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Zap className="w-4 h-4" />
          <span>Maintain this excellent form for 30-60 seconds for maximum benefit!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          Professional AI Analysis & Corrections
        </h3>
        <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
          {Math.round(accuracyScore)}% Accuracy
        </div>
      </div>
      
      {/* Professional Angle Analysis */}
      {angles && angles.user_angles && angles.target_angles && (
        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Joint Angle Analysis
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {angles.angle_names?.slice(0, 8).map((angleName, index) => {
              const userAngle = angles.user_angles[index];
              const targetAngle = angles.target_angles[index];
              const difference = Math.abs(userAngle - targetAngle);
              const isGood = difference <= 15;
              
              return (
                <div key={index} className={`p-2 rounded-lg text-center ${
                  isGood ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <p className="text-xs text-slate-400 mb-1">{angleName.replace('_', ' ')}</p>
                  <p className={`text-sm font-semibold ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                    {userAngle}°
                  </p>
                  <p className="text-xs text-slate-500">Target: {targetAngle}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Corrections and Feedback */}
      <div className="space-y-4">
        {corrections && corrections.length > 0 ? (
          corrections.map((correction, index) => (
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
                      {correction.severity === 'low' ? 'Good' : 
                       correction.severity === 'medium' ? 'Adjust' : 'Fix Now'}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{correction.message}</p>
                  {correction.suggestion && (
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-slate-400 font-medium mb-1">Professional Tip:</p>
                      <p className="text-slate-300">{correction.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show feedback messages if no structured corrections
          feedback.length > 0 && (
            <div className="space-y-3">
              {feedback.map((message, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300">{message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      
      {/* Professional Tips */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <h4 className="font-medium text-white">Professional Training Tips</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Focus on one correction at a time for best results</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Red circles on video show joints needing attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Breathe deeply and move slowly into corrections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span>Professional analysis updates in real-time</span>
          </div>
        </div>
      </div>
      
      {/* Accuracy Progress */}
      <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Professional Form Score</span>
          <span className="text-sm font-semibold text-white">{Math.round(accuracyScore)}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              accuracyScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
              accuracyScore >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, accuracyScore))}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {accuracyScore >= 80 ? 'Professional level form!' :
           accuracyScore >= 60 ? 'Good form, minor adjustments needed' :
           'Focus on the corrections above to improve'}
        </p>
      </div>
    </div>
  );
};

export default PoseFeedback;
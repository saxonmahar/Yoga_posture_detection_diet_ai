import React from 'react';
import { Users, MessageCircle, Trophy, Target, Heart } from 'lucide-react';

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-emerald-400 mb-6 border border-emerald-500/30 backdrop-blur-sm">
            <Users className="w-4 h-4 mr-2" />
            WELLNESS COMMUNITY
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Connect with{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Fellow Yogis
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Join thousands of wellness enthusiasts sharing their journey, celebrating achievements, 
            and supporting each other on the path to better health.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { number: '12.5K+', label: 'Active Members', icon: Users },
            { number: '45K+', label: 'Posts Shared', icon: MessageCircle },
            { number: '89%', label: 'Success Rate', icon: Trophy },
            { number: '24/7', label: 'Community Support', icon: Heart }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Community Features{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h3>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            We're building an amazing community platform where you can share your progress, 
            participate in challenges, and connect with fellow wellness enthusiasts.
          </p>
          
          {/* Feature Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-700/30 rounded-2xl p-6">
              <MessageCircle className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Community Feed</h4>
              <p className="text-slate-400 text-sm">Share your progress and connect with others</p>
            </div>
            <div className="bg-slate-700/30 rounded-2xl p-6">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Challenges</h4>
              <p className="text-slate-400 text-sm">Join group challenges and earn rewards</p>
            </div>
            <div className="bg-slate-700/30 rounded-2xl p-6">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Leaderboards</h4>
              <p className="text-slate-400 text-sm">Compete with friends and track rankings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
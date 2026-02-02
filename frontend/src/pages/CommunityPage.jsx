import React, { useState, useEffect } from 'react';
import { 
  Users, MessageCircle, Trophy, Target, Heart, Crown, Star, 
  Medal, Award, Flame, Calendar, TrendingUp, User, Settings,
  MoreHorizontal, ThumbsUp, Share2, BookOpen, Activity, Plus,
  UserPlus, UserCheck, UserX, Edit3, Camera, Gift, Zap,
  Facebook, Twitter, Instagram, Linkedin, Globe, MapPin,
  Clock, CheckCircle, XCircle, Play, Pause, RotateCcw,
  Filter, Search, Bell, Send, Image, Video, Smile
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [postContent, setPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  // Enhanced mock data with social features
  const mockUsers = [
    {
      id: 1,
      name: 'Sarah Chen',
      username: '@sarahyogi',
      avatar: '/api/placeholder/40/40',
      coverImage: '/api/placeholder/800/200',
      level: 'Advanced',
      streak: 45,
      totalSessions: 234,
      achievements: 12,
      points: 2840,
      rank: 1,
      location: 'San Francisco, CA',
      joinedDate: '2023-08-15',
      badges: ['streak-master', 'pose-perfectionist', 'community-helper'],
      friends: 156,
      following: 89,
      followers: 234,
      bio: 'Yoga instructor & wellness coach. Spreading mindfulness one pose at a time 🧘‍♀️',
      socialLinks: {
        instagram: 'sarahyogi',
        twitter: 'sarahyogi',
        website: 'sarahyoga.com'
      },
      isOnline: true,
      lastActive: 'Active now',
      friendStatus: 'friends'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      username: '@mikefitness',
      avatar: '/api/placeholder/40/40',
      coverImage: '/api/placeholder/800/200',
      level: 'Intermediate',
      streak: 28,
      totalSessions: 156,
      achievements: 8,
      points: 1920,
      rank: 2,
      location: 'New York, NY',
      joinedDate: '2023-09-22',
      badges: ['consistency-king', 'early-bird'],
      friends: 89,
      following: 45,
      followers: 123,
      bio: 'Fitness enthusiast exploring the world of yoga. Always up for a challenge! 💪',
      socialLinks: {
        linkedin: 'mikejohnson',
        instagram: 'mikefitness'
      },
      isOnline: false,
      lastActive: '2 hours ago',
      friendStatus: 'pending'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      username: '@emmawellness',
      avatar: '/api/placeholder/40/40',
      coverImage: '/api/placeholder/800/200',
      level: 'Advanced',
      streak: 33,
      totalSessions: 189,
      achievements: 10,
      points: 1850,
      rank: 3,
      location: 'London, UK',
      joinedDate: '2023-07-10',
      badges: ['flexibility-master', 'zen-warrior'],
      friends: 201,
      following: 67,
      followers: 189,
      bio: 'Mindfulness coach & yoga teacher. Creating balance in body and mind ✨',
      socialLinks: {
        website: 'emmawellness.co.uk',
        facebook: 'emmawellness'
      },
      isOnline: true,
      lastActive: 'Active now',
      friendStatus: 'not_friends'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      username: '@alexzen',
      avatar: '/api/placeholder/40/40',
      coverImage: '/api/placeholder/800/200',
      level: 'Beginner',
      streak: 12,
      totalSessions: 45,
      achievements: 4,
      points: 680,
      rank: 4,
      location: 'Madrid, Spain',
      joinedDate: '2024-01-05',
      badges: ['newcomer', 'dedicated-learner'],
      friends: 23,
      following: 34,
      followers: 45,
      bio: 'New to yoga but loving the journey! Learning something new every day 🌱',
      socialLinks: {
        twitter: 'alexzen',
        instagram: 'alexzen'
      },
      isOnline: false,
      lastActive: '1 day ago',
      friendStatus: 'not_friends'
    },
    {
      id: 5,
      name: user?.name || 'You',
      username: '@' + (user?.name?.toLowerCase().replace(' ', '') || 'you'),
      avatar: '/api/placeholder/40/40',
      coverImage: '/api/placeholder/800/200',
      level: 'Intermediate',
      streak: 15,
      totalSessions: 67,
      achievements: 6,
      points: 1240,
      rank: 5,
      location: 'Your City',
      joinedDate: '2023-11-20',
      badges: ['rising-star', 'consistent-practice'],
      friends: 45,
      following: 23,
      followers: 67,
      bio: 'On a wellness journey, one breath at a time 🧘‍♂️',
      socialLinks: {
        instagram: 'yourhandle',
        twitter: 'yourhandle'
      },
      isOnline: true,
      lastActive: 'Active now',
      isCurrentUser: true,
      friendStatus: 'self'
    }
  ];

  // Active challenges
  const activeChallenges = [
    {
      id: 1,
      title: '30-Day Flexibility Challenge',
      description: 'Improve your flexibility with daily stretching routines',
      participants: 1247,
      duration: '30 days',
      difficulty: 'Intermediate',
      reward: '500 points + Flexibility Master badge',
      startDate: '2024-02-01',
      endDate: '2024-03-02',
      progress: 45,
      isJoined: true,
      category: 'flexibility',
      dailyGoal: 'Complete 15-minute flexibility routine',
      icon: Activity,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      title: 'Morning Warrior Challenge',
      description: 'Start your day with energizing yoga sequences',
      participants: 892,
      duration: '21 days',
      difficulty: 'Beginner',
      reward: '300 points + Early Bird badge',
      startDate: '2024-02-05',
      endDate: '2024-02-26',
      progress: 0,
      isJoined: false,
      category: 'morning',
      dailyGoal: 'Complete morning yoga before 9 AM',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      title: 'Balance Master Quest',
      description: 'Master challenging balance poses and improve stability',
      participants: 634,
      duration: '14 days',
      difficulty: 'Advanced',
      reward: '400 points + Balance Master badge',
      startDate: '2024-02-10',
      endDate: '2024-02-24',
      progress: 0,
      isJoined: false,
      category: 'balance',
      dailyGoal: 'Hold tree pose for 60 seconds',
      icon: Target,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Mindfulness Meditation',
      description: 'Combine yoga with daily meditation practice',
      participants: 1156,
      duration: '28 days',
      difficulty: 'All Levels',
      reward: '350 points + Zen Master badge',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      progress: 0,
      isJoined: false,
      category: 'meditation',
      dailyGoal: '10 minutes meditation + yoga',
      icon: Heart,
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  // Friend requests
  const mockFriendRequests = [
    {
      id: 1,
      user: mockUsers[1],
      timestamp: '2 hours ago',
      mutualFriends: 5
    },
    {
      id: 2,
      user: mockUsers[3],
      timestamp: '1 day ago',
      mutualFriends: 2
    }
  ];

  const mockPosts = [
    {
      id: 1,
      user: mockUsers[0],
      content: "Just completed my 45-day streak! 🔥 The Tree Pose is finally feeling natural. Thanks to this amazing community for the motivation!",
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      image: '/api/placeholder/300/200',
      achievement: 'streak-master',
      isLiked: false,
      location: 'Home Studio'
    },
    {
      id: 2,
      user: mockUsers[1],
      content: "Morning yoga session done! ☀️ Started with some gentle stretches and ended with a challenging Warrior II sequence. Feeling energized for the day ahead!",
      timestamp: '4 hours ago',
      likes: 18,
      comments: 5,
      shares: 2,
      isLiked: true,
      tags: ['#morningyoga', '#warrior2', '#energized']
    },
    {
      id: 3,
      user: mockUsers[2],
      content: "Achieved 95% accuracy in Downward Dog today! 🧘‍♀️ The key was focusing on proper hand placement and core engagement. Small improvements every day!",
      timestamp: '6 hours ago',
      likes: 31,
      comments: 12,
      shares: 5,
      achievement: 'pose-perfectionist',
      isLiked: false,
      video: true
    }
  ];

  // Enhanced achievements with more details
  const achievements = [
    { 
      id: 'streak-master', 
      name: 'Streak Master', 
      description: 'Maintain a 30+ day practice streak', 
      icon: Flame, 
      color: 'from-orange-500 to-red-500', 
      rarity: 'epic',
      points: 500,
      unlockedBy: 1247,
      category: 'consistency'
    },
    { 
      id: 'pose-perfectionist', 
      name: 'Pose Perfectionist', 
      description: 'Achieve 95%+ accuracy in any pose', 
      icon: Target, 
      color: 'from-blue-500 to-cyan-500', 
      rarity: 'rare',
      points: 300,
      unlockedBy: 892,
      category: 'skill'
    },
    { 
      id: 'community-helper', 
      name: 'Community Helper', 
      description: 'Help 10+ community members', 
      icon: Heart, 
      color: 'from-pink-500 to-rose-500', 
      rarity: 'uncommon',
      points: 200,
      unlockedBy: 634,
      category: 'social'
    },
    { 
      id: 'consistency-king', 
      name: 'Consistency King', 
      description: 'Complete 100+ yoga sessions', 
      icon: Crown, 
      color: 'from-yellow-500 to-orange-500', 
      rarity: 'legendary',
      points: 750,
      unlockedBy: 234,
      category: 'milestone'
    },
    { 
      id: 'early-bird', 
      name: 'Early Bird', 
      description: 'Complete 20 morning sessions', 
      icon: Star, 
      color: 'from-emerald-500 to-teal-500', 
      rarity: 'common',
      points: 150,
      unlockedBy: 1567,
      category: 'timing'
    },
    { 
      id: 'flexibility-master', 
      name: 'Flexibility Master', 
      description: 'Master all flexibility poses', 
      icon: Activity, 
      color: 'from-purple-500 to-indigo-500', 
      rarity: 'epic',
      points: 600,
      unlockedBy: 445,
      category: 'skill'
    },
    { 
      id: 'zen-warrior', 
      name: 'Zen Warrior', 
      description: 'Complete mindfulness challenges', 
      icon: Medal, 
      color: 'from-indigo-500 to-purple-500', 
      rarity: 'rare',
      points: 400,
      unlockedBy: 723,
      category: 'mindfulness'
    },
    { 
      id: 'newcomer', 
      name: 'Newcomer', 
      description: 'Welcome to the community!', 
      icon: User, 
      color: 'from-slate-500 to-slate-600', 
      rarity: 'common',
      points: 50,
      unlockedBy: 5234,
      category: 'welcome'
    },
    { 
      id: 'dedicated-learner', 
      name: 'Dedicated Learner', 
      description: 'Complete 30 learning sessions', 
      icon: BookOpen, 
      color: 'from-green-500 to-emerald-500', 
      rarity: 'uncommon',
      points: 250,
      unlockedBy: 1123,
      category: 'learning'
    },
    { 
      id: 'rising-star', 
      name: 'Rising Star', 
      description: 'Show rapid improvement', 
      icon: TrendingUp, 
      color: 'from-cyan-500 to-blue-500', 
      rarity: 'rare',
      points: 350,
      unlockedBy: 567,
      category: 'progress'
    },
    { 
      id: 'consistent-practice', 
      name: 'Consistent Practice', 
      description: 'Practice regularly for 2 weeks', 
      icon: Calendar, 
      color: 'from-teal-500 to-cyan-500', 
      rarity: 'uncommon',
      points: 200,
      unlockedBy: 1789,
      category: 'consistency'
    }
  ];

  // Helper functions
  const handleFriendAction = (userId, action) => {
    console.log(`${action} friend request for user ${userId}`);
    // In real app, this would make API call
  };

  const handleJoinChallenge = (challengeId) => {
    console.log(`Joining challenge ${challengeId}`);
    // In real app, this would make API call
    setSelectedChallenge(challengeId);
  };

  const handleCreatePost = () => {
    if (postContent.trim()) {
      console.log('Creating post:', postContent);
      setPostContent('');
      setShowCreatePost(false);
      // In real app, this would make API call
    }
  };

  const handleSocialShare = (platform, content) => {
    console.log(`Sharing to ${platform}:`, content);
    // In real app, this would integrate with social media APIs
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-400';
      case 'epic': return 'from-purple-400 to-pink-400';
      case 'rare': return 'from-blue-400 to-cyan-400';
      case 'uncommon': return 'from-green-400 to-emerald-400';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const renderUserProfile = (userData) => (
    <div className={`bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl ${userData.isCurrentUser ? 'ring-2 ring-emerald-500/30' : ''}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {userData.name.charAt(0)}
          </div>
          {userData.rank <= 3 && (
            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              userData.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
              userData.rank === 2 ? 'bg-slate-400 text-slate-900' :
              'bg-orange-600 text-orange-100'
            }`}>
              {userData.rank}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white">{userData.name}</h3>
            {userData.isCurrentUser && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                You
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">{userData.level} • {userData.location}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">#{userData.rank}</div>
          <div className="text-xs text-slate-400">Rank</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{userData.streak}</div>
          <div className="text-xs text-slate-400">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{userData.totalSessions}</div>
          <div className="text-xs text-slate-400">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{userData.achievements}</div>
          <div className="text-xs text-slate-400">Achievements</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{userData.points}</div>
          <div className="text-xs text-slate-400">Points</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {userData.badges.slice(0, 3).map((badgeId) => {
          const achievement = achievements.find(a => a.id === badgeId);
          if (!achievement) return null;
          const Icon = achievement.icon;
          return (
            <div
              key={badgeId}
              className={`flex items-center space-x-1 px-2 py-1 bg-gradient-to-r ${achievement.color} rounded-full text-white text-xs`}
              title={achievement.description}
            >
              <Icon size={12} />
              <span>{achievement.name}</span>
            </div>
          );
        })}
        {userData.badges.length > 3 && (
          <div className="px-2 py-1 bg-slate-600 rounded-full text-white text-xs">
            +{userData.badges.length - 3} more
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 px-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
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

        {/* Enhanced Navigation - Horizontal Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Activity, color: 'from-slate-600 to-slate-700', description: 'Dashboard view' },
            { id: 'profile', label: 'My Profile', icon: User, color: 'from-emerald-500 to-teal-500', description: 'View your stats' },
            { id: 'challenges', label: 'Challenges', icon: Target, color: 'from-purple-500 to-pink-500', description: 'Join challenges' },
            { id: 'leaderboard', label: 'Rankings', icon: Trophy, color: 'from-yellow-500 to-orange-500', description: 'Top performers' },
            { id: 'achievements', label: 'Badges', icon: Award, color: 'from-indigo-500 to-purple-500', description: 'Your achievements' },
            { id: 'friends', label: 'Friends', icon: Users, color: 'from-pink-500 to-rose-500', description: 'Connect with others' }
          ].map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-br ${section.color} text-white shadow-lg shadow-${section.color.split('-')[1]}-500/25 border-transparent`
                    : 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                  }`}>
                    <Icon size={24} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                  </div>
                  <h3 className={`font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {section.label}
                  </h3>
                  <p className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {section.description}
                  </p>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto">
            {/* Quick Stats Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <User size={24} />
                  <span className="text-emerald-100 text-sm">Your Rank</span>
                </div>
                <div className="text-3xl font-bold mb-1">#{mockUsers.find(u => u.isCurrentUser)?.rank}</div>
                <div className="text-emerald-100 text-sm">Global Ranking</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Target size={24} />
                  <span className="text-purple-100 text-sm">Active</span>
                </div>
                <div className="text-3xl font-bold mb-1">{activeChallenges.filter(c => c.isJoined).length}</div>
                <div className="text-purple-100 text-sm">Challenges</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Users size={24} />
                  <span className="text-blue-100 text-sm">Connected</span>
                </div>
                <div className="text-3xl font-bold mb-1">{mockUsers.find(u => u.isCurrentUser)?.friends}</div>
                <div className="text-blue-100 text-sm">Friends</div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Award size={24} />
                  <span className="text-yellow-100 text-sm">Earned</span>
                </div>
                <div className="text-3xl font-bold mb-1">{mockUsers.find(u => u.isCurrentUser)?.achievements}</div>
                <div className="text-yellow-100 text-sm">Achievements</div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Profile & Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                {/* Profile Summary Card */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {(user?.name || 'You').charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'Your Name'}</h2>
                      <p className="text-emerald-400 mb-2">@{user?.name?.toLowerCase().replace(' ', '') || 'username'}</p>
                      <p className="text-slate-400">On a wellness journey, one breath at a time 🧘‍♂️</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all"
                    >
                      View Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6">
                    {[
                      { label: 'Streak', value: `${mockUsers.find(u => u.isCurrentUser)?.streak} days`, color: 'text-orange-400' },
                      { label: 'Sessions', value: mockUsers.find(u => u.isCurrentUser)?.totalSessions, color: 'text-cyan-400' },
                      { label: 'Points', value: mockUsers.find(u => u.isCurrentUser)?.points, color: 'text-emerald-400' },
                      { label: 'Level', value: mockUsers.find(u => u.isCurrentUser)?.level, color: 'text-purple-400' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className={`text-xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                        <div className="text-slate-400 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Community Posts */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Community Activity</h3>
                    <button 
                      onClick={() => setActiveTab('feed')}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {mockPosts.slice(0, 2).map((post) => (
                      <div key={post.id} className="p-4 bg-slate-700/30 rounded-xl">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {post.user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{post.user.name}</h4>
                            <p className="text-slate-400 text-sm">{post.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{post.content.substring(0, 120)}...</p>
                        <div className="flex items-center space-x-4 mt-3 text-slate-400 text-sm">
                          <span className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle size={14} />
                            <span>{post.comments}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Actions & Stats */}
              <div className="space-y-6">
                {/* Active Challenges */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Active Challenges</h3>
                    <button 
                      onClick={() => setActiveTab('challenges')}
                      className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activeChallenges.filter(c => c.isJoined).slice(0, 2).map((challenge) => {
                      const Icon = challenge.icon;
                      return (
                        <div key={challenge.id} className="p-3 bg-slate-700/30 rounded-xl">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${challenge.color}`}>
                              <Icon size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white text-sm">{challenge.title}</h4>
                              <p className="text-slate-400 text-xs">{challenge.duration}</p>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-emerald-400">{challenge.progress}%</span>
                            </div>
                            <div className="bg-slate-600/50 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${challenge.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${challenge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Friends */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Top Friends</h3>
                    <button 
                      onClick={() => setActiveTab('friends')}
                      className="text-pink-400 hover:text-pink-300 transition-colors text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockUsers.filter(u => !u.isCurrentUser && u.isOnline).slice(0, 3).map((friend) => (
                      <div key={friend.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {friend.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-slate-800"></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{friend.name}</div>
                          <div className="text-emerald-400 text-xs">Online now</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-400 text-xs">#{friend.rank}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Badges</h3>
                    <button 
                      onClick={() => setActiveTab('achievements')}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {mockUsers.find(u => u.isCurrentUser)?.badges.slice(0, 3).map((badgeId) => {
                      const achievement = achievements.find(a => a.id === badgeId);
                      if (!achievement) return null;
                      const Icon = achievement.icon;
                      return (
                        <div key={badgeId} className="text-center p-3 bg-slate-700/30 rounded-xl">
                          <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center bg-gradient-to-br ${achievement.color}`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <h4 className="font-medium text-white text-xs">{achievement.name}</h4>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Your Profile</h2>
              <p className="text-slate-400">Manage your profile, track progress, and showcase achievements</p>
            </div>
            {renderUserProfile(mockUsers.find(u => u.isCurrentUser))}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Community Feed</h2>
              <p className="text-slate-400">Share your journey and connect with fellow yogis</p>
            </div>
            <div className="space-y-6">
              {mockPosts.map((post) => (
                <div key={post.id} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white">{post.user.name}</h3>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-400 text-sm">{post.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{post.user.level}</p>
                    </div>
                  </div>
                  <p className="text-white mb-4">{post.content}</p>
                  <div className="flex items-center space-x-6 pt-4 border-t border-slate-700">
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors">
                      <Heart size={18} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors">
                      <MessageCircle size={18} />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-purple-400 transition-colors">
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Community Challenges</h2>
              <p className="text-slate-400">Join challenges to earn points and unlock achievements</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((challenge) => {
                const Icon = challenge.icon;
                return (
                  <div key={challenge.id} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                    <div className={`p-6 bg-gradient-to-r ${challenge.color}`}>
                      <div className="flex items-center justify-between mb-4">
                        <Icon size={24} className="text-white" />
                        <span className="text-white font-bold">{challenge.participants} participants</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                      <p className="text-white/90 text-sm">{challenge.description}</p>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="text-slate-400 text-sm">Reward</div>
                        <div className="text-emerald-400 font-medium">{challenge.reward}</div>
                      </div>
                      <button 
                        onClick={() => challenge.isJoined ? navigate('/pose-detection') : handleJoinChallenge(challenge.id)}
                        className={`w-full py-3 rounded-xl font-medium transition-all ${
                          challenge.isJoined 
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600'
                            : 'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                        }`}
                      >
                        {challenge.isJoined ? 'Continue Challenge' : 'Join Challenge'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">Community Leaderboard</h2>
              </div>
              <div className="divide-y divide-slate-700">
                {mockUsers.map((userData) => (
                  <div key={userData.id} className={`p-6 hover:bg-slate-700/30 transition-colors ${userData.isCurrentUser ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : ''}`}>
                    <div className="flex items-center space-x-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        userData.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-yellow-900' :
                        userData.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                        userData.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-red-400 text-orange-100' :
                        'bg-slate-600 text-white'
                      }`}>
                        {userData.rank <= 3 ? (
                          userData.rank === 1 ? <Crown size={20} /> :
                          userData.rank === 2 ? <Medal size={20} /> :
                          <Award size={20} />
                        ) : userData.rank}
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {userData.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-white">{userData.name}</h3>
                          {userData.isCurrentUser && (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400">{userData.level}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-xl font-bold text-emerald-400">{userData.points}</div>
                          <div className="text-xs text-slate-400">Points</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{userData.streak}</div>
                          <div className="text-xs text-slate-400">Streak</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{userData.totalSessions}</div>
                          <div className="text-xs text-slate-400">Sessions</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{userData.achievements}</div>
                          <div className="text-xs text-slate-400">Achievements</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Achievement Gallery</h2>
              <p className="text-slate-400">Unlock badges by completing challenges and reaching milestones</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const isUnlocked = mockUsers.find(u => u.isCurrentUser)?.badges.includes(achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={`bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl transition-all hover:scale-105 ${
                      isUnlocked ? 'ring-2 ring-emerald-500/30' : 'opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                        isUnlocked ? achievement.color : 'from-slate-600 to-slate-700'
                      } shadow-lg`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      
                      <h3 className={`font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.name}
                      </h3>
                      
                      <p className={`text-sm mb-3 ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                        {achievement.description}
                      </p>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </div>
                      
                      {isUnlocked && (
                        <div className="mt-3 flex items-center justify-center space-x-1 text-emerald-400">
                          <Trophy size={14} />
                          <span className="text-xs font-medium">Unlocked</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Friends & Connections</h2>
              <p className="text-slate-400">Connect with fellow yogis and build your wellness community</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUsers.filter(u => !u.isCurrentUser).map((friend) => (
                <div key={friend.id} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {friend.name.charAt(0)}
                      </div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{friend.name}</h4>
                      <p className="text-slate-400 text-sm">{friend.username}</p>
                      <p className="text-slate-500 text-xs">{friend.lastActive}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div>
                      <div className="text-emerald-400 font-bold">{friend.rank}</div>
                      <div className="text-slate-400 text-xs">Rank</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-bold">{friend.streak}</div>
                      <div className="text-slate-400 text-xs">Streak</div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold">{friend.points}</div>
                      <div className="text-slate-400 text-xs">Points</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                      Message
                    </button>
                    <button className="flex-1 py-2 bg-slate-600/50 text-white rounded-lg text-sm font-medium hover:bg-slate-500/50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedPage, AnimatedCard } from '../animations/framer-config';

const SettingsPage = ({ user, onNavigate }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Notification settings
    yogaReminders: true,
    dietUpdates: true,
    progressReports: true,
    newFeatures: false,
    marketingEmails: false,
    weeklySummary: true,
    
    // Display settings
    theme: 'dark',
    language: 'en',
    units: 'metric',
    timeFormat: '24h',
    
    // Privacy settings
    autoSave: true,
    dataSharing: false,
    analytics: true,
    
    // Performance settings
    videoQuality: 'high',
    detectionSpeed: 'balanced',
    cacheData: true,
    
    // Account settings
    twoFactorAuth: false,
    emailVerified: true,
  });

  const [activeSection, setActiveSection] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('yogaai-settings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 500);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaults = {
        yogaReminders: true,
        dietUpdates: true,
        progressReports: true,
        newFeatures: false,
        marketingEmails: false,
        weeklySummary: true,
        theme: 'dark',
        language: 'en',
        units: 'metric',
        timeFormat: '24h',
        autoSave: true,
        dataSharing: false,
        analytics: true,
        videoQuality: 'high',
        detectionSpeed: 'balanced',
        cacheData: true,
        twoFactorAuth: false,
        emailVerified: true,
      };
      setSettings(defaults);
      localStorage.setItem('yogaai-settings', JSON.stringify(defaults));
      setSaveMessage('Settings reset to defaults!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const sections = [
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'display', icon: '🎨', label: 'Display' },
    { id: 'privacy', icon: '🔒', label: 'Privacy' },
    { id: 'performance', icon: '⚡', label: 'Performance' },
    { id: 'account', icon: '👤', label: 'Account' },
  ];

  return (
    <AnimatedPage transition="fade">
      <div className="min-h-screen bg-gradient-to-b from-background to-surface p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  Settings
                </h1>
                <p className="text-text-muted">
                  Customize your YogaAI experience and preferences
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {saveMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400">{saveMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Navigation */}
            <div className="lg:col-span-1">
              <AnimatedCard>
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h3 className="font-semibold mb-4">Settings Categories</h3>
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                          activeSection === section.id
                            ? 'bg-primary/20 text-primary'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="text-xl">{section.icon}</span>
                        <span>{section.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="font-semibold mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                      </button>
                      <button
                        onClick={handleResetSettings}
                        className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        Reset to Defaults
                      </button>
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Right Column - Settings Content */}
            <div className="lg:col-span-3">
              <AnimatedCard>
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">
                      {sections.find(s => s.id === activeSection)?.icon}
                    </span>
                    <h2 className="text-2xl font-bold">
                      {sections.find(s => s.id === activeSection)?.label}
                    </h2>
                  </div>

                  {/* Notifications Settings */}
                  {activeSection === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Yoga Session Reminders', setting: 'yogaReminders' },
                            { label: 'Diet Plan Updates', setting: 'dietUpdates' },
                            { label: 'Progress Reports', setting: 'progressReports' },
                            { label: 'New Features & Updates', setting: 'newFeatures' },
                            { label: 'Marketing Emails', setting: 'marketingEmails' },
                            { label: 'Weekly Summary', setting: 'weeklySummary' },
                          ].map((item) => (
                            <label key={item.setting} className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                              <span>{item.label}</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={settings[item.setting]}
                                  onChange={(e) => handleSettingChange(item.setting, e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors ${
                                  settings[item.setting]
                                    ? 'bg-primary'
                                    : 'bg-gray-600'
                                }`}>
                                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                                    settings[item.setting]
                                      ? 'translate-x-7'
                                      : 'translate-x-1'
                                  }`} style={{ marginTop: 1 }}></div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Notification Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-text-muted mb-2">
                              Morning Reminders
                            </label>
                            <select
                              value="08:00"
                              onChange={() => {}}
                              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2"
                            >
                              <option value="07:00">7:00 AM</option>
                              <option value="08:00">8:00 AM</option>
                              <option value="09:00">9:00 AM</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-text-muted mb-2">
                              Evening Reminders
                            </label>
                            <select
                              value="20:00"
                              onChange={() => {}}
                              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2"
                            >
                              <option value="19:00">7:00 PM</option>
                              <option value="20:00">8:00 PM</option>
                              <option value="21:00">9:00 PM</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-text-muted mb-2">
                              Do Not Disturb
                            </label>
                            <select
                              value="22:00-07:00"
                              onChange={() => {}}
                              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2"
                            >
                              <option value="22:00-07:00">10 PM - 7 AM</option>
                              <option value="23:00-06:00">11 PM - 6 AM</option>
                              <option value="00:00-08:00">12 AM - 8 AM</option>
                              <option value="none">Never</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Display Settings */}
                  {activeSection === 'display' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Appearance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Theme
                            </label>
                            <div className="flex gap-2">
                              {['light', 'dark', 'system'].map((theme) => (
                                <button
                                  key={theme}
                                  onClick={() => handleSettingChange('theme', theme)}
                                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                                    settings.theme === theme
                                      ? 'border-primary bg-primary/20 text-primary'
                                      : 'border-white/10 hover:bg-white/5'
                                  }`}
                                >
                                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Language
                            </label>
                            <select
                              value={settings.language}
                              onChange={(e) => handleSettingChange('language', e.target.value)}
                              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3"
                            >
                              <option value="en">English</option>
                              <option value="es">Español</option>
                              <option value="fr">Français</option>
                              <option value="de">Deutsch</option>
                              <option value="hi">हिन्दी</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Units
                            </label>
                            <div className="flex gap-2">
                              {['metric', 'imperial'].map((unit) => (
                                <button
                                  key={unit}
                                  onClick={() => handleSettingChange('units', unit)}
                                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                                    settings.units === unit
                                      ? 'border-primary bg-primary/20 text-primary'
                                      : 'border-white/10 hover:bg-white/5'
                                  }`}
                                >
                                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Time Format
                            </label>
                            <div className="flex gap-2">
                              {['12h', '24h'].map((format) => (
                                <button
                                  key={format}
                                  onClick={() => handleSettingChange('timeFormat', format)}
                                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                                    settings.timeFormat === format
                                      ? 'border-primary bg-primary/20 text-primary'
                                      : 'border-white/10 hover:bg-white/5'
                                  }`}
                                >
                                  {format === '12h' ? '12-hour' : '24-hour'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Dashboard Customization</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <div>
                              <span className="font-medium">Show Welcome Message</span>
                              <p className="text-sm text-text-muted">Display welcome message on dashboard</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={() => {}}
                                className="sr-only"
                              />
                              <div className="w-12 h-6 rounded-full bg-primary">
                                <div className="w-5 h-5 rounded-full bg-white transform translate-x-7" style={{ marginTop: 1 }}></div>
                              </div>
                            </div>
                          </label>

                          <label className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <div>
                              <span className="font-medium">Compact View</span>
                              <p className="text-sm text-text-muted">Use compact cards on dashboard</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={() => {}}
                                className="sr-only"
                              />
                              <div className="w-12 h-6 rounded-full bg-gray-600">
                                <div className="w-5 h-5 rounded-full bg-white transform translate-x-1" style={{ marginTop: 1 }}></div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Settings */}
                  {activeSection === 'privacy' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Data & Privacy</h3>
                        <div className="space-y-4">
                          {[
                            {
                              label: 'Auto-save Progress',
                              setting: 'autoSave',
                              description: 'Automatically save your yoga sessions and progress'
                            },
                            {
                              label: 'Data Sharing',
                              setting: 'dataSharing',
                              description: 'Allow anonymous data to improve AI models'
                            },
                            {
                              label: 'Analytics',
                              setting: 'analytics',
                              description: 'Help us improve by sharing usage analytics'
                            },
                          ].map((item) => (
                            <label key={item.setting} className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                              <div>
                                <span className="font-medium">{item.label}</span>
                                <p className="text-sm text-text-muted">{item.description}</p>
                              </div>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={settings[item.setting]}
                                  onChange={(e) => handleSettingChange(item.setting, e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors ${
                                  settings[item.setting]
                                    ? 'bg-primary'
                                    : 'bg-gray-600'
                                }`}>
                                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                                    settings[item.setting]
                                      ? 'translate-x-7'
                                      : 'translate-x-1'
                                  }`} style={{ marginTop: 1 }}></div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Data Management</h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              const data = { settings, timestamp: new Date().toISOString() };
                              const dataStr = JSON.stringify(data, null, 2);
                              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                              const link = document.createElement('a');
                              link.setAttribute('href', dataUri);
                              link.setAttribute('download', 'yogaai-settings.json');
                              link.click();
                            }}
                            className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">Export Settings</span>
                              <p className="text-sm text-text-muted">Download your settings as JSON file</p>
                            </div>
                            <span>📥</span>
                          </button>

                          <button
                            onClick={() => navigate('/privacy')}
                            className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">View Privacy Policy</span>
                              <p className="text-sm text-text-muted">Read our complete privacy policy</p>
                            </div>
                            <span>📄</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('This will delete all your local data. Are you sure?')) {
                                localStorage.clear();
                                navigate('/');
                              }
                            }}
                            className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium text-red-400">Clear Local Data</span>
                              <p className="text-sm text-text-muted">Delete all locally stored data</p>
                            </div>
                            <span className="text-red-400">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Settings */}
                  {activeSection === 'performance' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Video & Detection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Video Quality
                            </label>
                            <div className="space-y-2">
                              {['low', 'medium', 'high'].map((quality) => (
                                <label key={quality} className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                  <input
                                    type="radio"
                                    name="videoQuality"
                                    value={quality}
                                    checked={settings.videoQuality === quality}
                                    onChange={(e) => handleSettingChange('videoQuality', e.target.value)}
                                    className="w-4 h-4"
                                  />
                                  <span>{quality.charAt(0).toUpperCase() + quality.slice(1)}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Detection Speed
                            </label>
                            <div className="space-y-2">
                              {['fast', 'balanced', 'accurate'].map((speed) => (
                                <label key={speed} className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                  <input
                                    type="radio"
                                    name="detectionSpeed"
                                    value={speed}
                                    checked={settings.detectionSpeed === speed}
                                    onChange={(e) => handleSettingChange('detectionSpeed', e.target.value)}
                                    className="w-4 h-4"
                                  />
                                  <span>{speed.charAt(0).toUpperCase() + speed.slice(1)}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Performance Options</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <div>
                              <span className="font-medium">Cache Data</span>
                              <p className="text-sm text-text-muted">Store data locally for faster loading</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={settings.cacheData}
                                onChange={(e) => handleSettingChange('cacheData', e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-12 h-6 rounded-full transition-colors ${
                                settings.cacheData
                                  ? 'bg-primary'
                                  : 'bg-gray-600'
                              }`}>
                                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                                  settings.cacheData
                                    ? 'translate-x-7'
                                    : 'translate-x-1'
                                }`} style={{ marginTop: 1 }}></div>
                              </div>
                            </div>
                          </label>

                          <div className="p-4 bg-surface rounded-xl">
                            <label className="block text-sm font-medium text-text-muted mb-2">
                              Cache Size
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div className="w-1/3 bg-primary rounded-full h-2"></div>
                                </div>
                              </div>
                              <span className="text-sm text-text-muted">256 MB used</span>
                            </div>
                            <button
                              onClick={() => {}}
                              className="mt-3 px-4 py-1 bg-surface border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors"
                            >
                              Clear Cache
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                                   {/* Account Settings */}
                  {activeSection === 'account' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Account Security</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-surface rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="font-medium">Email Verification</span>
                                <p className="text-sm text-text-muted">
                                  {settings.emailVerified ? 'Verified' : 'Not verified'}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                settings.emailVerified
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {settings.emailVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            {!settings.emailVerified && (
                              <button
                                onClick={() => {}}
                                className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                              >
                                Verify Email
                              </button>
                            )}
                          </div>

                          <label className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <div>
                              <span className="font-medium">Two-Factor Authentication</span>
                              <p className="text-sm text-text-muted">Add an extra layer of security to your account</p>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={settings.twoFactorAuth}
                                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-12 h-6 rounded-full transition-colors ${
                                settings.twoFactorAuth
                                  ? 'bg-primary'
                                  : 'bg-gray-600'
                              }`}>
                                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                                  settings.twoFactorAuth
                                    ? 'translate-x-7'
                                    : 'translate-x-1'
                                }`} style={{ marginTop: 1 }}></div>
                              </div>
                            </div>
                          </label>

                          <button
                            onClick={() => {}}
                            className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">Change Password</span>
                              <p className="text-sm text-text-muted">Update your account password</p>
                            </div>
                            <span>🔐</span>
                          </button>

                          <button
                            onClick={() => {}}
                            className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">Login History</span>
                              <p className="text-sm text-text-muted">View recent account activity</p>
                            </div>
                            <span>📱</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Subscription</h3>
                        <div className="p-4 bg-surface rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="font-medium">Current Plan</span>
                              <p className="text-sm text-text-muted">Free Plan</p>
                            </div>
                            <button
                              onClick={() => navigate('/premium')}
                              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                            >
                              Upgrade to Premium
                            </button>
                          </div>
                          <div className="text-sm text-text-muted">
                            <p className="mb-1">• Basic pose detection</p>
                            <p className="mb-1">• Limited diet recommendations</p>
                            <p className="mb-1">• Standard support</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Account Management</h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => navigate('/profile')}
                            className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">Edit Profile</span>
                              <p className="text-sm text-text-muted">Update your personal information</p>
                            </div>
                            <span>👤</span>
                          </button>

                          <button
                            onClick={() => {
                              const data = {
                                user,
                                settings,
                                timestamp: new Date().toISOString()
                              };
                              const dataStr = JSON.stringify(data, null, 2);
                              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                              const link = document.createElement('a');
                              link.setAttribute('href', dataUri);
                              link.setAttribute('download', 'yogaai-account-data.json');
                              link.click();
                            }}
                            className="w-full p-4 bg-surface border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">Export Account Data</span>
                              <p className="text-sm text-text-muted">Download all your account data</p>
                            </div>
                            <span>📥</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to deactivate your account? You can reactivate within 30 days.')) {
                                // Deactivate account logic
                                console.log('Account deactivation requested');
                              }
                            }}
                            className="w-full p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium text-amber-400">Deactivate Account</span>
                              <p className="text-sm text-text-muted">Temporarily disable your account</p>
                            </div>
                            <span className="text-amber-400">⏸️</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you absolutely sure?')) {
                                // Delete account logic
                                localStorage.clear();
                                navigate('/');
                              }
                            }}
                            className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-left flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium text-red-400">Delete Account</span>
                              <p className="text-sm text-text-muted">Permanently delete your account and all data</p>
                            </div>
                            <span className="text-red-400">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>

              {/* Help & Support Section */}
              <AnimatedCard delay={0.1} className="mt-8">
                <div className="bg-card rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => navigate('/contact')}
                      className="p-4 bg-surface rounded-xl hover:bg-white/5 transition-colors text-center"
                    >
                      <span className="text-2xl mb-2 block">📧</span>
                      <span className="font-medium">Contact Support</span>
                      <p className="text-sm text-text-muted mt-1">Get help from our team</p>
                    </button>

                    <button
                      onClick={() => navigate('/how-it-works')}
                      className="p-4 bg-surface rounded-xl hover:bg-white/5 transition-colors text-center"
                    >
                      <span className="text-2xl mb-2 block">📚</span>
                      <span className="font-medium">Help Center</span>
                      <p className="text-sm text-text-muted mt-1">Browse documentation</p>
                    </button>

                    <button
                      onClick={() => {}}
                      className="p-4 bg-surface rounded-xl hover:bg-white/5 transition-colors text-center"
                    >
                      <span className="text-2xl mb-2 block">🐛</span>
                      <span className="font-medium">Report Bug</span>
                      <p className="text-sm text-text-muted mt-1">Found an issue? Let us know</p>
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SettingsPage;
                   
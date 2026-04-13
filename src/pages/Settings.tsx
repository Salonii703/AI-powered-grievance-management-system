import React, { useState, useEffect } from 'react'
import { Save, RefreshCw, Trash2, Download, CheckCircle2, AlertCircle, User, Bell, Database, Shield, Info } from 'lucide-react'

const API = 'http://localhost:8000'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  // Profile
  const currentUser = localStorage.getItem('ugp_current_user')
  const user = currentUser ? JSON.parse(currentUser) : {}
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [phone, setPhone] = useState(user.phone || '')

  // System
  const [appName, setAppName] = useState(
    localStorage.getItem('ugp_app_name') || 'UGP'
  )
  const [defaultHelpline, setDefaultHelpline] = useState(
    localStorage.getItem('ugp_helpline') || '1800-11-0031'
  )

  // Notifications
  const [notifyNew, setNotifyNew] = useState(
    localStorage.getItem('ugp_notify_new') !== 'false'
  )
  const [notifyResolved, setNotifyResolved] = useState(
    localStorage.getItem('ugp_notify_resolved') !== 'false'
  )
  const [notifyHighPriority, setNotifyHighPriority] = useState(
    localStorage.getItem('ugp_notify_high') !== 'false'
  )

  // Check backend status
  useEffect(() => {
    fetch(`${API}/grievances`)
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  function saveProfile() {
    const updated = { ...user, name, email, phone }
    localStorage.setItem('ugp_current_user', JSON.stringify(updated))
    localStorage.setItem('ugp_user_name', name)
    showSaved()
  }

  function saveSystem() {
    localStorage.setItem('ugp_app_name', appName)
    localStorage.setItem('ugp_helpline', defaultHelpline)
    showSaved()
  }

  function saveNotifications() {
    localStorage.setItem('ugp_notify_new', String(notifyNew))
    localStorage.setItem('ugp_notify_resolved', String(notifyResolved))
    localStorage.setItem('ugp_notify_high', String(notifyHighPriority))
    showSaved()
  }

  function showSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function exportAllData() {
    fetch(`${API}/grievances`)
      .then(res => res.json())
      .then(data => {
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `grievances_backup_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'system', label: 'System', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin preferences and system configuration</p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'}`}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1">

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
              <h2 className="font-bold text-gray-800">Profile Settings</h2>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-2xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{name}</p>
                  <p className="text-sm text-purple-600 font-medium">Admin Account</p>
                </div>
              </div>

              {[
                { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'Your full name' },
                { label: 'Email Address', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number', value: phone, setter: setPhone, type: 'tel', placeholder: '+91 98765 43210' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type={field.type} value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              ))}

              <button onClick={saveProfile}
                className="flex items-center gap-2 bg-blue-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-900">
                <Save size={16} />
                Save Profile
              </button>
            </div>
          )}

          {/* System */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
              <h2 className="font-bold text-gray-800">System Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                <input value={appName} onChange={e => setAppName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <p className="text-xs text-gray-400 mt-1">Displayed in the navbar and browser tab</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Helpline Number</label>
                <input value={defaultHelpline} onChange={e => setDefaultHelpline(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <p className="text-xs text-gray-400 mt-1">Shown to citizens when state-specific helpline is unavailable</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-2">Backend API</p>
                <p className="text-xs text-blue-600 font-mono">{API}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-green-500' : backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <span className="text-xs text-gray-600 capitalize">{backendStatus}</span>
                </div>
              </div>

              <button onClick={saveSystem}
                className="flex items-center gap-2 bg-blue-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-900">
                <Save size={16} />
                Save Settings
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5">
              <h2 className="font-bold text-gray-800">Notification Preferences</h2>
              <p className="text-sm text-gray-500">Choose which events trigger dashboard alerts</p>

              {[
                { label: 'New Grievance Submitted', desc: 'Get notified when a citizen submits a grievance', value: notifyNew, setter: setNotifyNew },
                { label: 'Grievance Resolved', desc: 'Get notified when a grievance is marked resolved', value: notifyResolved, setter: setNotifyResolved },
                { label: 'High Priority Grievance', desc: 'Immediate alert for high priority submissions', value: notifyHighPriority, setter: setNotifyHighPriority },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button onClick={() => item.setter(!item.value)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-blue-800' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}

              <button onClick={saveNotifications}
                className="flex items-center gap-2 bg-blue-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-900">
                <Save size={16} />
                Save Preferences
              </button>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="font-bold text-gray-800">Data Management</h2>
              <p className="text-sm text-gray-500">Manage system data and backups</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Export All Data</p>
                    <p className="text-xs text-gray-500 mt-0.5">Download all grievances as a JSON backup file</p>
                  </div>
                  <button onClick={exportAllData}
                    className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-900">
                    <Download size={14} />
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Clear Local Session</p>
                    <p className="text-xs text-gray-500 mt-0.5">Clear your browser session data (does not delete grievances)</p>
                  </div>
                  <button onClick={() => {
                    sessionStorage.clear()
                    showSaved()
                  }}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700">
                    <RefreshCw size={14} />
                    Clear
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <p className="text-sm font-semibold text-red-800">Danger Zone</p>
                    <p className="text-xs text-red-600 mt-0.5">Logout and clear all local user data</p>
                  </div>
                  <button onClick={() => {
                    if (window.confirm('Are you sure? This will log you out.')) {
                      localStorage.clear()
                      window.location.href = '/'
                    }
                  }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700">
                    <Trash2 size={14} />
                    Clear & Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="font-bold text-gray-800">About</h2>

              <div className="space-y-3">
                {[
                  { label: 'Application', value: 'UGP — Unified Grievance Portal' },
                  { label: 'Version', value: '1.0.0' },
                  { label: 'Frontend', value: 'React + Vite + Tailwind CSS' },
                  { label: 'Backend', value: 'FastAPI + Python' },
                  { label: 'AI Features', value: 'Auto categorization, priority detection, sentiment analysis, duplicate detection, location routing' },
                  { label: 'Backend Status', value: backendStatus === 'online' ? '✅ Online' : '❌ Offline' },
                  { label: 'Backend URL', value: API },
                ].map(item => (
                  <div key={item.label} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{item.label}</span>
                    <span className="text-sm text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                Built with AI-powered grievance routing using Python ML modules for automatic categorization, priority detection, sentiment analysis, location mapping, and duplicate prevention.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
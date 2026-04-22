import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Shield, Key, Clock, Globe, Database } from 'lucide-react'

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90
    },
    twoFactorAuth: {
      enabled: true,
      method: 'authenticator'
    },
    sessionManagement: {
      sessionTimeout: 30,
      maxActiveSessions: 5
    },
    ipWhitelist: {
      enabled: false,
      ips: []
    },
    dataEncryption: {
      enabled: true,
      algorithm: 'AES-256'
    }
  })

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-8 h-8 text-red-600" />
            Security Settings
          </h1>
          <p className="text-gray-600 mt-1">Configure security policies and protection measures</p>
        </div>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Security Status</span>
          </div>
          <p className="text-2xl font-bold text-green-700">Excellent</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">2FA Status</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">Enabled</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Encryption</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">AES-256</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-900">Session Timeout</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">30 min</p>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="w-6 h-6 text-indigo-600" />
          Password Policy
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => setSettings({
                ...settings,
                passwordPolicy: { ...settings.passwordPolicy, minLength: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireUppercase}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, requireUppercase: e.target.checked }
                })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Require Uppercase Letters</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireNumbers}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, requireNumbers: e.target.checked }
                })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Require Numbers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireSpecialChars}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, requireSpecialChars: e.target.checked }
                })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Require Special Characters</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiration (Days)
            </label>
            <input
              type="number"
              value={settings.passwordPolicy.expirationDays}
              onChange={(e) => setSettings({
                ...settings,
                passwordPolicy: { ...settings.passwordPolicy, expirationDays: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          Two-Factor Authentication (2FA)
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth.enabled}
              onChange={(e) => setSettings({
                ...settings,
                twoFactorAuth: { ...settings.twoFactorAuth, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable 2FA for All Users</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2FA Method
            </label>
            <select
              value={settings.twoFactorAuth.method}
              onChange={(e) => setSettings({
                ...settings,
                twoFactorAuth: { ...settings.twoFactorAuth, method: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="authenticator">Authenticator App</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-600" />
          Session Management
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              value={settings.sessionManagement.sessionTimeout}
              onChange={(e) => setSettings({
                ...settings,
                sessionManagement: { ...settings.sessionManagement, sessionTimeout: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Active Sessions per User
            </label>
            <input
              type="number"
              value={settings.sessionManagement.maxActiveSessions}
              onChange={(e) => setSettings({
                ...settings,
                sessionManagement: { ...settings.sessionManagement, maxActiveSessions: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />
          IP Whitelist
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.ipWhitelist.enabled}
              onChange={(e) => setSettings({
                ...settings,
                ipWhitelist: { ...settings.ipWhitelist, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable IP Whitelist</span>
          </label>
          {settings.ipWhitelist.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed IP Addresses (one per line)
              </label>
              <textarea
                placeholder="192.168.1.1&#10;10.0.0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
          )}
        </div>
      </div>

      {/* Data Encryption */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-purple-600" />
          Data Encryption
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.dataEncryption.enabled}
              onChange={(e) => setSettings({
                ...settings,
                dataEncryption: { ...settings.dataEncryption, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable Data Encryption</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Algorithm
            </label>
            <select
              value={settings.dataEncryption.algorithm}
              onChange={(e) => setSettings({
                ...settings,
                dataEncryption: { ...settings.dataEncryption, algorithm: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="AES-256">AES-256</option>
              <option value="AES-192">AES-192</option>
              <option value="AES-128">AES-128</option>
            </select>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
              <strong>Encrypted Fields:</strong> Customer addresses, phone numbers, credit card information, driver licenses
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
          Save Settings
        </button>
      </div>
    </div>
  )
}

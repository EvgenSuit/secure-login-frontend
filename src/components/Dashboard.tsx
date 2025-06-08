import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TwoFactorSetup from './TwoFactorSetup';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const show2FASetup = params.get('setup2fa') === 'true';

  const start2FA = () => {
    navigate('/dashboard?setup2fa=true');
  };

  const done2FA = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="w-full space-y-6 py-8">
      {!show2FASetup ? (
        <>
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100">Manage your account security and settings</p>
          </div>

          {/* Account Info Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            </div>
            
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</span>
                <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
              </div>
              
            <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    User ID
                </span>
                <span className="font-mono text-sm text-gray-700 bg-white px-2 py-1 rounded border inline-block">
                    {user?.userId}
                </span>
            </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Two-Factor Authentication</span>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-3">
                    {user?.is2FAEnabled ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Enabled
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                          Disabled
                        </span>
                      </>
                    )}
                  </div>
                  
                  {!user?.is2FAEnabled && (
                    <button
                      onClick={start2FA}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                    >
                      <Shield size={16} className="mr-2" /> 
                      Enable 2FA
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Security Status Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Security Status</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-medium text-green-800">JWT Authentication Active</span>
                  <p className="text-sm text-green-600">Your session is secured with JSON Web Tokens</p>
                </div>
              </div>
              
              {user?.is2FAEnabled ? (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Smartphone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-green-800">Two-Factor Authentication Active</span>
                    <p className="text-sm text-green-600">Additional security layer with TOTP codes</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-amber-800">2FA Recommended</span>
                    <p className="text-sm text-amber-600">Enable two-factor authentication for better security</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <TwoFactorSetup onComplete={done2FA} />
        </section>
      )}
    </div>
  );
};

export default Dashboard;
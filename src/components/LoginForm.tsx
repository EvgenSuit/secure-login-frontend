import React, { useState } from 'react';
import { Mail, Lock, Smartphone, Shield, EyeOff, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Input from './Input';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const normalize = (raw: any) => ({
    error: raw.error,
    message: raw.message ?? raw.error,
    retryAfter: raw.retryAfter,
    details: raw.details,
  });

  const doLogin = async () => {
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.requires2FA) setRequires2FA(res.userId!);
      setErr(null);
    } catch (raw) {
      setErr(normalize(raw));
    } finally {
      setLoading(false);
    }
  };

  const do2fa = async () => {
    if (!requires2FA) return;
    setLoading(true);
    setErr(null);
    try {
      const r = await api.complete2FALogin(requires2FA, code);
      localStorage.setItem('token', r.token);
      window.location.replace('/dashboard');
    } catch (raw) {
      setErr(normalize(raw));
    } finally {
      setLoading(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
          <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
        </div>

        <div className="space-y-6">
          <Input
            type="text"
            placeholder="000000"
            value={code}
            onChange={setCode}
            icon={<Shield size={20} />}
          />

          <ErrorMessage error={err} />

          <Button 
            onClick={do2fa} 
            disabled={code.length !== 6} 
            loading={loading}
            className="w-full"
          >
            Verify Code
          </Button>

          <div className="text-center">
            <button
              onClick={() => setRequires2FA(null)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <div className="space-y-6">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          icon={<Mail size={20} />}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={setPassword}
          icon={<Lock size={20} />}
          rightIcon={
            showPassword
              ? <EyeOff size={20} onClick={() => setShowPassword(false)} className="cursor-pointer" />
              : <Eye size={20} onClick={() => setShowPassword(true)} className="cursor-pointer" />
          }
        />

        <ErrorMessage error={err} />

        <Button 
          onClick={doLogin} 
          loading={loading}
          disabled={!email || !password}
          className="w-full"
        >
          Sign In
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

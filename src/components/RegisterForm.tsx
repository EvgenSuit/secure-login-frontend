import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from './Input';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const passwordCriteria = [
  { text: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { text: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { text: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { text: 'One number', test: (p: string) => /\d/.test(p) },
  { text: 'One special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const normalize = (raw: any) => ({
    error: raw.error,
    message: raw.message ?? raw.error,
    retryAfter: raw.retryAfter,
    details: raw.details,
  });

  const doRegister = async () => {
    setLoading(true);
    try {
      await register(email, password);
      setErr(null);
      setSuccess(true);
    } catch (raw) {
      setErr(normalize(raw));
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = passwordCriteria.every(c => c.test(password));
  const isFormValid = email !== '' && password !== '' && isPasswordValid;

  if (success) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md min-h-[500px] flex flex-col justify-center text-center">
        <div className="space-y-6">
          <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Account Created!</h3>
          <p className="text-gray-600">Welcome to SecureLoginApp. You can now sign in.</p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">Registration Successful</p>
            </div>
            <p className="text-green-700 text-sm mt-1">Your account is ready to use.</p>
          </div>
          <Button onClick={() => (window.location.href = '/login')} className="w-full">
            Continue to Sign In
          </Button>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join SecureLoginApp today</p>
      </div>

      <div className="space-y-6">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          icon={<Mail size={20} />}
          error={err?.details?.find((d: any) => d.field === 'email')?.message}
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
          error={err?.details?.find((d: any) => d.field === 'password')?.message}
        />

        {password && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h4>
            <div className="space-y-2">
              {passwordCriteria.map((criterion, i) => {
                const valid = criterion.test(password);
                return (
                  <div key={i} className="flex items-center space-x-2">
                    {valid ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${valid ? 'text-green-700' : 'text-gray-600'}`}>
                      {criterion.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ErrorMessage error={err} />

        <Button onClick={doRegister} loading={loading} disabled={!isFormValid} className="w-full">
          Create Account
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

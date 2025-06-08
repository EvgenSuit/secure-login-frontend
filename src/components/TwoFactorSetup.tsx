// src/components/TwoFactorSetup.tsx
import React, { useState } from 'react';
import { Shield, Smartphone } from 'lucide-react';
import api from '../services/api';
import Input from './Input';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const TwoFactorSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'init' | 'verify'>('init');
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const normalize = (raw: any) => ({
    message: raw.message ?? raw.error,
    details: raw.details,
  });

  const start = async () => {
    setLoading(true);
    try {
      const r = await api.setup2FA();
      setQr(r.qr);
      setSecret(r.secret);
      setStage('verify');
      setErr(null);
    } catch (raw) {
      setErr(normalize(raw));
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    setLoading(true);
    try {
      await api.verify2FA(code);
      onComplete();
      setErr(null);
    } catch (raw) {
      setErr(normalize(raw));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md min-h-[500px] flex flex-col justify-center">
      {stage === 'init' ? (
        <>
          <div className="text-center mb-6">
            <div className="bg-blue-100 inline-flex p-3 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Enable Two-Factor Authentication
            </h2>
            <p className="text-gray-600 mt-1">
              Add an extra layer of security to your account.
            </p>
          </div>

          <ErrorMessage error={err} />

          <Button onClick={start} loading={loading}>
            Setup 2FA
          </Button>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="bg-blue-100 inline-flex p-3 rounded-full">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Scan QR Code
            </h2>
            <p className="text-gray-600 mt-1">
              Use your authenticator app to scan the QR code below.
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <img src={qr} alt="QR Code" className="border rounded-lg max-w-full h-auto" />
          </div>

          <div className="mb-4 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Or enter this code manually:
            </p>
            <div className="overflow-x-auto">
              <code className="break-all bg-gray-100 px-2 py-1 rounded font-mono text-gray-800 inline-block">
                {secret}
              </code>
            </div>
          </div>

          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={setCode}
            icon={<Shield size={20} />}
          />

          <ErrorMessage error={err} />

          <Button onClick={finish} loading={loading} disabled={code.length !== 6}>
            Verify & Enable
          </Button>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetup;

import React from 'react';

interface ApiError {
  message?: string;
  retryAfter?: string;
  details?: { field: string; message: string }[];
}

const ErrorMessage: React.FC<{ error: ApiError | null }> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p className="text-red-800 font-medium">{error.message}</p>
      {error.details && (
        <ul className="mt-2 space-y-1 text-xs text-red-700">
          {error.details.map((d, i) => (
            <li key={i}>• {d.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ErrorMessage;

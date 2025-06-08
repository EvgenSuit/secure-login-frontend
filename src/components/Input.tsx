import React from 'react';

interface Props {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const Input: React.FC<Props> = ({ type, placeholder, value, onChange, icon, rightIcon, error }) => {
  return (
    <div className="mb-4">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={
            `w-full py-3 px-4 border rounded-lg text-gray-900 placeholder-gray-500 ` +
            `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ` +
            `transition-all duration-200 ` +
            `${icon ? 'pl-12' : 'pl-4'} ` +
            `${rightIcon ? 'pr-12' : 'pr-4'} ` +
            `${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`
          }
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;

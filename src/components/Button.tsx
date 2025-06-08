import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, children, className, ...rest }) => {
  return (
    <button
      className={classNames(
        'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 transition',
        className
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;

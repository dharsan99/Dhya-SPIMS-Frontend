import { ButtonHTMLAttributes } from 'react';

const Button = ({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
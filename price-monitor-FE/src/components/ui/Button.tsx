import React from 'react';
import { Link } from 'react-router-dom';
// Lightweight clsx replacement to avoid adding dependency if not present
function cx(...classes: any[]): string {
  return classes.flat().filter(Boolean).join(' ');
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'subtle' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  to?: string; // optional react-router link support
}

const base = 'inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brandGreen disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant,string> = {
  primary: 'bg-brandGreen text-white hover:bg-brandGreen/90 active:bg-brandGreen-dark hover:text-white',
  secondary: 'border border-brandGreen text-brandGreen bg-transparent hover:bg-brandGreen hover:text-white active:bg-brandGreen/90',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  outline: 'border border-brandGreen bg-white text-brandGreen hover:bg-brandGreen/10 active:bg-brandGreen/20',
  subtle: 'bg-gray-300 text-brandBlack hover:bg-gray-200 active:bg-gray-300',
  icon: 'text-brandBlack hover:bg-gray-100 active:bg-gray-200 rounded-full'
};

const sizeClasses: Record<ButtonSize,string> = {
  sm: 'text-xs px-2.5 py-2.5',
  md: 'text-sm px-3.5 py-3',
  lg: 'text-sm px-4 py-3'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  to,
  ...rest
}) => {
  const content = (
    <span className='flex items-center'>
      {leftIcon && <span className='mr-2 flex items-center'>{leftIcon}</span>}
      {loading ? '...' : children}
      {rightIcon && <span className='ml-2 flex items-center'>{rightIcon}</span>}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={cx(base, variantClasses[variant], sizeClasses[size], variant === 'icon' && 'h-9 w-9 p-0', className)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cx(base, variantClasses[variant], sizeClasses[size], variant === 'icon' && 'h-9 w-9 p-0', className)} {...rest}>
      {content}
    </button>
  );
};

export default Button;

import React, { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Heading, Paragraph, Span, Label } from './Typography';

export { Heading, Paragraph, Span, Label };

// Core Card component representing content containers
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = React.memo(({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Core Button component with variants, loading, and disabled support
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = React.memo(({
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center py-2.5 px-4 font-bold text-sm rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-slate-950 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-offset-2",
    outline: "border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500 shadow-none"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// Reusable input supporting label, icon, and errors with forwardRef
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.memo(forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="space-y-1 w-full text-left">
      {label && (
        <label className="text-xs font-bold text-slate-707 dark:text-slate-300 uppercase block tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white py-2.5 transition-colors duration-300 ${icon ? 'pl-10' : 'px-4'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
    </div>
  );
}));

Input.displayName = 'Input';

// Reusable text area component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.memo(forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1 w-full text-left">
      {label && (
        <label className="text-xs font-bold text-slate-707 dark:text-slate-300 uppercase block tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full py-2.5 px-4 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-[100px] transition-colors duration-300 ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
    </div>
  );
}));

Textarea.displayName = 'Textarea';

// Reusable Router Link
interface LinkProps extends RouterLinkProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'silent';
}

export const Link: React.FC<LinkProps> = React.memo(({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseStyle = "font-bold transition-all duration-300 hover:underline";
  const variants = {
    primary: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
    secondary: "text-slate-600 dark:text-slate-400 hover:text-slate-905 dark:hover:text-white",
    silent: "text-inherit hover:no-underline"
  };
  return (
    <RouterLink
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
});

Link.displayName = 'Link';

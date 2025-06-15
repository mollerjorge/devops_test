import React, { forwardRef } from 'react';
import './TextField.css';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ 
    label, 
    error, 
    helperText, 
    fullWidth = false,
    className = '',
    id,
    ...props 
  }, ref) => {
    const inputId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className={`textfield-container ${fullWidth ? 'full-width' : ''} ${className}`}>
        <label 
          htmlFor={inputId}
          className="textfield-label"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`textfield-input ${error ? 'error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <span 
            id={errorId}
            className="textfield-error"
            role="alert"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span 
            id={helperId}
            className="textfield-helper"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField; 
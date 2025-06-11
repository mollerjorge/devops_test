import React, { useState, forwardRef } from 'react';

const TextField = forwardRef(({ 
  label,
  type = "text",
  placeholder = "Enter text...",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  size = "medium",
  variant = "outlined",
  fullWidth = false,
  className = "",
  id,
  name,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // Use controlled or uncontrolled pattern
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'large':
        return 'px-4 py-3 text-lg';
      default:
        return 'px-3 py-2 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'border rounded-md transition-colors duration-200 focus:outline-none';
    
    if (error) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500`;
    }
    
    switch (variant) {
      case 'filled':
        return `${baseClasses} border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500`;
      case 'standard':
        return `${baseClasses} border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500`;
      default:
        return `${baseClasses} border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500`;
    }
  };

  const getStateClasses = () => {
    if (disabled) {
      return 'bg-gray-100 text-gray-500 cursor-not-allowed';
    }
    if (readOnly) {
      return 'bg-gray-50 cursor-default';
    }
    return 'bg-white';
  };

  const inputClasses = `
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${getStateClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const labelClasses = `
    block text-sm font-medium mb-1
    ${error ? 'text-red-700' : 'text-gray-700'}
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const generateId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={generateId}
          className={labelClasses}
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={generateId}
        type={type}
        name={name}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          (error || helperText) ? `${generateId}-helper` : undefined
        }
        data-testid="textfield-input"
        {...props}
      />
      
      {(error || helperText) && (
        <div
          id={`${generateId}-helper`}
          className={`mt-1 text-sm ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

export default TextField; 
import React, { useState } from 'react';

const TextField = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Simple validation example
    if (newValue.length < 3 && newValue.length > 0) {
      setError('Text must be at least 3 characters long');
    } else {
      setError('');
    }
  };
  
  const handleSubmit = () => {
    if (value.length >= 3) {
      alert('Form submitted with: ' + value);
      setValue('');
    } else {
      setError('Please enter valid text before submitting');
    }
  };

  return (
    <div className="text-field-container">
      <label htmlFor="textInput">Enter Text:</label>
      <input 
        id="textInput"
        type="text" 
        value={value}
        onChange={handleChange}
        placeholder="Enter your text here..." 
      />
      {error && <div className="error-message" data-testid="error-message">{error}</div>}
      <button 
        onClick={handleSubmit}
        disabled={value.length < 3}
        data-testid="submit-button"
      >
        Submit
      </button>
    </div>
  );
};

export default TextField;
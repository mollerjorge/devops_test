import React, { useState } from 'react';

const TextField = ({ onChange, placeholder = "Enter your text here...", ...props }) => { 
  return (
    <div>
      <input 
        type="text" 
        placeholder={placeholder}
        onChange={onChange}
        data-testid="text-input"
        {...props}
      />
    </div>
  );
};

export default TextField;
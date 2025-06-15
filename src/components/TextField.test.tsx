import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders with label and handles user input', () => {
    render(
      <TextField 
        label="Username"
        placeholder="Enter username"
        data-testid="username-input"
      />
    );

    // Check if label is rendered
    expect(screen.getByText('Username')).toBeInTheDocument();

    // Check if input is rendered with correct attributes
    const input = screen.getByTestId('username-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter username');
    expect(input).toHaveAttribute('type', 'text'); // default type
  });
}); 
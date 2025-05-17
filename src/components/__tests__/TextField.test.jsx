import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextField from '../File'; // Note: importing from File.jsx as that's where the component is defined

describe('TextField Component', () => {


  it('renders without crashing', () => {
    render(<TextField />);
    expect(screen.getByPlaceholderText('Enter your text here...')).toBeInTheDocument();
  });

  it('renders with the correct placeholder text', () => {
    render(<TextField />);
    const inputElement = screen.getByPlaceholderText('Enter your text here...');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter your text here...');
  });

  it('allows text to be entered', async () => {
    render(<TextField />);
    const inputElement = screen.getByPlaceholderText('Enter your text here...');
    
    await userEvent.type(inputElement, 'Hello, world!');
    expect(inputElement).toHaveValue('Hello, world!');
  });

  it('clears text when cleared', async () => {
    render(<TextField />);
    const inputElement = screen.getByPlaceholderText('Enter your text here...');
    
    await userEvent.type(inputElement, 'Hello, world!');
    expect(inputElement).toHaveValue('Hello, world!');
    
    // Clear the input
    userEvent.clear(inputElement);
    expect(inputElement).toHaveValue('');
  });

  it('responds to change events', () => {
    const handleChange = jest.fn();
    render(<TextField onChange={handleChange} />);
    
    const inputElement = screen.getByTestId('text-input');
    fireEvent.change(inputElement, { target: { value: 'New text' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('accepts custom props', () => {
    render(<TextField className="custom-class" maxLength={10} disabled />);
    const inputElement = screen.getByTestId('text-input');
    
    expect(inputElement).toHaveClass('custom-class');
    expect(inputElement).toHaveAttribute('maxLength', '10');
    expect(inputElement).toBeDisabled();
  });
  
  it('allows custom placeholder text', () => {
    render(<TextField placeholder="Custom placeholder" />);
    const inputElement = screen.getByPlaceholderText('Custom placeholder');
    
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'Custom placeholder');
  });
}); 
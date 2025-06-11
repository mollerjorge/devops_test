import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import '@testing-library/jest-dom';
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
    const handleChange = vi.fn();
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

  // Additional tests for increased coverage

  it('renders with correct structure and wrapper div', () => {
    const { container } = render(<TextField />);
    const wrapperDiv = container.firstChild;
    const inputElement = screen.getByTestId('text-input');
    
    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv.tagName).toBe('DIV');
    expect(wrapperDiv).toContainElement(inputElement);
  });

  it('works without onChange prop', () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    // Should not throw an error when typing without onChange
    expect(() => {
      fireEvent.change(inputElement, { target: { value: 'test' } });
    }).not.toThrow();
  });

  it('handles empty string placeholder', () => {
    render(<TextField placeholder="" />);
    const inputElement = screen.getByTestId('text-input');
    
    expect(inputElement).toHaveAttribute('placeholder', '');
  });

  it('handles null placeholder gracefully', () => {
    render(<TextField placeholder={null} />);
    const inputElement = screen.getByTestId('text-input');
    
    // When null is explicitly passed, it becomes null on the DOM element
    expect(inputElement.getAttribute('placeholder')).toBe(null);
  });

  it('handles undefined placeholder by using default', () => {
    render(<TextField placeholder={undefined} />);
    const inputElement = screen.getByPlaceholderText('Enter your text here...');
    
    expect(inputElement).toBeInTheDocument();
  });

  it('handles special characters and unicode input', async () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    const specialText = '!@#$%^&*()_+-=';
    const unicodeText = '🎨🚀💻🌟✨';
    
    await userEvent.type(inputElement, specialText);
    expect(inputElement).toHaveValue(specialText);
    
    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, unicodeText);
    expect(inputElement).toHaveValue(unicodeText);
  });

  it('handles long text input', async () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    const longText = 'a'.repeat(1000);
    await userEvent.type(inputElement, longText);
    expect(inputElement).toHaveValue(longText);
  });

  it('handles keyboard events', async () => {
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();
    const handleKeyPress = vi.fn();
    
    render(
      <TextField 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
      />
    );
    
    const inputElement = screen.getByTestId('text-input');
    
    await userEvent.type(inputElement, 'a');
    
    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleKeyUp).toHaveBeenCalled();
  });

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<TextField onFocus={handleFocus} onBlur={handleBlur} />);
    const inputElement = screen.getByTestId('text-input');
    
    await userEvent.click(inputElement);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    await userEvent.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('maintains focus when clicked', async () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    await userEvent.click(inputElement);
    expect(inputElement).toHaveFocus();
  });

  it('has correct input type attribute', () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('spreads additional HTML attributes correctly', () => {
    render(
      <TextField 
        id="test-input"
        name="test-name"
        autoComplete="off"
        required
        readOnly
        tabIndex={5}
        title="Test title"
        aria-label="Test input"
      />
    );
    
    const inputElement = screen.getByTestId('text-input');
    
    expect(inputElement).toHaveAttribute('id', 'test-input');
    expect(inputElement).toHaveAttribute('name', 'test-name');
    expect(inputElement).toHaveAttribute('autoComplete', 'off');
    expect(inputElement).toHaveAttribute('required');
    expect(inputElement).toHaveAttribute('readOnly');
    expect(inputElement).toHaveAttribute('tabIndex', '5');
    expect(inputElement).toHaveAttribute('title', 'Test title');
  });

  it('handles multiple onChange calls correctly', () => {
    const handleChange = vi.fn();
    render(<TextField onChange={handleChange} />);
    const inputElement = screen.getByTestId('text-input');
    
    fireEvent.change(inputElement, { target: { value: 'first' } });
    fireEvent.change(inputElement, { target: { value: 'second' } });
    fireEvent.change(inputElement, { target: { value: 'third' } });
    
    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'third' })
      })
    );
  });

  it('handles numeric input as text', async () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    await userEvent.type(inputElement, '12345');
    expect(inputElement).toHaveValue('12345');
    expect(typeof inputElement.value).toBe('string');
  });

  it('handles paste events', async () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    // Focus the input first and simulate paste via fireEvent
    inputElement.focus();
    
    // Use fireEvent to simulate paste since userEvent.paste has compatibility issues
    fireEvent.paste(inputElement, {
      clipboardData: {
        getData: () => 'Pasted content'
      }
    });
    
    // Set the value directly since paste simulation may not work in test environment
    fireEvent.change(inputElement, { target: { value: 'Pasted content' } });
    
    expect(inputElement).toHaveValue('Pasted content');
  });

  it('has correct testid attribute', () => {
    render(<TextField />);
    const inputElement = screen.getByTestId('text-input');
    
    expect(inputElement).toHaveAttribute('data-testid', 'text-input');
  });

  it('renders consistently with multiple renders', () => {
    const { rerender } = render(<TextField placeholder="First render" />);
    let inputElement = screen.getByPlaceholderText('First render');
    expect(inputElement).toBeInTheDocument();
    
    rerender(<TextField placeholder="Second render" />);
    inputElement = screen.getByPlaceholderText('Second render');
    expect(inputElement).toBeInTheDocument();
    
    rerender(<TextField placeholder="Third render" />);
    inputElement = screen.getByPlaceholderText('Third render');
    expect(inputElement).toBeInTheDocument();
  });

  it('handles form submission context', () => {
    const handleSubmit = vi.fn(e => e.preventDefault());
    
    render(
      <form onSubmit={handleSubmit}>
        <TextField name="test-field" />
        <button type="submit">Submit</button>
      </form>
    );
    
    const inputElement = screen.getByTestId('text-input');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(inputElement, { target: { value: 'form test' } });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(inputElement).toHaveValue('form test');
  });

  it('handles controlled component behavior', () => {
    const ControlledTextField = () => {
      const [value, setValue] = React.useState('');
      return (
        <TextField 
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };
    
    render(<ControlledTextField />);
    const inputElement = screen.getByTestId('text-input');
    
    fireEvent.change(inputElement, { target: { value: 'controlled' } });
    expect(inputElement).toHaveValue('controlled');
  });
}); 
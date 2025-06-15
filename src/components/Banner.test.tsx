import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders with title', () => {
    render(<Banner title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with description when provided', () => {
    render(
      <Banner 
        title="Test Title" 
        description="Test Description" 
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<Banner title="Test Title" />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders with correct variant class', () => {
    const { container } = render(
      <Banner 
        title="Test Title" 
        variant="success" 
      />
    );
    expect(container.firstChild).toHaveClass('banner-success');
  });

  it('renders with info variant by default', () => {
    const { container } = render(<Banner title="Test Title" />);
    expect(container.firstChild).toHaveClass('banner-info');
  });

  it('renders close button when onClose is provided', () => {
    const onClose = vi.fn();
    render(
      <Banner 
        title="Test Title" 
        onClose={onClose} 
      />
    );
    const closeButton = screen.getByRole('button', { name: /close banner/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Banner title="Test Title" />);
    expect(screen.queryByRole('button', { name: /close banner/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Banner 
        title="Test Title" 
        onClose={onClose} 
      />
    );
    const closeButton = screen.getByRole('button', { name: /close banner/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with correct ARIA role', () => {
    const { container } = render(<Banner title="Test Title" />);
    expect(container.firstChild).toHaveAttribute('role', 'alert');
  });

  it('renders with all variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    
    variants.forEach(variant => {
      const { container, unmount } = render(
        <Banner 
          title={`${variant} banner`} 
          variant={variant} 
        />
      );
      expect(container.firstChild).toHaveClass(`banner-${variant}`);
      unmount();
    });
  });
}); 
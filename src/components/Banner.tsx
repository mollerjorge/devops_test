import React from 'react';
import './Banner.css';

interface BannerProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  title,
  description,
  variant = 'info',
  onClose,
}) => {
  return (
    <div className={`banner banner-${variant}`} role="alert">
      <div className="banner-content">
        <h3 className="banner-title">{title}</h3>
        {description && <p className="banner-description">{description}</p>}
      </div>
      {onClose && (
        <button
          className="banner-close"
          onClick={onClose}
          aria-label="Close banner"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Banner; 
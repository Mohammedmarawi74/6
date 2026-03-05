
import React from 'react';
import { SlideData } from '../types';

interface SlidePreviewProps {
  slide: SlideData;
  scale?: number;
  index?: number;
  total?: number;
}

const SlidePreview = React.forwardRef<HTMLDivElement, SlidePreviewProps>(({ slide, scale = 1, index, total }, ref) => {
  const containerStyle = {
    backgroundColor: slide.backgroundColor,
    color: slide.textColor,
    transform: `scale(${scale})`,
  };

  return (
    <div 
      ref={ref}
      className="slide-container"
      style={containerStyle}
    >
      {/* Dynamic Background Elements */}
      <div 
        className="slide-bg-orb-1"
        style={{ backgroundColor: slide.accentColor }}
      ></div>
      <div 
        className="slide-bg-orb-2"
        style={{ backgroundColor: slide.secondaryColor || slide.accentColor }}
      ></div>

      {/* Header: Logo & Slide Number */}
      <div className="slide-header">
        {/* Brand/Logo Section */}
        <div className="slide-logo-container">
          {slide.logoUrl ? (
            <img 
              src={slide.logoUrl} 
              alt="Logo" 
              style={{ height: '2rem', width: 'auto', maxWidth: '100px', objectFit: 'contain' }} 
            />
          ) : (
            <>
              <div 
                className="slide-logo-dot" 
                style={{ backgroundColor: slide.accentColor }}
              ></div>
              <span className="slide-logo-text">
                {slide.logoText || 'العلامة التجارية'}
              </span>
            </>
          )}
        </div>

        {/* Slide Counter */}
        {index && total && (
          <div className="slide-number-badge">
             <span className="slide-number-text" style={{ color: slide.textColor }}>
               {String(index).padStart(2, '0')}
             </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="slide-content">
        <h2 className="slide-title">
          {slide.title.split(' ').map((word, i) => (
            <span 
              key={i} 
              style={{ color: word === slide.highlightedWord ? slide.accentColor : 'inherit' }}
              className="slide-highlight"
            >
              {word}
            </span>
          ))}
        </h2>

        {slide.imageUrl ? (
          <div className="slide-image-wrapper">
             <img src={slide.imageUrl} alt="uploaded" className="slide-image" />
             <div className="slide-image-overlay"></div>
          </div>
        ) : (
            <div className="slide-divider" style={{ backgroundColor: slide.accentColor }}></div>
        )}

        <p className="slide-description">
          {slide.description}
        </p>
      </div>

      {/* Footer */}
      <div className="slide-footer">
        <div className="slide-footer-left">
          {slide.ctaText && (
            <button 
              className="slide-cta"
              style={{ backgroundColor: slide.accentColor, color: slide.backgroundColor === '#FFFFFF' ? '#000' : '#fff' }}
            >
              {slide.ctaText}
            </button>
          )}
          <span className="slide-url">
            {slide.footerUrl || 'WWW.YOURSITE.COM'}
          </span>
        </div>
        
        {/* Abstract shape in footer */}
        <div 
          className="slide-footer-icon"
          style={{ borderColor: slide.accentColor }}
        >
          <div 
            className="slide-footer-dot" 
            style={{ backgroundColor: slide.accentColor }}
          ></div>
        </div>
      </div>
    </div>
  );
});

SlidePreview.displayName = 'SlidePreview';

export default SlidePreview;

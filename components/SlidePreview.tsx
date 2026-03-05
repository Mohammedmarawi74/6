
import React from 'react';
import { SlideData } from '../types';

interface SlidePreviewProps {
  slide: SlideData;
  scale?: number;
  index?: number;
  total?: number;
}

const SlidePreview = React.forwardRef<HTMLDivElement, SlidePreviewProps>(({ slide, scale = 1, index, total }, ref) => {
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const titleContainerRef = React.useRef<HTMLDivElement>(null);
  const descRef = React.useRef<HTMLParagraphElement>(null);
  const descContainerRef = React.useRef<HTMLDivElement>(null);

  const containerStyle = {
    backgroundColor: slide.backgroundColor,
    color: slide.textColor,
    transform: `scale(${scale})`,
  };

  const fitText = (textEl: HTMLElement | null, containerEl: HTMLElement | null, maxFontSize: number) => {
    if (!textEl || !containerEl) return;
    let fontSize = maxFontSize;
    textEl.style.fontSize = `${fontSize}px`;
    while (
      (textEl.scrollHeight > containerEl.clientHeight || textEl.scrollWidth > containerEl.clientWidth) && 
      fontSize > 10
    ) {
      fontSize -= 1;
      textEl.style.fontSize = `${fontSize}px`;
    }
  };

  React.useLayoutEffect(() => {
    fitText(titleRef.current, titleContainerRef.current, 40); // 40px مناسب لنسبة 9:16
    fitText(descRef.current, descContainerRef.current, 18);   // 18px للوصف
  }, [slide.title, slide.description]);

  return (
    <div ref={ref} className="slide-container" style={containerStyle}>
      {/* Background Orbs (Decorative) */}
      {!slide.imageUrl && (
        <>
          <div className="slide-bg-orb-1" style={{ backgroundColor: slide.accentColor }}></div>
          <div className="slide-bg-orb-2" style={{ backgroundColor: slide.secondaryColor || slide.accentColor }}></div>
        </>
      )}

      {/* 1. Top Section: Logo + Title + Description */}
      <div className="slide-top-section">
        <div className="slide-header">
           <div className="slide-number-badge">
             <span className="slide-number-text" style={{ color: slide.textColor }}>
               {String(index).padStart(2, '0')}
             </span>
          </div>
          <div className="slide-logo-container">
            {slide.logoUrl || slide.selectedLogoUrl ? (
              <img 
                src={slide.logoUrl || slide.selectedLogoUrl} 
                alt="Logo" 
                style={{ height: '2.5rem', width: 'auto', maxWidth: '120px', objectFit: 'contain' }} 
              />
            ) : (
              <span className="slide-logo-text">{slide.logoText || 'العلامة التجارية'}</span>
            )}
          </div>
        </div>

        <div className="slide-text-area">
          <div className="slide-title-wrapper" ref={titleContainerRef}>
            <h2 className="slide-title" ref={titleRef}>
              {slide.title.split(' ').map((word, i) => (
                <span 
                  key={i} 
                  style={{ color: word === slide.highlightedWord ? slide.accentColor : 'inherit' }}
                >
                  {word}{' '}
                </span>
              ))}
            </h2>
          </div>
          
          <div className="slide-description-wrapper" ref={descContainerRef}>
            <p className="slide-description" ref={descRef}>
              {slide.description}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Image (Fixed Position) */}
      <div className="slide-middle-section">
        {slide.imageUrl ? (
          <div className="slide-image-container">
            <img src={slide.imageUrl} alt="Content" className="slide-content-image" />
          </div>
        ) : (
          <div className="slide-custom-divider" style={{ backgroundColor: slide.accentColor }}></div>
        )}
      </div>

      {/* 3. Bottom Section: Footer (Always Fixed) */}
      <div className="slide-footer">
        <div className="slide-footer-right">
          <span className="slide-footer-brand">منصة المستثمر الاقتصادية</span>
        </div>
        <div className="slide-footer-center">
          <div className="slide-footer-separator" style={{ backgroundColor: slide.accentColor }}></div>
        </div>
        <div className="slide-footer-left">
          <span className="slide-url">al_investor.com</span>
        </div>
      </div>
    </div>
  );
});

SlidePreview.displayName = 'SlidePreview';

export default SlidePreview;

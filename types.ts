
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface SlideData {
  id: string;
  title: string;
  description: string;
  highlightedWord?: string;
  ctaText?: string;
  footerUrl?: string;
  logoText?: string;
  logoUrl?: string; // New: Image logo
  selectedLogoUrl?: string; // One of the preset logos
  imageUrl?: string;
  theme: ThemeMode;
  backgroundColor: string;
  accentColor: string; // Used as Primary
  secondaryColor?: string; // New: Secondary Color
  textColor: string;
}

export interface CarouselConfig {
  slides: SlideData[];
  brandName: string;
  brandUrl: string;
}

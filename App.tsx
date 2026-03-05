import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  Layout,
  Image as ImageIcon,
  Palette,
  Globe,
  Loader2,
  Upload,
  Code2,
  Settings2,
  Check,
} from "lucide-react";
import { toPng } from "html-to-image";
import { SlideData, ThemeMode } from "./types";
import SlidePreview from "./components/SlidePreview";
import { generateCarouselContent } from "./services/geminiService";

// Themes Configuration based on the requested image
const PRESET_THEMES = [
  {
    id: "navy",
    name: "كحلي المستثمر",
    bg: "#0D1137",
    accent: "#00E1C1",
    secondary: "#334155",
    text: "#FFFFFF",
  },
  {
    id: "china",
    name: "الأحمر الصيني",
    bg: "#FFFFFF",
    accent: "#D90429",
    secondary: "#EF233C",
    text: "#2B2D42",
  },
  {
    id: "fuchsia",
    name: "فوشيا التحليل",
    bg: "#FFFFFF",
    accent: "#FF006E",
    secondary: "#3A86FF",
    text: "#000000",
  },
  {
    id: "cyan",
    name: "سيان الابتكار",
    bg: "#FFFFFF",
    accent: "#06D6A0",
    secondary: "#118AB2",
    text: "#073B4C",
  },
  {
    id: "lime",
    name: "لايم النمو",
    bg: "#F0F3FA",
    accent: "#70E000",
    secondary: "#0077B6",
    text: "#03045E",
  },
  {
    id: "orange",
    name: "برتقالي الحركة",
    bg: "#FFFFFF",
    accent: "#FB8500",
    secondary: "#FFB703",
    text: "#023047",
  },
  {
    id: "dark",
    name: "الوضع الداكن",
    bg: "#1A1A1A",
    accent: "#00FF9D",
    secondary: "#FF0055",
    text: "#F5F5F5",
  },
  {
    id: "purple",
    name: "بنفسجي العمق",
    bg: "#FFFFFF",
    accent: "#7209B7",
    secondary: "#4CC9F0",
    text: "#10002B",
  },
];

const DEFAULT_SLIDE: SlideData = {
  id: "1",
  title: "نمو أعمالك بدون تشتيت",
  description:
    "دع علامتنا التجارية تتولى المهام الصعبة. ركز طاقتك على ما يدفع عملك للأمام.",
  highlightedWord: "تشتيت",
  ctaText: "انضم الآن!",
  footerUrl: "yourwebsite.com",
  logoText: "براندك",
  theme: ThemeMode.DARK,
  backgroundColor: PRESET_THEMES[0].bg,
  accentColor: PRESET_THEMES[0].accent,
  secondaryColor: PRESET_THEMES[0].secondary,
  textColor: PRESET_THEMES[0].text,
};

function App() {
  const [slides, setSlides] = useState<SlideData[]>([DEFAULT_SLIDE]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "css">("editor");
  const [customCss, setCustomCss] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Apply custom CSS dynamically
  useEffect(() => {
    const styleId = "custom-slide-styles";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = customCss;
  }, [customCss]);

  const addSlide = () => {
    const lastSlide = slides[slides.length - 1];
    const newSlide: SlideData = {
      ...DEFAULT_SLIDE,
      id: Math.random().toString(36).substr(2, 9),
      // Inherit styles from the last slide to maintain consistency
      backgroundColor: lastSlide.backgroundColor,
      textColor: lastSlide.textColor,
      accentColor: lastSlide.accentColor,
      secondaryColor: lastSlide.secondaryColor,
      logoUrl: lastSlide.logoUrl,
      logoText: lastSlide.logoText,
      footerUrl: lastSlide.footerUrl,
    };
    setSlides([...slides, newSlide]);
    setActiveIndex(slides.length);
  };

  const removeSlide = (id: string) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((s) => s.id !== id);
    setSlides(newSlides);
    if (activeIndex >= newSlides.length) {
      setActiveIndex(newSlides.length - 1);
    }
  };

  const updateSlide = (id: string, updates: Partial<SlideData>) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  };

  const updateAllSlides = (updates: Partial<SlideData>) => {
    setSlides((prev) => prev.map((s) => ({ ...s, ...updates })));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateCarouselContent(prompt);
      if (generated.length > 0) {
        const currentStyle = slides[activeIndex] || DEFAULT_SLIDE;
        const enhanced = generated.map((s, idx) => ({
          ...s,
          backgroundColor: currentStyle.backgroundColor,
          textColor: currentStyle.textColor,
          accentColor: currentStyle.accentColor,
          secondaryColor: currentStyle.secondaryColor,
          footerUrl: currentStyle.footerUrl,
          logoText: currentStyle.logoText,
          logoUrl: currentStyle.logoUrl,
        }));
        setSlides(enhanced);
        setActiveIndex(0);
      }
    } catch (err) {
      alert("حدث خطأ أثناء التوليد. حاول مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (slideRef.current === null) {
      return;
    }

    try {
      // Create a blob from the slide reference
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Higher quality
        backgroundColor: currentSlide.backgroundColor, // Ensure no transparency issues
      });

      const link = document.createElement("a");
      link.download = `carousel-slide-${activeIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong!", err);
      alert("حدث خطأ أثناء تصدير الصورة، يرجى المحاولة مرة أخرى.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSlide(slides[activeIndex].id, {
          imageUrl: reader.result as string,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAllSlides({ logoUrl: reader.result as string });
        if (logoInputRef.current) logoInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTheme = (theme: (typeof PRESET_THEMES)[0]) => {
    updateAllSlides({
      backgroundColor: theme.bg,
      accentColor: theme.accent,
      secondaryColor: theme.secondary,
      textColor: theme.text,
    });
  };

  const currentSlide = slides[activeIndex];

  return (
    <div className="app-container">
      {/* Sidebar (Editor) */}
      <aside className="sidebar-editor scrollbar-hide">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="header-icon-box">
            <Layout className="w-6 h-6" />
          </div>
          <div className="header-title-box">
            <h1>صانع الكاروسيل</h1>
            <p className="header-subtitle">مستثمرك الرقمي المحترف</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            onClick={() => setActiveTab("editor")}
            className={`tab-button ${activeTab === "editor" ? "active" : ""}`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            الإعدادات
          </button>
          <button
            onClick={() => setActiveTab("css")}
            className={`tab-button ${activeTab === "css" ? "active" : ""}`}
          >
            <Code2 className="w-3.5 h-3.5" />
            تخصيص CSS
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="editor-content custom-scrollbar">
          {activeTab === "editor" ? (
            <>
              {/* THEMES SECTION */}
              <div className="editor-section">
                <h3 className="section-title">
                  <Palette className="w-3.5 h-3.5" />
                  الثيمات الجاهزة
                </h3>
                <div className="theme-grid">
                  {PRESET_THEMES.map((theme) => {
                    const isActive =
                      currentSlide.backgroundColor === theme.bg &&
                      currentSlide.accentColor === theme.accent;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => applyTheme(theme)}
                        className={`theme-card ${isActive ? "active" : ""}`}
                      >
                        <div className="theme-preview-dots">
                          <div
                            className="theme-dot"
                            style={{ backgroundColor: theme.accent }}
                          ></div>
                          <div
                            className="theme-dot"
                            style={{
                              backgroundColor:
                                theme.bg === "#FFFFFF" ? "#eee" : theme.bg,
                            }}
                          ></div>
                        </div>
                        <span className="theme-name">{theme.name}</span>
                        {isActive && (
                          <div className="active-indicator animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LOGO SECTION */}
              <div className="editor-section">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 className="section-title" style={{ marginBottom: 0 }}>
                    شعار المؤسسة (Logo)
                  </h3>
                  {currentSlide.logoUrl && (
                    <button
                      onClick={() => updateAllSlides({ logoUrl: undefined })}
                      style={{
                        padding: "0.375rem",
                        color: "#f87171",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                      title="حذف الشعار"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="upload-area"
                    style={{ height: "3.5rem" }}
                  >
                    <input
                      ref={logoInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    {currentSlide.logoUrl ? (
                      <img
                        src={currentSlide.logoUrl}
                        style={{ height: "2rem", objectFit: "contain" }}
                        alt="Logo"
                      />
                    ) : (
                      <span className="upload-text">
                        اضغط لرفع الشعار (PNG, JPG)
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      width: "3rem",
                      height: "3.5rem",
                      border: "1px dashed var(--border-color)",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "2px",
                        height: "1.5rem",
                        backgroundColor: "var(--border-color)",
                        borderRadius: "1px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* COLOR CUSTOMIZATION SECTION */}
              <div className="editor-section">
                <h3 className="section-title">تخصيص الألوان</h3>
                <div className="color-grid">
                  {/* Primary */}
                  <div className="input-group">
                    <label className="input-label">الأساسي</label>
                    <div className="color-input-container">
                      <span className="color-hex">
                        {currentSlide.accentColor}
                      </span>
                      <input
                        type="color"
                        value={currentSlide.accentColor}
                        onChange={(e) =>
                          updateAllSlides({ accentColor: e.target.value })
                        }
                        className="color-picker"
                      />
                    </div>
                  </div>

                  {/* Secondary */}
                  <div className="input-group">
                    <label className="input-label">الثانوي</label>
                    <div className="color-input-container">
                      <span className="color-hex">
                        {currentSlide.secondaryColor || "#------"}
                      </span>
                      <input
                        type="color"
                        value={currentSlide.secondaryColor || "#ffffff"}
                        onChange={(e) =>
                          updateAllSlides({ secondaryColor: e.target.value })
                        }
                        className="color-picker"
                      />
                    </div>
                  </div>

                  {/* Background */}
                  <div className="input-group">
                    <label className="input-label">الخلفية</label>
                    <div className="color-input-container">
                      <span className="color-hex">
                        {currentSlide.backgroundColor}
                      </span>
                      <input
                        type="color"
                        value={currentSlide.backgroundColor}
                        onChange={(e) =>
                          updateAllSlides({ backgroundColor: e.target.value })
                        }
                        className="color-picker"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="input-group">
                    <label className="input-label">النصوص</label>
                    <div className="color-input-container">
                      <span className="color-hex">
                        {currentSlide.textColor}
                      </span>
                      <input
                        type="color"
                        value={currentSlide.textColor}
                        onChange={(e) =>
                          updateAllSlides({ textColor: e.target.value })
                        }
                        className="color-picker"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GENERATION & CONTENT */}
              <div className="editor-section">
                {/* AI Generation Box */}
                <div className="ai-generation-box">
                  <div className="ai-glow"></div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      color: "#22d3ee",
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      توليد المحتوى
                    </span>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب موضوع الكاروسيل..."
                    className="textarea-input"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.4)",
                      minHeight: "80px",
                    }}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="ai-button"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    توليد
                  </button>
                </div>

                {/* Content Editing */}
                <div className="editor-section" style={{ marginTop: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 900,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      تعديل النصوص {activeIndex + 1}
                    </h3>
                  </div>

                  {/* Image Upload Area */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-area"
                    >
                      {currentSlide.imageUrl ? (
                        <>
                          <img
                            src={currentSlide.imageUrl}
                            className="upload-preview"
                          />
                          <div className="upload-overlay">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon
                            className="w-6 h-6"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                          />
                          <span className="upload-text">صورة الشريحة</span>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    {currentSlide.imageUrl && (
                      <button
                        onClick={() =>
                          updateSlide(currentSlide.id, { imageUrl: undefined })
                        }
                        style={{
                          fontSize: "0.625rem",
                          color: "#f87171",
                          fontWeight: 700,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "right",
                          textDecoration: "underline",
                        }}
                      >
                        إزالة الصورة
                      </button>
                    )}
                  </div>

                  {/* Text Inputs */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <input
                      value={currentSlide.title}
                      onChange={(e) =>
                        updateSlide(currentSlide.id, { title: e.target.value })
                      }
                      placeholder="العنوان"
                      className="text-input"
                      style={{ fontWeight: 700 }}
                    />
                    <input
                      value={currentSlide.highlightedWord}
                      onChange={(e) =>
                        updateSlide(currentSlide.id, {
                          highlightedWord: e.target.value,
                        })
                      }
                      placeholder="الكلمة المميزة"
                      className="text-input"
                      style={{ fontWeight: 700 }}
                    />
                    <textarea
                      value={currentSlide.description}
                      onChange={(e) =>
                        updateSlide(currentSlide.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="الوصف"
                      className="textarea-input"
                      style={{ fontWeight: 500 }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* CSS CUSTOM TAB */
            <div className="css-editor-container">
              <div className="css-editor-header" dir="ltr">
                <h3
                  style={{
                    textAlign: "right",
                    color: "#22d3ee",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  محرر CSS المتقدم
                </h3>
                <div className="css-editor-help">
                  <span>Classes: </span>
                  <span style={{ color: "#67e8f9" }}>
                    .slide-container
                  </span>,{" "}
                  <span style={{ color: "#67e8f9" }}>.slide-title</span>,{" "}
                  <span style={{ color: "#67e8f9" }}>.slide-description</span>,{" "}
                  <span style={{ color: "#67e8f9" }}>.slide-cta</span>,{" "}
                  <span style={{ color: "#67e8f9" }}>.slide-image</span>
                </div>
              </div>

              <div className="css-editor-area">
                <textarea
                  spellCheck={false}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder={`.slide-container { \n  border-radius: 20px; \n}\n.slide-title {\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);\n}`}
                  className="css-textarea"
                  dir="ltr"
                />
              </div>

              <button onClick={() => setCustomCss("")} className="reset-button">
                إعادة تعيين CSS
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-workspace mesh-gradient">
        {/* Top Header Actions */}
        <div className="workspace-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <h2 className="preview-title">المعاينة النهائية</h2>
            <div className="slide-pagination">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`page-btn ${activeIndex === i ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={addSlide} className="page-btn add-slide-btn">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button onClick={handleExport} className="export-button">
            <Download className="w-5 h-5" />
            تصدير الصورة الحالية
          </button>
        </div>

        {/* Center Carousel Display */}
        <div className="carousel-display">
          <button
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="nav-arrow prev"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="preview-container">
            <SlidePreview
              ref={slideRef}
              slide={currentSlide}
              index={activeIndex + 1}
              total={slides.length}
            />
          </div>

          <button
            onClick={() =>
              setActiveIndex((prev) => Math.min(slides.length - 1, prev + 1))
            }
            disabled={activeIndex === slides.length - 1}
            className="nav-arrow next"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>

        {/* Timeline Bottom Progress */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

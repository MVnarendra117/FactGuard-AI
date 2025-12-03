import React, { useState, useEffect } from "react";
import TextAnalyzer from "./components/TextAnalyzer";
import ImageAnalyzer from "./components/ImageAnalyzer";
import LandingPage from "./components/LandingPage";
import {
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

type Tab = "text" | "image";

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Render Landing Page
  if (showLanding) {
    return (
      <LandingPage
        onEnter={() => setShowLanding(false)}
        isDarkMode={isDarkMode}
      />
    );
  }

  // Render Main Application
  return (
    <div
      className={`min-h-screen font-inter relative overflow-x-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100 selection:bg-cyan-500/30"
          : "bg-slate-50 text-slate-900 selection:bg-blue-200"
      }`}
    >
      {/* Background Effects (Dark Mode Only) */}
      {isDarkMode && (
        <>
          <div className="fixed inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none z-0"></div>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        </>
      )}
      {/* Background Effects (Light Mode) */}
      {!isDarkMode && (
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none z-0 invert"></div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-slate-950/80 border-slate-800"
            : "bg-white/80 border-slate-200"
        } backdrop-blur-xl`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setShowLanding(true)}
            >
              <div
                className={`p-2.5 rounded-xl shadow-lg ring-1 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-cyan-500 to-blue-700 shadow-cyan-900/20 ring-white/10"
                    : "bg-gradient-to-br from-blue-600 to-cyan-500 shadow-blue-200 ring-black/5"
                }`}
              >
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-black tracking-tighter ${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400"
                      : "text-slate-900"
                  }`}
                >
                  FactGuard<span className="text-cyan-600">.AI</span>
                </h1>
                <p
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Advanced Forensic Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full transition-all ${
                  isDarkMode
                    ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Intro */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h2
            className={`text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Truth in the Age of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              Synthetic Media
            </span>
          </h2>
          <p
            className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Powered by Google AI, we verify claims with trusted news sources and
            detect manipulation artifacts in images.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div
            className={`p-1.5 rounded-2xl border flex shadow-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-slate-900/90 border-slate-800 ring-1 ring-white/5"
                : "bg-white border-slate-200 ring-1 ring-black/5"
            }`}
          >
            <button
              onClick={() => setActiveTab("text")}
              className={`flex items-center gap-3 px-10 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "text"
                  ? (isDarkMode
                      ? "bg-gradient-to-b from-slate-800 to-slate-900 text-cyan-400 border-slate-700/50 ring-cyan-500/20"
                      : "bg-slate-100 text-blue-700 border-slate-200") +
                    " shadow-lg border scale-100 ring-1"
                  : isDarkMode
                  ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-5 h-5" />
              TEXT & NEWS ANALYSIS
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`flex items-center gap-3 px-10 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "image"
                  ? (isDarkMode
                      ? "bg-gradient-to-b from-slate-800 to-slate-900 text-cyan-400 border-slate-700/50 ring-cyan-500/20"
                      : "bg-slate-100 text-blue-700 border-slate-200") +
                    " shadow-lg border scale-100 ring-1"
                  : isDarkMode
                  ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              IMAGE FORENSICS
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[600px] transition-all duration-500">
          {activeTab === "text" ? (
            <TextAnalyzer isDarkMode={isDarkMode} />
          ) : (
            <ImageAnalyzer isDarkMode={isDarkMode} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t mt-20 py-12 backdrop-blur-md ${
          isDarkMode
            ? "border-slate-900 bg-slate-950/80"
            : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div
            className={`flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all ${
              isDarkMode ? "text-slate-600" : "text-slate-400"
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
            <span className="font-black text-lg tracking-widest">
              FactGuard
            </span>
          </div>
          <p
            className={`text-sm max-w-lg mx-auto leading-relaxed ${
              isDarkMode ? "text-slate-600" : "text-slate-500"
            }`}
          >
            Analysis provided by Google Gemini 2.5 Flash. Results are
            probabilistic. <br />
            Always cross-reference with multiple authoritative human sources.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

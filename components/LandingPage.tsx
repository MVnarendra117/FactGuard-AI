import React from "react";
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Globe2,
  ScanLine,
  BrainCircuit,
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, isDarkMode }) => {
  return (
    <div
      className={`h-screen w-full flex flex-col items-center relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background Effects */}
      {isDarkMode ? (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none invert"></div>
      )}

      {/* Main Container - Centered Vertically */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div
            className={`mb-6 p-3 rounded-2xl shadow-2xl ring-1 scale-90 md:scale-100 ${
              isDarkMode
                ? "bg-gradient-to-br from-cyan-500 to-blue-700 shadow-cyan-900/20 ring-white/10"
                : "bg-gradient-to-br from-blue-600 to-cyan-500 shadow-blue-200 ring-black/5"
            }`}
          >
            <ShieldCheck className="w-12 h-12 md:w-14 md:h-14 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
            <span className={isDarkMode ? "text-white" : "text-slate-900"}>
              FactGuard
            </span>
            <span className="text-cyan-500">.AI</span>
          </h1>

          <p
            className={`text-base md:text-lg max-w-xl font-medium leading-relaxed mb-8 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Veritas AI is an advanced truth-verification engine that analyzes
            text and images using Google’s AI models. It detects AI-generated or
            manipulated visuals and cross-checks news claims against reliable
            global sources to identify misinformation, deepfakes, and fake news
            in real time.
          </p>

          <button
            onClick={onEnter}
            className="group relative px-8 py-4 text-lg font-bold text-white rounded-xl overflow-hidden shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/40 mb-8 md:mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 transition-all group-hover:bg-gradient-to-br"></div>
            <div className="relative flex items-center gap-3">
              Launch Platform
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* How it Works Section - Compact Grid */}
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-16 delay-100 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Step 1 */}
            <div
              className={`p-5 rounded-xl border transition-all hover:-translate-y-1 flex flex-col items-center ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-800"
                  : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  isDarkMode
                    ? "bg-slate-800 text-cyan-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">AI Analysis</h3>
              <p
                className={`text-xs leading-relaxed max-w-[200px] ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Ingests text & pixel data to find anomalies.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`p-5 rounded-xl border transition-all hover:-translate-y-1 flex flex-col items-center ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-800"
                  : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  isDarkMode
                    ? "bg-slate-800 text-cyan-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Global Verification</h3>
              <p
                className={`text-xs leading-relaxed max-w-[200px] ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Cross-checks Reuters, AP & BBC in real-time.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`p-5 rounded-xl border transition-all hover:-translate-y-1 flex flex-col items-center ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-800"
                  : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  isDarkMode
                    ? "bg-slate-800 text-cyan-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <ScanLine className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Forensic Verdict</h3>
              <p
                className={`text-xs leading-relaxed max-w-[200px] ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Actionable "Trust Scores" & citation links.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer - Compact */}
        <div
          className={`mt-8 md:mt-12 p-3 md:p-4 rounded-lg border max-w-2xl flex items-center gap-3 text-left animate-in fade-in delay-200 ${
            isDarkMode
              ? "bg-yellow-950/20 border-yellow-900/30 text-yellow-200/60"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0 opacity-80" />
          <div className="text-[10px] md:text-xs leading-relaxed opacity-90">
            <strong className="uppercase font-bold mr-1">Disclaimer:</strong>
            Generated by AI. Results are probabilistic. Verify with human
            sources.
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

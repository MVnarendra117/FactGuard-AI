import React, { useState } from "react";
import { analyzeTextMisinformation } from "../services/geminiService";
import { TextAnalysisResult, LoadingState } from "../types";
import {
  AlertCircle,
  Search,
  ExternalLink,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Info,
  ShieldAlert,
  Flag,
  Lock,
  Eye,
  Radio,
  Globe2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface TextAnalyzerProps {
  isDarkMode: boolean;
}

const TextAnalyzer: React.FC<TextAnalyzerProps> = ({ isDarkMode }) => {
  const [text, setText] = useState("");
  const [analyzedContent, setAnalyzedContent] = useState("");
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<TextAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setStatus(LoadingState.ANALYZING);
    setAnalyzedContent(text);
    setText(""); // Clear input
    setError(null);
    setResult(null);

    try {
      const data = await analyzeTextMisinformation(text);
      setResult(data);
      setStatus(LoadingState.COMPLETE);
    } catch (err) {
      setError("Failed to analyze text. Please try again.");
      setStatus(LoadingState.ERROR);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "#22c55e"; // Green (Real)
    if (score >= 50) return "#eab308"; // Yellow (Mixed)
    return "#ef4444"; // Red (Fake)
  };

  const getLabelTheme = (score: number) => {
    if (score >= 75) {
      // REAL
      return {
        bg: isDarkMode ? "bg-green-950/40" : "bg-green-50",
        border: isDarkMode ? "border-green-500/50" : "border-green-200",
        text: isDarkMode ? "text-green-500" : "text-green-700",
        bar: "bg-green-500",
        icon: <CheckCircle2 className="w-6 h-6" />,
      };
    }
    if (score >= 50) {
      // MIXED / HALF-REAL
      return {
        bg: isDarkMode ? "bg-yellow-950/40" : "bg-yellow-50",
        border: isDarkMode ? "border-yellow-500/50" : "border-yellow-200",
        text: isDarkMode ? "text-yellow-500" : "text-yellow-700",
        bar: "bg-yellow-500",
        icon: <Scale className="w-6 h-6" />,
      };
    }
    // FAKE
    return {
      bg: isDarkMode ? "bg-red-950/40" : "bg-red-50",
      border: isDarkMode ? "border-red-500/50" : "border-red-200",
      text: isDarkMode ? "text-red-500" : "text-red-700",
      bar: "bg-red-500",
      icon: <AlertTriangle className="w-6 h-6" />,
    };
  };

  const EvidenceStrengthMeter = ({
    strength,
    score,
  }: {
    strength: string;
    score: number;
  }) => {
    const levels = [
      "No Evidence",
      "Weak",
      "Strong Contradiction",
      "Verified Truth",
    ];
    // Map string strength to index roughly, or use score logic
    let activeIndex = 0;
    if (score >= 75) activeIndex = 3;
    else if (score >= 50) activeIndex = 2; // Mixed/Weak
    else if (score >= 30)
      activeIndex = 1; // Strong Contradiction (usually means we found evidence it is fake)
    else activeIndex = 0; // No Evidence / Fake

    // Override based on explicit string if needed
    if (strength.toLowerCase().includes("verified")) activeIndex = 3;

    const theme = getLabelTheme(score);

    return (
      <div className="w-full mt-4">
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider mb-2 opacity-60">
          <span>Weak Evidence</span>
          <span>Strong Evidence</span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full flex gap-1 overflow-hidden">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 transition-all duration-500 ${
                step <= activeIndex ? theme.bar : "bg-transparent"
              }`}
            />
          ))}
        </div>
        <p className={`text-right text-xs font-bold mt-2 ${theme.text}`}>
          {strength}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Input Section - Now Full Width at Top */}
      <div className="w-full">
        <div
          className={`rounded-2xl p-6 shadow-2xl border flex flex-col relative overflow-hidden group transition-colors ${
            isDarkMode
              ? "bg-slate-900/80 border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          <label className="block text-sm font-bold text-cyan-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            Input Source
          </label>
          <textarea
            className={`flex-1 min-h-[150px] w-full rounded-xl p-5 outline-none resize-y transition-all placeholder-slate-400 text-sm leading-relaxed font-mono border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              isDarkMode
                ? "bg-slate-950 border-slate-700 text-slate-100"
                : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
            placeholder="Paste news article, social media post, WhatsApp forward, or survey text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-6">
            <button
              onClick={handleAnalyze}
              disabled={status === LoadingState.ANALYZING || !text.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20 active:scale-95 text-lg"
            >
              {status === LoadingState.ANALYZING ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fact-Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Verify Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section - Full Width Below */}
      <div className="w-full">
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-200 p-6 rounded-xl flex items-center gap-4 mb-6 shadow-lg">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {status === LoadingState.ANALYZING && (
          <div
            className={`min-h-[400px] rounded-2xl border border-dashed flex flex-col items-center justify-center p-12 relative overflow-hidden ${
              isDarkMode
                ? "bg-slate-900/40 border-slate-800"
                : "bg-slate-50 border-slate-300"
            }`}
          >
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center">
              <Loader2 className="w-16 h-16 animate-spin mb-6 text-cyan-500" />
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Investigating...
              </h3>
              <div className="flex flex-col gap-2 items-center text-sm font-mono text-cyan-500/80 mt-4">
                <span className="animate-pulse delay-75">
                  {" "}
                  Checking trusted sources (Reuters, AP)
                </span>
                <span className="animate-pulse delay-150">
                  {" "}
                  Comparing news channels
                </span>
                <span className="animate-pulse delay-300">
                  {" "}
                  Analyzing consensus
                </span>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Analyzed Content Block */}
            {analyzedContent && (
              <div
                className={`rounded-xl p-4 border text-sm relative group ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-700 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold uppercase tracking-widest border px-2 py-1 rounded-md">
                    User Content
                  </span>
                </div>
                <p className="line-clamp-3 font-mono leading-relaxed pr-8">
                  {analyzedContent}
                </p>
              </div>
            )}

            {/* Action Toolbar - Download removed */}
            <div className="flex justify-end gap-2">
              <button
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold text-red-500 ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-white hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Flag className="w-4 h-4" /> Report
              </button>
            </div>

            {/* Verdict Banner & Summary */}
            <div
              className={`rounded-2xl p-8 shadow-xl border-2 relative overflow-hidden ${
                getLabelTheme(result.trustScore).bg
              } ${getLabelTheme(result.trustScore).border}`}
            >
              <div className="absolute top-4 right-4 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/10 backdrop-blur-sm">
                {result.category}
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Gauge */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { value: result.trustScore },
                          { value: 100 - result.trustScore },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        <Cell fill={getScoreColor(result.trustScore)} />
                        <Cell fill={isDarkMode ? "#1e293b" : "#e2e8f0"} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-3xl font-black ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {result.trustScore}
                    </span>
                  </div>
                  <div className="absolute -bottom-6 w-full text-center text-[10px] font-bold uppercase opacity-60">
                    Trust Score
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <h2
                    className={`text-4xl font-black uppercase tracking-tighter mb-2 ${
                      getLabelTheme(result.trustScore).text
                    }`}
                  >
                    {result.label}
                  </h2>
                  <p
                    className={`text-lg font-medium leading-snug ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {result.summary}
                  </p>
                  <EvidenceStrengthMeter
                    strength={result.evidenceStrength}
                    score={result.trustScore}
                  />
                </div>
              </div>
            </div>

            {/* Consensus Analysis Section */}
            <div
              className={`rounded-2xl p-6 shadow-lg border relative overflow-hidden ${
                isDarkMode
                  ? "bg-indigo-950/20 border-indigo-500/30"
                  : "bg-indigo-50 border-indigo-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-indigo-900/50 text-indigo-400"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-indigo-200" : "text-indigo-900"
                  }`}
                >
                  News Channel Consensus
                </h3>
              </div>
              <p
                className={`text-base leading-relaxed ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {result.consensusAnalysis}
              </p>
            </div>

            {/* Explanation Card */}
            <div
              className={`rounded-2xl p-6 shadow-lg border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Detailed Explanation
              </h3>
              <p
                className={`text-lg leading-relaxed ${
                  isDarkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {result.explanation}
              </p>
            </div>

            {/* Facts vs Fake Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What is True */}
              <div
                className={`p-6 rounded-xl border shadow-sm ${
                  isDarkMode
                    ? "bg-green-950/20 border-green-900/50"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div
                  className={`flex items-center gap-3 mb-4 font-bold text-lg border-b pb-3 ${
                    isDarkMode
                      ? "text-green-400 border-green-900/50"
                      : "text-green-700 border-green-200"
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <h3>Substantiated Facts</h3>
                </div>
                <ul className="space-y-3">
                  {result.substantiatedFacts.length > 0 ? (
                    result.substantiatedFacts.map((item, i) => (
                      <li
                        key={i}
                        className={`flex gap-3 items-start ${
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed text-sm">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm italic opacity-60">
                      No verified facts found.
                    </li>
                  )}
                </ul>
              </div>

              {/* What is Fake */}
              <div
                className={`p-6 rounded-xl border shadow-sm ${
                  isDarkMode
                    ? "bg-red-950/20 border-red-900/50"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`flex items-center gap-3 mb-4 font-bold text-lg border-b pb-3 ${
                    isDarkMode
                      ? "text-red-400 border-red-900/50"
                      : "text-red-700 border-red-200"
                  }`}
                >
                  <XCircle className="w-6 h-6" />
                  <h3>False Claims</h3>
                </div>
                <ul className="space-y-3">
                  {result.falseClaims.length > 0 ? (
                    result.falseClaims.map((item, i) => (
                      <li
                        key={i}
                        className={`flex gap-3 items-start ${
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed text-sm">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm italic opacity-60">
                      No false claims detected.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Safety & Sources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Safety Tips */}
              <div
                className={`p-6 rounded-xl border shadow-sm ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-4 text-cyan-500 font-bold border-b border-slate-700/50 pb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>User Safety Tips</span>
                </div>
                <ul className="space-y-3">
                  {result.safetyTips.map((tip, i) => (
                    <li
                      key={i}
                      className={`flex gap-3 items-center text-sm ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <Lock className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sources */}
              <div
                className={`p-6 rounded-xl border shadow-sm ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-4 text-cyan-500 font-bold border-b border-slate-700/50 pb-2">
                  <Search className="w-4 h-4" />
                  <span>Verified Sources Checked</span>
                </div>
                {result.groundingChunks.length > 0 ? (
                  <ul className="space-y-3">
                    {result.groundingChunks.map((chunk, idx) =>
                      chunk.web?.uri ? (
                        <li key={idx}>
                          <a
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all group ${
                              isDarkMode
                                ? "bg-slate-950 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900"
                                : "bg-slate-50 border-slate-200 hover:border-cyan-500/50 hover:bg-white"
                            }`}
                          >
                            <div className="flex-1 min-w-0 mr-3">
                              <div
                                className={`text-sm font-medium truncate transition-colors ${
                                  isDarkMode
                                    ? "text-slate-300 group-hover:text-cyan-400"
                                    : "text-slate-700 group-hover:text-blue-600"
                                }`}
                              >
                                {chunk.web.title}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono truncate">
                                {new URL(chunk.web.uri).hostname}
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                          </a>
                        </li>
                      ) : null
                    )}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic">
                    No specific web citations found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAnalyzer;

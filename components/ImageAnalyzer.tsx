import React, { useState, useRef } from 'react';
import { analyzeImageAI } from '../services/geminiService';
import { ImageAnalysisResult, LoadingState } from '../types';
import { Upload, Image as ImageIcon, Loader2, AlertTriangle, ShieldCheck, Eye, ScanLine, Search, Flag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ImageAnalyzerProps {
  isDarkMode: boolean;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ isDarkMode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
        setStatus(LoadingState.IDLE);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setStatus(LoadingState.ANALYZING);
    setAnalyzedImage(image);
    setImage(null); // Clear input preview
    setResult(null);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const base64Data = image.split(',')[1];
      
      const data = await analyzeImageAI(base64Data, mimeType);
      setResult(data);
      setStatus(LoadingState.COMPLETE);
    } catch (err) {
      setError("Failed to analyze image.");
      setStatus(LoadingState.ERROR);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 40) return "#22c55e"; // Green - Real
    if (score < 70) return "#eab308"; // Yellow - Suspicious
    return "#ef4444"; // Red - AI
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* Upload & Preview Section - Full Width Top */}
      <div className="w-full space-y-6">
          <div 
            className={`group relative rounded-2xl overflow-hidden transition-all h-[500px] border-2 shadow-2xl ${
                isDarkMode 
                    ? 'bg-slate-900 ' + (image ? 'border-slate-700' : 'border-dashed border-slate-600 hover:border-cyan-400') 
                    : 'bg-white ' + (image ? 'border-slate-200' : 'border-dashed border-slate-300 hover:border-blue-400')
            }`}
          >
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                disabled={status === LoadingState.ANALYZING}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
              />
            
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                 <img 
                    src={image} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain" 
                 />
                 
                 {/* Reset Button */}
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setResult(null);
                        if(fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-4 right-4 z-30 bg-slate-900/80 hover:bg-red-900/90 text-white p-3 rounded-xl backdrop-blur-sm transition-all border border-slate-600 hover:border-red-500 shadow-lg"
                 >
                    <AlertTriangle className="w-5 h-5" />
                 </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
                 {/* Scanning Overlay when analyzing (without image preview) */}
                 {status === LoadingState.ANALYZING && (
                    <div className="absolute inset-0 z-30 overflow-hidden bg-slate-950/80 flex items-center justify-center">
                        <div className="absolute w-full h-2 bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,1)] animate-scan blur-[1px]"></div>
                        <div className="bg-black/80 text-cyan-400 px-6 py-3 rounded-full border border-cyan-500/50 backdrop-blur-md font-mono flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>SCANNING_PIXELS...</span>
                        </div>
                    </div>
                 )}

                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform shadow-lg border ${
                    isDarkMode ? 'bg-slate-800 text-cyan-400 border-slate-700 shadow-cyan-900/20 group-hover:border-cyan-500' : 'bg-slate-100 text-blue-500 border-slate-200 group-hover:border-blue-400'
                }`}>
                  <Upload className="w-10 h-10" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Upload Image</h3>
                <p className={`text-sm max-w-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Drag & drop or click to upload. <br/>
                  <span className={isDarkMode ? 'text-cyan-500/70' : 'text-blue-500/70'}>Optimized for Midjourney v6 & DALL-E 3 detection</span>
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || status === LoadingState.ANALYZING}
            className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-5 rounded-xl shadow-xl shadow-cyan-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg group active:scale-[0.99]"
          >
             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             {status === LoadingState.ANALYZING ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Running Forensics...
              </>
            ) : (
              <>
                <ScanLine className="w-6 h-6" />
                Run Detection
              </>
            )}
          </button>
          
           {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                {error}
            </div>
            )}
      </div>

      {/* Results Section - Full Width Below */}
      {result && (
        <div className="w-full">
            <div className={`rounded-2xl p-8 shadow-2xl border relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 flex flex-col ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
                
                {/* Analyzed Image Preview in Result */}
                {analyzedImage && (
                    <div className="mb-8 flex justify-center bg-black/50 p-4 rounded-xl">
                        <img src={analyzedImage} alt="Analyzed" className="max-h-[300px] object-contain rounded-lg shadow-lg" />
                    </div>
                )}
                
                {/* Toolbar */}
                <div className="absolute top-6 right-6 flex gap-2 z-10">
                    <button className={`p-2 rounded-lg transition-colors text-slate-400 hover:text-red-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                        <Flag className="w-4 h-4" />
                    </button>
                </div>

                <div className={`flex items-start justify-between mb-10 border-b pb-6 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div>
                        <h2 className={`text-3xl font-black mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ANALYSIS REPORT</h2>
                        <p className="text-slate-400 font-mono text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            CONFIDENCE: <span className="text-cyan-500 font-bold">{result.confidence.toUpperCase()}</span>
                        </p>
                    </div>
                    
                    {/* Dramatic Verdict Stamp */}
                    <div className={`
                        px-6 py-3 border-[6px] rounded-lg font-black text-3xl uppercase tracking-widest transform -rotate-12 shadow-2xl backdrop-blur-md stamp-text mt-8 md:mt-0
                        ${result.aiLikelihood > 50 
                            ? 'border-red-600 text-red-500 bg-red-950/30' 
                            : result.aiLikelihood < 30 
                                ? 'border-green-600 text-green-500 bg-green-950/30' 
                                : 'border-yellow-600 text-yellow-500 bg-yellow-950/30'}
                    `}>
                        {result.verdict}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 mb-8">
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: result.aiLikelihood }, { value: 100 - result.aiLikelihood }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    <Cell fill={getRiskColor(result.aiLikelihood)} />
                                    <Cell fill={isDarkMode ? "#1e293b" : "#e2e8f0"} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{result.aiLikelihood}%</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Synthetic Probability</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-4 w-full">
                        <h3 className={`font-bold border-b pb-2 flex items-center gap-2 ${isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-200'}`}>
                            <Search className="w-4 h-4 text-cyan-500" />
                            FORENSIC FINDINGS
                        </h3>
                        <ul className="space-y-3">
                            {result.visualArtifacts.map((artifact, i) => (
                                <li key={i} className={`flex items-start gap-3 text-sm p-3 rounded-lg border ${
                                    isDarkMode ? 'text-slate-300 bg-slate-900/50 border-slate-800' : 'text-slate-700 bg-slate-50 border-slate-200'
                                }`}>
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    {artifact}
                                </li>
                            ))}
                            {result.visualArtifacts.length === 0 && (
                                <li className={`flex items-start gap-3 text-sm italic p-4 rounded-lg ${isDarkMode ? 'text-slate-400 bg-slate-900/30' : 'text-slate-500 bg-slate-50'}`}>
                                    <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    No obvious digital generation artifacts detected.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className={`mt-auto rounded-xl p-6 border shadow-inner ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className="text-sm font-bold text-cyan-500 mb-2 uppercase tracking-wide">Confidence Score Explanation</h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{result.reasoning}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
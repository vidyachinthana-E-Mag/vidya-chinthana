import React, { useState } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { SiteConfig } from "../../types/site";
import { GoogleGenAI } from "@google/genai";

export default function StudioAIPanel({
  draft,
  onPatch,
}: {
  draft: SiteConfig;
  onPatch: (fn: (c: SiteConfig) => SiteConfig) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);

    try {
      // Initialize Gemini AI client
      // Note: In a real app, this should be done securely via a backend, 
      // but for this prototype, we'll try to use a local or environment key
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy" });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert bilingual copywriter (English and Sinhala) for a sci-fi and science magazine called Vidya Chinthana.
        Generate a JSON object with the following fields based on this prompt: "${prompt}"
        {
          "headlineEn": "Catchy short english headline",
          "headlineSi": "Catchy short sinhala headline",
          "subheadEn": "English subhead description",
          "subheadSi": "Sinhala subhead description"
        }`,
        config: {
            responseMimeType: "application/json",
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        onPatch((c) => {
          c.hero.headlineEn = data.headlineEn || c.hero.headlineEn;
          c.hero.headlineSi = data.headlineSi || c.hero.headlineSi;
          c.hero.subheadEn = data.subheadEn || c.hero.subheadEn;
          c.hero.subheadSi = data.subheadSi || c.hero.subheadSi;
          return c;
        });
      }
    } catch (e) {
      console.error(e);
      setError("AI Generation failed. Make sure VITE_GEMINI_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-3xl rounded-full" />
        <h4 className="text-[12px] font-bold text-fuchsia-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Vidya Copilot
        </h4>
        <p className="text-[10px] text-white/50 leading-relaxed mb-4">
          Describe the vibe, topic, or layout you want. Copilot will generate bilingual copy and adjust the hero section instantly.
        </p>
        
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="studio-input w-full p-3 text-[11px] min-h-[80px]"
            placeholder="e.g. A cyberpunk themed edition about AI and the future of humanity..."
          />
          
          {error && <p className="text-red-400 text-[10px]">{error}</p>}
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-2.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Magic"}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
         <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Quick Prompts</p>
         {[
             "Quantum computing breakthrough",
             "Deep space exploration",
             "The future of genetic engineering"
         ].map(p => (
             <button
                key={p}
                onClick={() => setPrompt(p)}
                className="block w-full text-left p-2.5 rounded border border-white/10 text-[10px] text-white/60 hover:bg-white/5 hover:text-white cursor-pointer"
             >
                 "{p}"
             </button>
         ))}
      </div>
    </div>
  );
}

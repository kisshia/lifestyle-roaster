import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertTriangle, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '../components/FileUploader';
import { AnalysisDashboard } from '../components/AnalysisDashboard';
import { SampleDataButton, generateSampleData } from '../components/SampleDataButton';
import { analyzeFile, AnalysisResult } from '../utils/analysisApi';
import { Alert, AlertDescription } from '../components/ui/alert';

export function AnalyzerPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileReady = async (file: File) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeFile(file);
      setAnalysis(result);
      toast.success(`Analysis complete! Processed ${result.transactions.length} transactions.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze file.';
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = async () => {
    const sampleData = generateSampleData();
    const sampleFile = new File([sampleData], 'sample-transactions.csv', { type: 'text/csv' });
    await handleFileReady(sampleFile);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(60,130,255,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,45,149,0.25),_transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10 py-12">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-cyan-200">
            Roast Lab
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold">
            Lifestyle Roaster Control Deck
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Upload your transaction history and we will run the 7-step roast pipeline: clean, classify, detect recurring leaks,
            and fire off brutally honest recommendations.
          </p>
        </motion.div>

        <div className="mt-10 space-y-8">
          {!analysis && (
            <div className="space-y-6">
              <FileUploader onFileReady={handleFileReady} />
              <div className="text-center">
                <p className="text-slate-400 mb-4">
                  No file yet? Spin up the sample telemetry.
                </p>
                <SampleDataButton onLoadSample={handleLoadSample} />
              </div>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert className="border border-red-500/40 bg-red-500/10 text-red-100">
                  <AlertDescription className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span>{error}</span>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-[#0b1220] border border-cyan-400/40 rounded-3xl p-10 text-center shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-cyan-300/40 bg-cyan-400/10 mb-4"
                  >
                    <Activity className="w-8 h-8 text-cyan-300" />
                  </motion.div>
                  <h3 className="text-2xl">Scanning transactions...</h3>
                  <p className="text-slate-400">Charging the roast engine.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6 flex justify-center">
                <motion.button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20 transition"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Upload a new file
                </motion.button>
              </div>
              <AnalysisDashboard analysis={analysis} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

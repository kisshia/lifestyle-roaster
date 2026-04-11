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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 text-slate-900 relative overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10 py-12">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-purple-200 bg-white/80 backdrop-blur-sm shadow-sm px-5 py-2 text-sm uppercase tracking-[0.3em] text-gray-700">
            Roast Lab
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
            Lifestyle Roaster Control Deck
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto md:px-12">
            Upload your transaction history and we will run the 7-step roast pipeline: clean, classify, detect recurring leaks,
            and fire off brutally honest recommendations.
          </p>
        </motion.div>

        <div className="mt-10 space-y-8">
          {!analysis && (
            <div className="space-y-6">
              <FileUploader onFileReady={handleFileReady} />
              <div className="text-center">
                <p className="text-gray-600 mb-4">
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
                  className="bg-white/95 border border-purple-200 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-md"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-purple-300/40 bg-purple-100 mb-4"
                  >
                    <Activity className="w-8 h-8 text-purple-600" />
                  </motion.div>
                  <h3 className="text-2xl text-gray-900 font-medium">Scanning transactions...</h3>
                  <p className="text-gray-600 mt-2">Charging the roast engine.</p>
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
                  className="px-6 py-3 rounded-full border-2 border-purple-200 bg-white text-purple-700 hover:bg-purple-50 transition shadow-sm font-medium"
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

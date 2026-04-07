import { useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Info,
  TrendingDown
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FileUploader } from '../components/FileUploader';
import { AnalysisDashboard } from '../components/AnalysisDashboard';
import { SampleDataButton, generateSampleData } from '../components/SampleDataButton';
import { analyzeTransactions, Transaction, AnalysisResult } from '../utils/transactionAnalyzer';
import { toast } from 'sonner';

export function AnalyzerPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const parseAndAnalyze = (content: string) => {
    try {
      setError(null);
      setIsAnalyzing(true);
      
      setTimeout(() => {
        // --- Smart Unstructured Parser (for PDF text) ---
        const parseUnstructured = (text: string): Transaction[] => {
          const found: Transaction[] = [];
          const lines = text.split('\n');
          
          // Enhanced Pattern: Date [Variable Space] Description [Variable Space] Amount
          // Supports: 01/15/2024, Jan 10, 2024, 2024-05-30, etc.
          // Support amount at end: +/- 1,234.56 or ₱ 1,234.56
          const patterns = [
            // Standard format: Date ... Description ... Amount
            /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}?)\s+(.+?)\s+([+-]?\s?[₱\$P]?\s?[\d,]+\.\d{2})/g,
            // Fallback for lines that might be formatted differently
            /([+-]?\s?[₱\$P]?\s?[\d,]+\.\d{2})\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}?)\s+(.+)/g,
          ];
          
          lines.forEach(line => {
            const cleanLine = line.trim();
            // Skip headers or common noise lines
            if (!cleanLine || cleanLine.length < 10) return;
            if (cleanLine.toLowerCase().includes('running balance') || 
                cleanLine.toLowerCase().includes('total amount') ||
                cleanLine.toLowerCase().includes('date') && cleanLine.toLowerCase().includes('description')) {
              return;
            }

            patterns.forEach(pattern => {
              pattern.lastIndex = 0;
              let match;
              while ((match = pattern.exec(cleanLine)) !== null) {
                let dateStr, desc, amountStr;
                
                if (pattern.source.startsWith('(\\d')) {
                  // Forward Pattern: [Date] [Desc] [Amount]
                  [, dateStr, desc, amountStr] = match;
                } else {
                  // Replaced Pattern: [Amount] [Date] [Desc]
                  [, amountStr, dateStr, desc] = match;
                }

                // Clean amount: remove currency symbols and commas
                const cleanAmountStr = amountStr.replace(/[^\d.-]/g, '');
                // Clean description: remove reference numbers and noise
                let cleanDesc = desc.trim()
                  .replace(/\b\d{10,}\b/g, '') // Remove long numbers (10+ digits)
                  .replace(/\bRef(erence)?\s*(#|no)?\s*\d+\b/gi, '') // Remove Ref #123...
                  .replace(/Instapay/gi, '')
                  .replace(/\s+/g, ' ')
                  .trim();

                const amount = parseFloat(cleanAmountStr);
                
                if (!isNaN(amount) && amount !== 0) {
                  found.push({
                    date: dateStr.trim(),
                    description: cleanDesc.substring(0, 100),
                    amount: Math.abs(amount)
                  });
                }
              }
            });
          });
          return found;
        };

        // --- CSV Parser ---
        const detectDelimiter = (text: string): string => {
          const firstLine = text.split('\n')[0];
          const delimiters = [',', '\t', ';', '|'];
          let maxCount = 0;
          let detectedDelimiter = ',';
          
          delimiters.forEach(delimiter => {
            const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
            if (count > maxCount) {
              maxCount = count;
              detectedDelimiter = delimiter;
            }
          });
          
          return detectedDelimiter;
        };
        
        const delimiter = detectDelimiter(content);
        
        const parsed = Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          delimiter: delimiter,
          transformHeader: (header: string) => header.trim()
        });

        let transactions: Transaction[] = [];

        // Check if CSV parsing was successful and has headers
        const hasHeaders = parsed.meta.fields && parsed.meta.fields.length > 1;
        
        if (hasHeaders) {
          transactions = parsed.data.map((row: any) => {
            const date = row.Date || row.date || row.DATE || row.Timestamp || row.timestamp || row.Time || row.time || '';
            const description = row.Description || row.description || row.DESCRIPTION || 
                              row.Merchant || row.merchant || row.MERCHANT ||
                              row.Details || row.details || row.DETAILS ||
                              row.Transaction || row.transaction || row.Name || row.name || '';
            const amount = Math.abs(parseFloat(
              (row.Amount || row.amount || row.AMOUNT || 
              row.Value || row.value || row.VALUE ||
              row.Price || row.price || row.PRICE ||
              row.Cost || row.cost || row.COST || '0').toString().replace(/[^\d.-]/g, '')
            ));

            return {
              date: date ? date.toString() : '',
              description: description ? description.toString() : '',
              amount: amount
            };
          }).filter(t => t.description && t.amount !== 0);
        }

        // If CSV failed or yielded nothing, try unstructured parsing (PDF fallback)
        if (transactions.length === 0) {
          console.log('Attempting unstructured/PDF fallback parsing...');
          transactions = parseUnstructured(content);
        }

        if (transactions.length === 0) {
          setError('No valid transactions found. Please ensure your PDF or CSV file contains transaction details (Date, Description, Amount).');
          setIsAnalyzing(false);
          return;
        }

        const result = analyzeTransactions(transactions);
        setAnalysis(result);
        setIsAnalyzing(false);
        toast.success(`Analysis complete! Found ${transactions.length} transactions.`);
      }, 1500);
    } catch (err) {
      setError('Failed to process file. Please ensure it is a valid PDF or CSV format.');
      setIsAnalyzing(false);
      console.error(err);
    }
  };

  const handleFileLoad = (content: string, fileName: string) => {
    parseAndAnalyze(content);
  };

  const handleLoadSample = () => {
    const sampleData = generateSampleData();
    parseAndAnalyze(sampleData);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-4">
            Try It Now
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Upload your **PDF or CSV** transaction history and get <span className="text-pink-600">brutally honest</span> financial advice.
            We will tell you where your money <span className="text-purple-600">actually</span> goes 
            <span className="text-orange-600"> (spoiler: it is GrabFood) 🍔</span>
          </p>
        </motion.div>

        {/* Info Banner */}
        <AnimatePresence>
          {!analysis && (
            <motion.div 
              className="mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <strong className="text-blue-600 text-lg block mb-2">How it works:</strong>
                    <p className="text-gray-800 text-base leading-relaxed">
                      Drop your **PDF statement** or **CSV file**. Our smart analyzer extracts your transactions automatically.
                      We categorize every cent, identify leaks, and give you a digital slap in the face with your spending reality.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert className="bg-red-50 border-2 border-red-300 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>Oops!</strong> {error}
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyzing Animation */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-2xl text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="w-16 h-16 text-purple-600" />
                </motion.div>
                <h3 className="text-2xl mb-2">Analyzing Your Spending...</h3>
                <p className="text-gray-600">Preparing your financial roast 🔥</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div 
              key="upload"
              className="max-w-4xl mx-auto space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FileUploader onFileLoad={handleFileLoad} />
              <div className="text-center">
                <p className="text-gray-700 mb-4 text-lg">
                  Don&apos;t have a file? <span className="text-purple-600">Try our sample data first! ✨</span>
                </p>
                <SampleDataButton onLoadSample={handleLoadSample} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 flex justify-center">
                <motion.button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white text-purple-600 hover:text-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Upload New File
                </motion.button>
              </div>
              <AnalysisDashboard analysis={analysis} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Note */}
        {!analysis && (
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-purple-100">
              <p className="text-gray-700 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Built with React, Recharts, and a healthy dose of financial reality checks.
                <Sparkles className="w-4 h-4 text-purple-600" />
              </p>
              <p className="text-sm text-gray-600">
                🔒 Your data is processed locally in your browser. We do not store or share your financial information.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, X, Sparkles, FileSearch } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { extractTextFromPDF } from '../utils/pdfParser';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileLoad: (content: string, fileName: string) => void;
}

export function FileUploader({ onFileLoad }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const isPDF = file.name.toLowerCase().endsWith('.pdf');
    const isCSV = file.name.toLowerCase().endsWith('.csv');

    if (!isPDF && !isCSV) {
      toast.error('Only PDF and CSV files are supported.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      if (isPDF) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const text = await extractTextFromPDF(arrayBuffer);
            onFileLoad(text, file.name);
          } catch (error) {
            toast.error('Failed to parse PDF statement.');
            setFileName(null);
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileLoad(content, file.name);
          setIsProcessing(false);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      toast.error('Error loading file.');
      setIsProcessing(false);
      setFileName(null);
    }
  };

  const handleClear = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl blur-lg opacity-20" />
        <Card className="relative p-10 bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-2xl rounded-3xl overflow-hidden">
          <div
            className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
              dragActive
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 scale-105'
                : 'border-purple-300 hover:border-purple-400 hover:bg-purple-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.pdf"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            
            {!fileName ? (
              <div className="space-y-6">
                <motion.div 
                  className="flex justify-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-40"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-xl">
                      <Upload className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-3">
                  <p className="text-xl text-gray-700">
                    Drop your transaction file here or{' '}
                    <label htmlFor="file-upload" className="text-purple-600 hover:text-purple-700 cursor-pointer underline decoration-2 underline-offset-2">
                      browse
                    </label>
                  </p>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Supports PDF or CSV statements from GCash, Maya, or any bank
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </p>
                </div>
                <div className="pt-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Select File
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="space-y-6">
                <motion.div 
                  className="flex justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FileSearch className="w-16 h-16 text-purple-600" />
                </motion.div>
                <div className="space-y-2">
                  <p className="text-xl text-purple-600 font-medium">Extracting data from your statement...</p>
                  <p className="text-gray-500">This will only take a moment.</p>
                </div>
              </div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div 
                  className="flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-40"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-xl">
                      <FileText className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-3">
                  <p className="text-2xl text-green-600">File loaded successfully! 🎉</p>
                  <p className="text-gray-700 bg-white/60 px-4 py-2 rounded-lg inline-block">{fileName}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="mt-2 border-2 border-gray-300 hover:border-gray-400 px-6 py-4 rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear & Upload Different File
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-700">
              <strong className="text-purple-600">Smart Format Detection:</strong> Drag and drop your **PDF** or **CSV** bank transaction history.
              <br />
              <span className="text-gray-500 text-sm">📄 Full support for PDF statements (GCash, Maya, BDO, BPI, Unionbank, etc.)</span>
              <br />
              <span className="text-gray-500 text-sm">💡 Automatically extracts Date, Description, and Amount for analysis</span>
            </p>
          </motion.div>
        </Card>
      </div>
    </motion.div>
  );
}
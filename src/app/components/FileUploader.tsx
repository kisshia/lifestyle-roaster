import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, X, FileSearch } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileReady: (file: File) => void;
}

export function FileUploader({ onFileReady }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    const validExtensions = ['.pdf', '.csv', '.png', '.jpg', '.jpeg'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext)) || file.type.startsWith('image/');

    if (!isValid) {
      toast.error('Only PDF, CSV, and Image files are supported.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      onFileReady(file);
      setIsProcessing(false);
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
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-white/0 to-pink-500/20 blur-2xl" />
      <div className="relative rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div
          className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 bg-white/40 ${
            dragActive
              ? 'border-purple-400 bg-purple-50'
              : 'border-purple-200 hover:border-purple-400/60'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.pdf,image/png,image/jpeg,image/jpg"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />

          {!fileName ? (
            <div className="space-y-6">
              <motion.div
                className="flex justify-center"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
                  <Upload className="h-10 w-10 text-purple-600" />
                </div>
              </motion.div>
              <div className="space-y-2">
                <p className="text-xl text-gray-800 font-medium">
                  Drop your transaction file or{' '}
                  <label htmlFor="file-upload" className="text-purple-600 hover:text-purple-700 cursor-pointer underline">
                    browse
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  PDFs, Images, and CSVs will be processed dynamically.
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-md border-0"
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
            </div>
          ) : isProcessing ? (
            <div className="space-y-4">
              <motion.div
                className="flex justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <FileSearch className="w-12 h-12 text-purple-600" />
              </motion.div>
              <p className="text-purple-700 font-medium">Extracting statement data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                  <FileText className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-emerald-700 font-medium">File ready for roasting.</p>
                <p className="text-sm text-gray-500">{fileName}</p>
              </div>
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear & Upload Another
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { X, FileText, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface QuickGuideProps {
  onClose: () => void;
}

export function QuickGuide({ onClose }: QuickGuideProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-40" />
          <Card className="relative border-0 shadow-2xl rounded-3xl bg-white">
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Quick Start Guide 🚀
                </CardTitle>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                      <Download className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">1. Export Your Transactions</h3>
                    <p className="text-gray-600">
                      From your bank app or e-wallet (GCash, Maya, etc.), export your transaction history as CSV or TXT format.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">2. Make Sure It Has These Columns</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• <strong>Date</strong> - When the transaction occurred</li>
                      <li>• <strong>Description</strong> - What you bought or paid for</li>
                      <li>• <strong>Amount</strong> - How much you spent (negative for expenses)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                      <Upload className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">3. Upload & Get Insights</h3>
                    <p className="text-gray-600">
                      Drop your file in the upload area and we'll analyze your spending patterns, find leaks, and give you actionable recommendations!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                <p className="text-sm text-blue-900">
                  <strong>📝 Example Format:</strong>
                  <br />
                  <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
                    Date,Description,Amount<br />
                    2026-03-15,GRABFOOD MANILA,-350.00
                  </code>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  Got It!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}

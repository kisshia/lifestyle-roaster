import { motion } from 'motion/react';
import { useMemo } from 'react';
import { AnalysisResult } from '../utils/transactionAnalyzer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  DollarSign,
  PieChart as PieChartIcon,
  CreditCard,
  Flame,
  Target,
  Zap,
  TrendingUp,
  Search,
  ListFilter,
  History
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

export function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Generate unique chart IDs once on mount using useMemo
  const chartIds = useMemo(() => ({
    pie: `pie-chart-${Math.random().toString(36).substr(2, 9)}`,
    bar: `bar-chart-${Math.random().toString(36).substr(2, 9)}`
  }), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.03, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl blur opacity-30" />
            <Card className="relative border-0 shadow-xl rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full -mr-16 -mt-16 opacity-20" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-red-700">Total Spent</CardTitle>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <DollarSign className="w-8 h-8 text-red-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-red-600">{formatCurrency(analysis.totalSpent)}</div>
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  This month's damage
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl blur opacity-30" />
            <Card className="relative border-0 shadow-xl rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-20" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-purple-700">Categories</CardTitle>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <PieChartIcon className="w-8 h-8 text-purple-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-purple-600">{analysis.categories.length}</div>
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Spending categories
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-3xl blur opacity-30" />
            <Card className="relative border-0 shadow-xl rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-20" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-orange-700">Subscriptions</CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CreditCard className="w-8 h-8 text-orange-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-orange-600">{analysis.subscriptions.length}</div>
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Active drains
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Lifestyle Diagnosis */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-red-300 to-orange-300 rounded-3xl blur-lg opacity-30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 text-white overflow-hidden px-8 py-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 opacity-10" />
            <div className="relative space-y-4 flex flex-col min-h-[180px] justify-center">
              <motion.div
                className="flex justify-center"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-10 h-10 text-yellow-300" />
              </motion.div>
              <strong className="text-2xl text-yellow-100 block text-center">🔥 Lifestyle Diagnosis 🔥</strong>
              <div className="w-full flex-1 flex items-center justify-center px-4">
                <p className="text-xl leading-loose text-white/95 whitespace-normal break-words text-center max-w-4xl">{analysis.lifestyleDiagnosis}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Biggest Leak */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-red-300 rounded-3xl blur-lg opacity-20" />
          <Card className="relative border-0 shadow-xl rounded-3xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200 rounded-full -ml-24 -mb-24 opacity-20" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-900 text-2xl">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingDown className="w-7 h-7" />
                </motion.div>
                The Leak Identified 💸
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800 text-lg leading-relaxed">{analysis.biggestLeak}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" variants={itemVariants}>
        {/* Pie Chart */}
        <motion.div whileHover={{ scale: 1.02 }} className="w-full">
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl blur-lg opacity-20" />
            <Card className="relative border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm overflow-hidden h-full gap-0">
              <CardHeader className="px-8 pt-8 pb-0">
                <CardTitle className="text-purple-900 text-xl">Spending Breakdown</CardTitle>
                <CardDescription className="text-purple-700">Where your money actually goes 💰</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 pt-0">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart id={chartIds.pie}>
                    <Pie
                      data={analysis.categories}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.percentage.toFixed(1)}%`}
                      labelLine={false}
                      isAnimationActive={false}
                    >
                      {analysis.categories.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div whileHover={{ scale: 1.02 }} className="w-full">
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 rounded-3xl blur-lg opacity-20" />
            <Card className="relative border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm overflow-hidden h-full">
              <CardHeader className="px-8 pt-8 pb-0">
                <CardTitle className="text-blue-900 text-xl">Category Comparison</CardTitle>
                <CardDescription className="text-blue-700">Ranked by spending amount 📊</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 pt-6">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={analysis.categories} id={chartIds.bar}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      interval={0}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="amount" radius={[12, 12, 0, 0]} isAnimationActive={false}>
                      {analysis.categories.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Category Details */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-3xl blur-lg opacity-20" />
          <Card className="relative border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-indigo-900 text-2xl">Category Details</CardTitle>
              <CardDescription className="text-indigo-700">Transaction count and amounts per category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.categories.map((category, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-purple-200 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="w-5 h-5 rounded-full shadow-lg" 
                            style={{ backgroundColor: category.color }}
                            whileHover={{ scale: 1.3, rotate: 180 }}
                          />
                          <span className="text-lg">{category.name}</span>
                          <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                            {category.count} transactions
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg">{formatCurrency(category.amount)}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {category.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute h-full rounded-full"
                          style={{ backgroundColor: category.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    {index < analysis.categories.length - 1 && <Separator className="my-2" />}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Subscription Drains */}
      {analysis.subscriptions.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="relative">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Card className="relative border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 opacity-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-700 rounded-full -ml-24 -mb-24 opacity-20" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-7 h-7 text-yellow-300" />
                  </motion.div>
                  Subscription Drains Detected ⚠️
                </CardTitle>
                <CardDescription className="text-purple-100 text-base">
                  These recurring charges are silently draining your wallet 💸
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {analysis.subscriptions.map((sub, index) => (
                    <motion.div 
                      key={index} 
                      className="p-5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white text-lg">{sub.name}</p>
                          <p className="text-purple-100 text-sm mt-1">{sub.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-white text-xl">{formatCurrency(sub.monthlyAmount)}</p>
                          <p className="text-xs text-purple-100">per month</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div className="pt-4 border-t border-white/30">
                    <div className="flex justify-between items-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <span className="text-white text-lg">💰 Total Subscription Cost:</span>
                      <span className="text-2xl text-yellow-300">
                        {formatCurrency(
                          analysis.subscriptions.reduce((sum, s) => sum + s.monthlyAmount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Transaction Details */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-slate-400 rounded-3xl blur-lg opacity-10" />
          <Card className="relative border-0 shadow-xl rounded-3xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 text-2xl flex items-center gap-2">
                  <History className="w-6 h-6 text-slate-600" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-slate-600">Full breakdown of all detected transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                  <ListFilter className="w-3 h-3 mr-1" />
                  {analysis.categorizedTransactions.length} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 text-slate-500 font-medium">
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-4">Description</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {analysis.categorizedTransactions.map((t, i) => (
                      <motion.tr 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="py-4 px-4 text-slate-500 text-sm whitespace-nowrap">{t.date}</td>
                        <td className="py-4 px-4 text-slate-900 font-medium">{t.description}</td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant="secondary"
                            className="font-normal text-xs transition-all ring-1 ring-inset"
                            style={{ 
                              backgroundColor: `${analysis.categories.find(c => c.name === t.category)?.color}15`,
                              color: analysis.categories.find(c => c.name === t.category)?.color,
                              borderColor: `${analysis.categories.find(c => c.name === t.category)?.color}30`
                            }}
                          >
                            {t.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-slate-900">
                          {formatCurrency(t.amount)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl blur-xl opacity-30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Card className="relative border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -mr-36 -mt-36 opacity-10" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lightbulb className="w-8 h-8 text-yellow-300" />
                </motion.div>
                Actionable Recommendations 💡
              </CardTitle>
              <CardDescription className="text-green-100 text-base">
                Time to fix your budget (the roasting edition) 🔥
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4 p-5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-400 text-green-900 flex items-center justify-center text-lg shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {index + 1}
                    </motion.div>
                    <p className="text-white text-base leading-relaxed flex-1">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
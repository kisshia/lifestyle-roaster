import { motion } from 'motion/react';
import { useMemo } from 'react';
import { AnalysisResult } from '../utils/analysisApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Flame, Repeat, Radar, AlertOctagon, Lightbulb } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

export function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const currencySymbol = analysis.currency === 'USD' ? '$' : '\u20B1';

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartId = useMemo(() => `roast-chart-${Math.random().toString(36).slice(2, 8)}`, []);

  const totalTransactions = analysis.transactions.length;
  const recurringCount = analysis.recurring_items.length;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Spend',
            value: formatCurrency(analysis.total_spent),
            icon: <Flame className="w-5 h-5 text-fuchsia-600" />,
            accent: 'from-fuchsia-100 to-transparent'
          },
          {
            label: 'Transactions',
            value: totalTransactions.toLocaleString(),
            icon: <Activity className="w-5 h-5 text-blue-600" />,
            accent: 'from-blue-100 to-transparent'
          },
          {
            label: 'Recurring Items',
            value: recurringCount.toLocaleString(),
            icon: <Repeat className="w-5 h-5 text-emerald-600" />,
            accent: 'from-emerald-100 to-transparent'
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-purple-200 bg-white/80 p-5 relative overflow-hidden shadow-sm backdrop-blur-sm"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-40`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-[0.2em] font-medium">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6">
        <div className="rounded-3xl border border-purple-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Lifestyle Breakdown</h3>
              <p className="text-sm text-gray-500">Impulse vs Survival vs Subscription</p>
            </div>
            <Radar className="w-6 h-6 text-purple-600" />
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart id={chartId}>
                <Pie
                  data={analysis.breakdown}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  label={(entry) => `${entry.name.replace('-', ' ')} ${entry.percentage.toFixed(1)}%`}
                  labelLine={false}
                  isAnimationActive={false}
                >
                  {analysis.breakdown.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(233,213,255,1)',
                    borderRadius: '12px',
                    color: '#1f2937',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.breakdown.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                </div>
                <p className="text-lg font-semibold mt-2 text-gray-900">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}% • {item.count} tx</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-pink-200 bg-gradient-to-b from-pink-50 via-white to-white p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center">
              <AlertOctagon className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Roast Lab</h3>
              <p className="text-sm text-pink-600">Step 6 & 7: Diagnosis, Leak, Recommendation</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-600 font-semibold">Diagnosis</p>
              <p className="mt-2 text-gray-800 leading-relaxed">{analysis.roast.diagnosis}</p>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-semibold">Leak Detection</p>
              <p className="mt-2 text-gray-800 leading-relaxed">{analysis.roast.leak}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Lightbulb className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.3em]">Recommendations</p>
              </div>
              <div className="mt-3 space-y-3">
                {analysis.roast.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-gray-800"
                  >
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {analysis.recurring_items.length > 0 && (
        <div className="rounded-3xl border border-purple-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recurring Item Detector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recurring_items.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <p className="text-sm text-gray-600 font-medium">{item.name}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.count} hits</span>
                  <span className="text-purple-600 font-medium">Avg {formatCurrency(item.average_amount)}</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(item.total_amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-purple-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Processed Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-[0.2em] text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 font-semibold pb-4">Date</th>
                <th className="py-3 font-semibold pb-4">Description</th>
                <th className="py-3 font-semibold pb-4">Category</th>
                <th className="py-3 text-right font-semibold pb-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analysis.transactions.map((tx, index) => {
                const categoryColor =
                  analysis.breakdown.find((item) => item.name === tx.category)?.color ??
                  '#94a3b8';

                return (
                  <tr key={`${tx.description}-${index}`} className="text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pr-4 whitespace-nowrap text-gray-500">{tx.date}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {tx.is_recurring && (
                          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
                            recurring
                          </span>
                        )}
                        <span className="text-gray-900 font-medium">{tx.description}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full border bg-white shadow-sm"
                        style={{
                          borderColor: `${categoryColor}80`,
                          color: categoryColor,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-900 font-semibold">
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { useMemo } from 'react';
import { AnalysisResult } from '../utils/analysisApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Flame, Repeat, Radar, AlertOctagon, Lightbulb } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

export function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const formatCurrency = (amount: number) => {
    return `\u20B1${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
            icon: <Flame className="w-5 h-5 text-fuchsia-300" />,
            accent: 'from-fuchsia-500/30 to-transparent'
          },
          {
            label: 'Transactions',
            value: totalTransactions.toLocaleString(),
            icon: <Activity className="w-5 h-5 text-cyan-300" />,
            accent: 'from-cyan-500/30 to-transparent'
          },
          {
            label: 'Recurring Items',
            value: recurringCount.toLocaleString(),
            icon: <Repeat className="w-5 h-5 text-emerald-300" />,
            accent: 'from-emerald-500/30 to-transparent'
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-700/60 bg-[#0b1220] p-5 relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-70`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-2xl font-semibold text-white mt-2">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6">
        <div className="rounded-3xl border border-slate-700/60 bg-[#0b1220] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Lifestyle Breakdown</h3>
              <p className="text-sm text-slate-400">Impulse vs Survival vs Subscription</p>
            </div>
            <Radar className="w-6 h-6 text-cyan-300" />
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
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(148,163,184,0.4)',
                    borderRadius: '12px',
                    color: '#e2e8f0'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.breakdown.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <p className="text-lg font-semibold mt-2">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-slate-500">{item.percentage.toFixed(1)}% • {item.count} tx</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-fuchsia-500/40 bg-gradient-to-b from-[#1a0822] via-[#0b1220] to-[#0b1220] p-6 shadow-[0_0_40px_rgba(236,72,153,0.2)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
              <AlertOctagon className="h-5 w-5 text-fuchsia-300" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Roast Lab</h3>
              <p className="text-sm text-fuchsia-200/80">Step 6 & 7: Diagnosis, Leak, Recommendation</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-fuchsia-500/20 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">Diagnosis</p>
              <p className="mt-2 text-slate-100 leading-relaxed">{analysis.roast.diagnosis}</p>
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Leak Detection</p>
              <p className="mt-2 text-slate-100 leading-relaxed">{analysis.roast.leak}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <Lightbulb className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.3em]">Recommendations</p>
              </div>
              <div className="mt-3 space-y-3">
                {analysis.roast.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-slate-100"
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
        <div className="rounded-3xl border border-slate-700/60 bg-[#0b1220] p-6">
          <h3 className="text-xl font-semibold mb-4">Recurring Item Detector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recurring_items.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4"
              >
                <p className="text-sm text-slate-400">{item.name}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.count} hits</span>
                  <span className="text-cyan-200">Avg {formatCurrency(item.average_amount)}</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(item.total_amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-700/60 bg-[#0b1220] p-6">
        <h3 className="text-xl font-semibold mb-4">Processed Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="py-3">Date</th>
                <th className="py-3">Description</th>
                <th className="py-3">Category</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {analysis.transactions.map((tx, index) => {
                const categoryColor =
                  analysis.breakdown.find((item) => item.name === tx.category)?.color ??
                  '#94a3b8';

                return (
                  <tr key={`${tx.description}-${index}`} className="text-sm text-slate-300">
                    <td className="py-3 pr-4 whitespace-nowrap text-slate-400">{tx.date}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {tx.is_recurring && (
                          <span className="text-xs text-amber-300 border border-amber-400/40 rounded-full px-2 py-0.5">
                            recurring
                          </span>
                        )}
                        <span className="text-slate-100">{tx.description}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full border"
                        style={{
                          borderColor: `${categoryColor}80`,
                          color: categoryColor,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-100 font-semibold">
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

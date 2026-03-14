import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900/95 border border-white/10 rounded-xl p-3 shadow-2xl text-sm">
      <p className="text-white font-semibold mb-1">Test #{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{p.name === 'accuracy' ? '%' : ''}
        </p>
      ))}
      {d.level && <p className="text-gray-500 text-xs mt-1">{d.level} · {d.timeMode}</p>}
    </div>
  );
};

const Analytics = () => {
  const [history, setHistory] = useState([]);
  const [stats,   setStats]   = useState({ total: 0, avgWpm: 0, bestWpm: 0, avgAcc: 0, improvement: 0 });

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('typingTestHistory') || '[]');
    setHistory(h);
    if (h.length > 0) {
      const total   = h.length;
      const avgWpm  = Math.round(h.reduce((s, t) => s + t.wpm, 0) / total);
      const bestWpm = Math.max(...h.map((t) => t.wpm));
      const avgAcc  = Math.round(h.reduce((s, t) => s + t.accuracy, 0) / total);
      const improvement = h[h.length - 1].wpm - h[0].wpm;
      setStats({ total, avgWpm, bestWpm, avgAcc, improvement });
    }
  }, []);

  const chartData = history.map((t, i) => ({
    test: i + 1,
    wpm: t.wpm,
    accuracy: t.accuracy,
    level: t.level,
    timeMode: t.timeMode,
  }));

  const STAT_CARDS = [
    { label: 'Total Tests',   value: stats.total,   color: 'text-violet-400', icon: '📝', bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/20' },
    { label: 'Avg WPM',       value: stats.avgWpm,  color: 'text-blue-400',   icon: '⚡', bg: 'from-blue-500/10 to-cyan-500/10',     border: 'border-blue-500/20'   },
    { label: 'Best WPM',      value: stats.bestWpm, color: 'text-amber-400',  icon: '🏆', bg: 'from-amber-500/10 to-orange-500/10',  border: 'border-amber-500/20'  },
    { label: 'Avg Accuracy',  value: `${stats.avgAcc}%`, color: 'text-emerald-400', icon: '🎯', bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20' },
    {
      label: 'Improvement',
      value: `${stats.improvement >= 0 ? '+' : ''}${stats.improvement}`,
      color: stats.improvement >= 0 ? 'text-emerald-400' : 'text-red-400',
      icon: stats.improvement >= 0 ? '📈' : '📉',
      bg: stats.improvement >= 0 ? 'from-emerald-500/10 to-teal-500/10' : 'from-red-500/10 to-pink-500/10',
      border: stats.improvement >= 0 ? 'border-emerald-500/20' : 'border-red-500/20',
    },
  ];

  const gridStyle = { stroke: 'rgba(255,255,255,0.05)' };
  const axisStyle = { fill: '#6b7280', fontSize: 11 };

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="text-5xl mb-2 animate-float">📊</div>
            <h1 className="text-3xl font-black text-white">Analytics Dashboard</h1>
            <p className="text-emerald-100 mt-1">Track your typing journey over time</p>
          </div>
        </div>

        <div className="p-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {STAT_CARDS.map((s, i) => (
              <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.bg} border ${s.border} text-center card-lift animate-fade-up delay-${(i+1)*100}`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</div>
                <div className="text-gray-400 text-xs mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {chartData.length > 0 ? (
            <div className="space-y-6">
              {/* WPM Area Chart */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-white font-bold text-lg mb-4">⚡ WPM Progress</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis dataKey="test" tick={axisStyle} />
                    <YAxis tick={axisStyle} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="wpm" name="wpm" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#wpmGrad)" dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Accuracy Bar Chart */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-white font-bold text-lg mb-4">🎯 Accuracy Progress</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis dataKey="test" tick={axisStyle} />
                    <YAxis domain={[0, 100]} tick={axisStyle} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="accuracy" name="accuracy" fill="url(#accGrad)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 animate-float">📈</div>
              <p className="text-gray-300 text-xl font-bold">No data yet</p>
              <p className="text-gray-500 mt-2">Complete some tests to see your analytics here!</p>
            </div>
          )}

          {/* Recent tests table */}
          {history.length > 0 && (
            <div className="mt-6">
              <h2 className="text-white font-bold text-lg mb-3">Recent Tests</h2>
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-left">
                      {['Date', 'WPM', 'Accuracy', 'Level', 'Time'].map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().slice(0, 10).map((t, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-violet-400 font-bold">{t.wpm}</td>
                        <td className="px-4 py-3 text-emerald-400 font-semibold">{t.accuracy}%</td>
                        <td className="px-4 py-3 text-gray-300 capitalize">{t.level}</td>
                        <td className="px-4 py-3 text-blue-400">{t.timeMode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

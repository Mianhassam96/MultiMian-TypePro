import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [testHistory, setTestHistory] = useState([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageWpm: 0,
    bestWpm: 0,
    averageAccuracy: 0,
    improvement: 0
  });

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('typingTestHistory') || '[]');
    setTestHistory(storedHistory);

    if (storedHistory.length > 0) {
      const totalTests = storedHistory.length;
      const averageWpm = Math.round(storedHistory.reduce((sum, test) => sum + test.wpm, 0) / totalTests);
      const bestWpm = Math.max(...storedHistory.map(test => test.wpm));
      const averageAccuracy = Math.round(storedHistory.reduce((sum, test) => sum + test.accuracy, 0) / totalTests);

      // Calculate improvement (difference between first and last test)
      const firstTest = storedHistory[0].wpm;
      const lastTest = storedHistory[storedHistory.length - 1].wpm;
      const improvement = lastTest - firstTest;

      setStats({
        totalTests,
        averageWpm,
        bestWpm,
        averageAccuracy,
        improvement
      });
    }
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = testHistory.map((test, index) => ({
    test: index + 1,
    wpm: test.wpm,
    accuracy: test.accuracy,
    date: formatDate(test.timestamp),
    level: test.level,
    timeMode: test.timeMode
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-semibold">{`Test #${label}`}</p>
          <p className="text-blue-600 dark:text-blue-400">{`WPM: ${data.wpm}`}</p>
          <p className="text-green-600 dark:text-green-400">{`Accuracy: ${data.accuracy}%`}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{`Level: ${data.level}`}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{`Time: ${data.timeMode}`}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">{data.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-purple-500/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
          📊 Analytics Dashboard 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Track Your Typing Progress Over Time
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTests}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Tests</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.averageWpm}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg WPM</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.bestWpm}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Best WPM</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.averageAccuracy}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Accuracy</div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${stats.improvement >= 0 ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 to-green-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 to-pink-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.improvement >= 0 ? '+' : ''}{stats.improvement}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Improvement</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="space-y-8">
          {/* WPM Progress Chart */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">WPM Progress Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="test"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy Chart */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Accuracy Progress Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="test"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="accuracy"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Data Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete some typing tests to see your progress analytics here!
          </p>
        </div>
      )}

      {/* Recent Tests Table */}
      {testHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Recent Tests</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">WPM</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Accuracy</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Level</th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.slice(-10).reverse().map((test, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-sm">{formatDate(test.timestamp)}</td>
                    <td className="px-4 py-2 font-semibold text-blue-600 dark:text-blue-400">{test.wpm}</td>
                    <td className="px-4 py-2 text-green-600 dark:text-green-400">{test.accuracy}%</td>
                    <td className="px-4 py-2 capitalize">{test.level}</td>
                    <td className="px-4 py-2">{test.timeMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

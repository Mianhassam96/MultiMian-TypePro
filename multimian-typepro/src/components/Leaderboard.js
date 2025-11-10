import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterTimeMode, setFilterTimeMode] = useState('all');

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('typingTestScores') || '[]');
    setScores(storedScores.sort((a, b) => b.wpm - a.wpm));
  }, []);

  const filteredScores = scores.filter(score => {
    return (filterLevel === 'all' || score.level === filterLevel) &&
           (filterTimeMode === 'all' || score.timeMode === filterTimeMode);
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-purple-500/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          🏆 Leaderboard 🏆
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Top Typing Scores
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        <select
          value={filterTimeMode}
          onChange={(e) => setFilterTimeMode(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Times</option>
          <option value="15s">15s</option>
          <option value="30s">30s</option>
          <option value="60s">60s</option>
          <option value="120s">120s</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Rank</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Username</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">WPM</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Accuracy</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Level</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Time</th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.slice(0, 50).map((score, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                <td className="px-4 py-2 font-bold text-blue-600 dark:text-blue-400">#{index + 1}</td>
                <td className="px-4 py-2">{score.username}</td>
                <td className="px-4 py-2 font-semibold">{score.wpm}</td>
                <td className="px-4 py-2">{score.accuracy}%</td>
                <td className="px-4 py-2 capitalize">{score.level}</td>
                <td className="px-4 py-2">{score.timeMode}</td>
                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{formatDate(score.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredScores.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No scores yet. Complete a test to see your score here!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

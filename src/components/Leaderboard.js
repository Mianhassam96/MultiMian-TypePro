import React, { useState, useEffect } from 'react';

const MEDALS = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const [scores,         setScores]         = useState([]);
  const [filterLevel,    setFilterLevel]    = useState('all');
  const [filterTimeMode, setFilterTimeMode] = useState('all');

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('typingTestScores') || '[]');
    setScores(s.sort((a, b) => b.wpm - a.wpm));
  }, []);

  const filtered = scores.filter(
    (s) =>
      (filterLevel    === 'all' || s.level    === filterLevel) &&
      (filterTimeMode === 'all' || s.timeMode === filterTimeMode)
  );

  const fmt = (ts) =>
    new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

  const levelColor = (l) => ({
    easy:   'text-emerald-400 bg-emerald-500/10',
    medium: 'text-amber-400 bg-amber-500/10',
    hard:   'text-orange-400 bg-orange-500/10',
    expert: 'text-violet-400 bg-violet-500/10',
  }[l] || 'text-gray-400 bg-gray-500/10');

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="text-5xl mb-2 animate-float">🏆</div>
            <h1 className="text-3xl font-black text-white">Leaderboard</h1>
            <p className="text-orange-100 mt-1">Top typing scores of all time</p>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="easy">🐣 Easy</option>
              <option value="medium">⚡ Medium</option>
              <option value="hard">🏆 Hard</option>
              <option value="expert">👑 Expert</option>
            </select>
            <select
              value={filterTimeMode}
              onChange={(e) => setFilterTimeMode(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
            >
              <option value="all">All Times</option>
              <option value="15s">15s</option>
              <option value="30s">30s</option>
              <option value="60s">60s</option>
              <option value="120s">120s</option>
            </select>
            <span className="ml-auto text-gray-400 text-sm self-center">{filtered.length} entries</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 animate-float">🏅</div>
              <p className="text-gray-400 text-lg font-medium">No scores yet</p>
              <p className="text-gray-600 text-sm mt-1">Complete a test and save your score to appear here!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.slice(0, 50).map((score, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 card-lift ${
                    i === 0 ? 'bg-amber-500/10 border-amber-500/30' :
                    i === 1 ? 'bg-gray-400/10 border-gray-400/20' :
                    i === 2 ? 'bg-orange-500/10 border-orange-500/20' :
                    'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center">
                    {i < 3 ? (
                      <span className="text-2xl">{MEDALS[i]}</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-sm">#{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(score.username || 'A')[0].toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{score.username || 'Anonymous'}</p>
                    <p className="text-gray-500 text-xs">{fmt(score.timestamp)}</p>
                  </div>

                  {/* WPM */}
                  <div className="text-center">
                    <div className="text-violet-400 font-black text-xl tabular-nums">{score.wpm}</div>
                    <div className="text-gray-500 text-xs">WPM</div>
                  </div>

                  {/* Accuracy */}
                  <div className="text-center hidden sm:block">
                    <div className="text-emerald-400 font-bold text-lg tabular-nums">{score.accuracy}%</div>
                    <div className="text-gray-500 text-xs">Acc</div>
                  </div>

                  {/* Level badge */}
                  <span className={`hidden md:inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${levelColor(score.level)}`}>
                    {score.level}
                  </span>

                  {/* Time badge */}
                  <span className="hidden md:inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10">
                    {score.timeMode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

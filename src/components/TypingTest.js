import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';

const TEXTS = {
  easy:   ["The cat sat on the mat. It was a sunny day. The cat was happy. I like to eat apples. Apples are red and green. They taste good. My dog is brown. He likes to run. We play in the park."],
  medium: ["The quick brown fox jumps over the lazy dog. This is a classic typing test sentence. Programming is the process of creating instructions for computers to follow. It requires logical thinking. Technology has changed the way we live, work, and communicate with each other."],
  hard:   ["In the realm of quantum computing, superposition and entanglement represent fundamental principles that challenge classical notions of information processing and computation. The juxtaposition of artificial intelligence with human creativity engenders profound philosophical inquiries regarding consciousness, ethics, and the future of innovation."],
  expert: ["Epistemological paradigms shift dramatically when contemplating Gödel's incompleteness theorems, revealing inherent limitations in formal systems and mathematical consistency. Neuroplasticity facilitates synaptic pruning and dendritic arborization, enabling adaptive cognitive restructuring through experiential learning and environmental stimuli."],
};

const PRESETS = [
  { label: '15s',  value: 15  },
  { label: '30s',  value: 30  },
  { label: '60s',  value: 60  },
  { label: '120s', value: 120 },
];

const LEVELS = [
  { key: 'easy',   label: 'Easy',   emoji: '🐣', color: 'from-emerald-500 to-green-500'  },
  { key: 'medium', label: 'Medium', emoji: '⚡', color: 'from-amber-500 to-yellow-500'   },
  { key: 'hard',   label: 'Hard',   emoji: '🏆', color: 'from-orange-500 to-red-500'     },
  { key: 'expert', label: 'Expert', emoji: '👑', color: 'from-violet-500 to-purple-600'  },
];

// SVG circular timer ring
const TimerRing = ({ timeLeft, totalTime }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 1;
  const offset = circumference * (1 - progress);
  const isWarning = timeLeft <= 10 && timeLeft > 0;
  const isDanger  = timeLeft <= 5  && timeLeft > 0;

  const strokeColor = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#8b5cf6';

  return (
    <div className={`relative flex items-center justify-center ${isWarning ? 'animate-pulse-ring' : ''}`}>
      <svg width="100" height="100" className="transform -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black tabular-nums ${isDanger ? 'animate-timer-warn' : isWarning ? 'text-amber-400' : 'text-white'}`}>
          {timeLeft}
        </span>
        <span className="text-gray-400 text-xs font-medium">sec</span>
      </div>
    </div>
  );
};

const TypingTest = ({ onTestComplete }) => {
  const [currentLevel,    setCurrentLevel]    = useState('hard');
  const [currentTimeMode, setCurrentTimeMode] = useState('60s');
  const [totalTime,       setTotalTime]       = useState(60);
  const [text,            setText]            = useState(TEXTS['hard'][0]);
  const [userInput,       setUserInput]       = useState('');
  const [startTime,       setStartTime]       = useState(null);
  const [wpm,             setWpm]             = useState(0);
  const [cpm,             setCpm]             = useState(0);
  const [accuracy,        setAccuracy]        = useState(100);
  const [errorCount,      setErrorCount]      = useState(0);
  const [timeLeft,        setTimeLeft]        = useState(60);
  const [isFinished,      setIsFinished]      = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [customTime,      setCustomTime]      = useState('');
  const [showCustom,      setShowCustom]      = useState(false);
  const [username,        setUsername]        = useState('');
  const [saved,           setSaved]           = useState(false);

  const inputRef = useRef(null);

  const resetState = (time) => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setErrorCount(0);
    setTimeLeft(time);
    setIsFinished(false);
    setSaved(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const changeTimeMode = (label, value) => {
    setCurrentTimeMode(label);
    setTotalTime(value);
    setShowCustom(false);
    resetState(value);
  };

  const applyCustomTimer = () => {
    const t = parseInt(customTime);
    if (!t || t < 1 || t > 600) return alert('Enter a time between 1 and 600 seconds.');
    setCurrentTimeMode(`${t}s`);
    setTotalTime(t);
    setShowCustom(false);
    setCustomTime('');
    resetState(t);
  };

  const changeLevel = async (level) => {
    setCurrentLevel(level);
    setIsLoading(true);
    try {
      const t = await apiService.getQuoteByDifficulty(level);
      setText(t || TEXTS[level][0]);
    } catch {
      setText(TEXTS[level][0]);
    } finally {
      setIsLoading(false);
    }
    resetState(totalTime);
  };

  const restartTest = async () => {
    setIsLoading(true);
    try {
      const t = await apiService.getQuoteByDifficulty(currentLevel);
      setText(t || TEXTS[currentLevel][0]);
    } catch {
      setText(TEXTS[currentLevel][0]);
    } finally {
      setIsLoading(false);
    }
    resetState(totalTime);
  };

  // Start timer on first keystroke
  useEffect(() => {
    if (userInput.length === 1 && !startTime) setStartTime(Date.now());
    if (userInput.length === text.length)      setIsFinished(true);
  }, [userInput, text.length, startTime]);

  // Countdown
  useEffect(() => {
    if (!startTime || isFinished || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) { setIsFinished(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, isFinished, timeLeft]);

  // Live WPM / CPM
  useEffect(() => {
    if (!startTime || isFinished) return;
    const id = setInterval(() => {
      const mins = (Date.now() - startTime) / 60000;
      setWpm(Math.round(userInput.length / 5 / mins));
      setCpm(Math.round(userInput.length / mins));
    }, 200);
    return () => clearInterval(id);
  }, [startTime, userInput, isFinished]);

  // Accuracy
  useEffect(() => {
    if (!userInput) { setErrorCount(0); return; }
    let errs = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== text[i]) errs++;
    }
    setErrorCount(errs);
    setAccuracy(Math.round(((userInput.length - errs) / userInput.length) * 100));
  }, [userInput, text]);

  // Save on finish — use ref to avoid stale closure without exhaustive-deps warning
  const finishDataRef = useRef({});
  finishDataRef.current = { wpm, accuracy, currentLevel, currentTimeMode, onTestComplete };

  useEffect(() => {
    if (!isFinished) return;
    const { wpm: w, accuracy: a, currentLevel: lvl, currentTimeMode: tm, onTestComplete: cb } = finishDataRef.current;
    if (cb) cb(w, a);
    const entry = { wpm: w, accuracy: a, level: lvl, timeMode: tm, timestamp: Date.now() };
    const hist = JSON.parse(localStorage.getItem('typingTestHistory') || '[]');
    hist.push(entry);
    localStorage.setItem('typingTestHistory', JSON.stringify(hist));
  }, [isFinished]);

  const saveScore = () => {
    const score = { username: username.trim() || 'Anonymous', wpm, accuracy, level: currentLevel, timeMode: currentTimeMode, timestamp: Date.now() };
    const scores = JSON.parse(localStorage.getItem('typingTestScores') || '[]');
    scores.push(score);
    localStorage.setItem('typingTestScores', JSON.stringify(scores));
    setSaved(true);
  };

  const shareResult = () => {
    const txt = `⚡ MultiMian TypePro\n\n${wpm} WPM · ${accuracy}% Accuracy\nLevel: ${currentLevel} · Time: ${currentTimeMode}\n\nhttps://mianhassam96.github.io/MultiMian-TypePro/`;
    if (navigator.share) {
      navigator.share({ title: 'My Typing Result', text: txt });
    } else {
      navigator.clipboard.writeText(txt).then(() => alert('Copied to clipboard! 📋'));
    }
  };

  const renderText = () =>
    text.split('').map((char, i) => {
      let cls = 'text-gray-500 dark:text-gray-500';
      if (i < userInput.length) {
        cls = userInput[i] === char
          ? 'text-emerald-400 dark:text-emerald-400'
          : 'text-red-400 dark:text-red-400 bg-red-500/20 rounded';
      }
      if (i === userInput.length) cls += ' border-l-2 border-violet-400 animate-[blink_1s_step-end_infinite]';
      return <span key={i} className={cls}>{char}</span>;
    });

  const levelInfo = LEVELS.find((l) => l.key === currentLevel);
  const progress  = text.length > 0 ? (userInput.length / text.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header card */}
      <div className="rounded-3xl p-6 mb-5 bg-white/5 border border-white/10 backdrop-blur animate-fade-up">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-white mb-1 tracking-tight">
            ⚡ <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">MultiMian TypePro</span> ⚡
          </h1>
          <p className="text-gray-400">Type Smart. Type Fast. Be a TypePro.</p>
        </div>

        {/* Level selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {LEVELS.map((l) => (
            <button
              key={l.key}
              onClick={() => changeLevel(l.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                currentLevel === l.key
                  ? `bg-gradient-to-r ${l.color} text-white shadow-lg scale-105`
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{l.emoji}</span> {l.label}
            </button>
          ))}
        </div>

        {/* Time selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => changeTimeMode(p.label, p.value)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                currentTimeMode === p.label && !showCustom
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              showCustom
                ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-lg scale-105'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            ⏱️ Custom
          </button>
        </div>

        {/* Custom timer input */}
        {showCustom && (
          <div className="mt-3 flex justify-center items-center gap-2 animate-slide-down">
            <input
              type="number" min="1" max="600"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyCustomTimer()}
              placeholder="Seconds (1–600)"
              className="w-40 px-4 py-2 rounded-xl bg-white/10 border border-violet-500/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
            <button
              onClick={applyCustomTimer}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:scale-105"
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 animate-fade-up delay-100">
        {/* Timer ring */}
        <div className="md:col-span-1 flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
          <TimerRing timeLeft={timeLeft} totalTime={totalTime} />
        </div>

        {[
          { label: 'WPM',      value: wpm,          icon: '⚡', color: 'text-violet-400' },
          { label: 'CPM',      value: cpm,          icon: '⌨️', color: 'text-blue-400'   },
          { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: 'text-emerald-400' },
          { label: 'Errors',   value: errorCount,   icon: '❌', color: 'text-red-400'    },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur card-lift">
            <span className="text-xl mb-1">{s.icon}</span>
            <span className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</span>
            <span className="text-gray-500 text-xs font-medium mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-4 animate-fade-up delay-200">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Progress</span>
          <span>{userInput.length} / {text.length} chars</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shimmer-bar">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Text display */}
      <div className="mb-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur animate-fade-up delay-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 gap-3">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Loading text…</span>
          </div>
        ) : (
          <p className="font-mono-typing text-lg leading-relaxed tracking-wide select-none">
            {renderText()}
          </p>
        )}
      </div>

      {/* Input */}
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={isFinished || isLoading}
        rows={4}
        placeholder={isFinished ? 'Test complete!' : 'Start typing here…'}
        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-gray-600 font-mono-typing text-base resize-none outline-none transition-all duration-200 backdrop-blur animate-fade-up delay-300 disabled:opacity-50"
      />

      {/* Restart */}
      <div className="mt-4 flex justify-center animate-fade-up delay-300">
        <button
          onClick={restartTest}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transform hover:scale-105 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart Test
        </button>
      </div>

      {/* Results panel */}
      {isFinished && (
        <div className="mt-6 rounded-3xl overflow-hidden border border-white/10 animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
            <div className="relative z-10">
              <div className="text-4xl mb-2 animate-float">🎉</div>
              <h2 className="text-2xl font-black text-white">Test Complete!</h2>
              <p className="text-violet-200 text-sm mt-1">Here's how you did</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur">
            {/* Result stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'WPM',      value: wpm,            color: 'text-violet-400', sub: 'Words/min'  },
                { label: 'CPM',      value: cpm,            color: 'text-blue-400',   sub: 'Chars/min'  },
                { label: 'Accuracy', value: `${accuracy}%`, color: 'text-emerald-400',sub: 'Precision'  },
                { label: 'Errors',   value: errorCount,     color: 'text-red-400',    sub: 'Mistakes'   },
              ].map((s, i) => (
                <div key={i} className={`text-center p-4 rounded-2xl bg-white/5 border border-white/10 animate-fade-up delay-${(i+1)*100}`}>
                  <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-white text-sm font-semibold mt-0.5">{s.label}</div>
                  <div className="text-gray-500 text-xs">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Level + time badge */}
            <div className="flex justify-center gap-3 mb-5">
              <span className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-sm font-medium border border-white/10">
                {levelInfo?.emoji} {currentLevel}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-sm font-medium border border-white/10">
                ⏱️ {currentTimeMode}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                onClick={restartTest}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <button
                onClick={shareResult}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Result
              </button>
            </div>

            {/* Save to leaderboard */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-center text-gray-400 text-sm mb-3 font-medium">Save to Leaderboard</p>
              {saved ? (
                <div className="text-center text-emerald-400 font-semibold animate-scale-in">✅ Score saved!</div>
              ) : (
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveScore()}
                    placeholder="Your name (optional)"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-gray-600 text-sm outline-none transition-all"
                  />
                  <button
                    onClick={saveScore}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:scale-105"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingTest;

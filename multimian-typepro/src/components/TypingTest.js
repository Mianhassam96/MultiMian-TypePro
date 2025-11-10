import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';

const TypingTest = ({ onTestComplete }) => {
  const texts = {
    'easy': ["The cat sat on the mat. It was a sunny day. The cat was happy. I like to eat apples. Apples are red and green. They taste good. My dog is brown. He likes to run. We play in the park."],
    'medium': ["The quick brown fox jumps over the lazy dog. This is a classic typing test sentence. Programming is the process of creating instructions for computers to follow. It requires logical thinking. Technology has changed the way we live, work, and communicate with each other."],
    'hard': ["In the realm of quantum computing, superposition and entanglement represent fundamental principles that challenge classical notions of information processing and computation. The juxtaposition of artificial intelligence with human creativity engenders profound philosophical inquiries regarding consciousness, ethics, and the future of innovation. Cryptocurrency blockchain technology utilizes decentralized consensus mechanisms to ensure transparency, immutability, and security in digital financial transactions."],
    'expert': ["Epistemological paradigms shift dramatically when contemplating Gödel's incompleteness theorems, revealing inherent limitations in formal systems and mathematical consistency. Neuroplasticity facilitates synaptic pruning and dendritic arborization, enabling adaptive cognitive restructuring through experiential learning and environmental stimuli. Cryptographic protocols employing elliptic curve cryptography provide robust security against quantum attacks via Shor's algorithm, ensuring post-quantum computational integrity."]
  };

  const timeLimits = {
    '15s': 15,
    '30s': 30,
    '60s': 60,
    '120s': 120
  };

  const [currentLevel, setCurrentLevel] = useState('hard'); // default to hard
  const [currentTimeMode, setCurrentTimeMode] = useState('60s'); // default to 60s
  const [text, setText] = useState(texts['hard'][0]); // default text
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimits['60s']);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const inputRef = useRef(null);

  const changeTimeMode = (mode) => {
    setCurrentTimeMode(mode);
    setTimeLeft(timeLimits[mode]);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    inputRef.current.focus();
  };

  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    if (userInput.length === text.length) {
      setIsFinished(true);
    }
  }, [userInput, text.length, startTime]);

  useEffect(() => {
    if (startTime && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isFinished, timeLeft]);

  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = userInput.length / 5; // average word length
        const charsTyped = userInput.length;
        setWpm(Math.round(wordsTyped / timeElapsed));
        setCpm(Math.round(charsTyped / timeElapsed));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, userInput, isFinished]);

  useEffect(() => {
    if (userInput) {
      let errorCount = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== text[i]) {
          errorCount++;
        }
      }
      const acc = ((userInput.length - errorCount) / userInput.length) * 100;
      setAccuracy(Math.round(acc));
      setErrorCount(errorCount);
    } else {
      setErrorCount(0);
    }
  }, [userInput, text]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const changeLevel = async (level) => {
    setCurrentLevel(level);
    setIsLoadingText(true);

    try {
      // Try to get text from API first
      let newText = await apiService.getQuoteByDifficulty(level);

      // If API fails, fall back to local texts
      if (!newText) {
        console.log('API failed, using local text');
        newText = texts[level][Math.floor(Math.random() * texts[level].length)];
      }

      setText(newText);
    } catch (error) {
      console.error('Error fetching text:', error);
      // Fallback to local text
      const newText = texts[level][Math.floor(Math.random() * texts[level].length)];
      setText(newText);
    } finally {
      setIsLoadingText(false);
    }

    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    inputRef.current.focus();
  };

  const restartTest = async () => {
    setIsLoadingText(true);

    try {
      // Try to get text from API first
      let newText = await apiService.getQuoteByDifficulty(currentLevel);

      // If API fails, fall back to local texts
      if (!newText) {
        console.log('API failed, using local text');
        newText = texts[currentLevel][Math.floor(Math.random() * texts[currentLevel].length)];
      }

      setText(newText);
    } catch (error) {
      console.error('Error fetching text:', error);
      // Fallback to local text
      const newText = texts[currentLevel][Math.floor(Math.random() * texts[currentLevel].length)];
      setText(newText);
    } finally {
      setIsLoadingText(false);
    }

    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    inputRef.current.focus();
  };

  useEffect(() => {
    if (isFinished && onTestComplete) {
      onTestComplete(wpm, accuracy);

      // Save to test history for analytics
      const testData = {
        wpm,
        accuracy,
        level: currentLevel,
        timeMode: currentTimeMode,
        timestamp: Date.now()
      };

      const storedHistory = JSON.parse(localStorage.getItem('typingTestHistory') || '[]');
      storedHistory.push(testData);
      localStorage.setItem('typingTestHistory', JSON.stringify(storedHistory));
    }
  }, [isFinished, onTestComplete, wpm, accuracy, currentLevel, currentTimeMode]);

  const saveScore = (username) => {
    const score = {
      username: username || 'Anonymous',
      wpm,
      accuracy,
      level: currentLevel,
      timeMode: currentTimeMode,
      timestamp: Date.now()
    };

    const storedScores = JSON.parse(localStorage.getItem('typingTestScores') || '[]');
    storedScores.push(score);
    localStorage.setItem('typingTestScores', JSON.stringify(storedScores));
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-500';
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-green-500';
        } else {
          className = 'text-red-500 bg-red-200';
        }
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-purple-500/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          ⚡ MultiMian TypePro ⚡
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Type Smart. Type Fast. Be a TypePro.
        </p>
        <div className="mt-4 flex justify-center space-x-2 flex-wrap">
          <button
            onClick={() => changeLevel('easy')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentLevel === 'easy'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🐣 Easy
          </button>
          <button
            onClick={() => changeLevel('medium')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentLevel === 'medium'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ⚡ Medium
          </button>
          <button
            onClick={() => changeLevel('hard')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentLevel === 'hard'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🏆 Hard
          </button>
          <button
            onClick={() => changeLevel('expert')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentLevel === 'expert'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            👑 Expert
          </button>
        </div>
        <div className="mt-4 flex justify-center space-x-2 flex-wrap">
          <button
            onClick={() => changeTimeMode('15s')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentTimeMode === '15s'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            15s
          </button>
          <button
            onClick={() => changeTimeMode('30s')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentTimeMode === '30s'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            30s
          </button>
          <button
            onClick={() => changeTimeMode('60s')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentTimeMode === '60s'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            60s
          </button>
          <button
            onClick={() => changeTimeMode('120s')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentTimeMode === '120s'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            120s
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{wpm}</span>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm font-medium">WPM</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{cpm}</span>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm font-medium">CPM</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">{accuracy}%</span>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm font-medium">Accuracy</p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 to-orange-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xl font-bold text-red-600 dark:text-red-400">{errorCount}</span>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm font-medium">Errors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl border transition-all duration-300 ${
          currentLevel === 'easy' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 to-emerald-900/20 border-green-200 dark:border-green-800' :
          currentLevel === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 to-orange-900/20 border-yellow-200 dark:border-yellow-800' :
          currentLevel === 'hard' ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 to-red-900/20 border-orange-200 dark:border-orange-800' :
          'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 to-pink-900/20 border-purple-200 dark:border-purple-800'
        }`}>
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">
              {currentLevel === 'easy' ? '🐣' : currentLevel === 'medium' ? '⚡' : currentLevel === 'hard' ? '🏆' : '👑'}
            </span>
            <span className={`text-2xl font-bold capitalize ${
              currentLevel === 'easy' ? 'text-green-600 dark:text-green-400' :
              currentLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
              currentLevel === 'hard' ? 'text-orange-600 dark:text-orange-400' :
              'text-purple-600 dark:text-purple-400'
            }`}>
              {currentLevel}
            </span>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 font-medium">Current Level</p>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              wpm >= 60 ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 animate-pulse' :
              wpm >= 40 ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' :
              wpm >= 20 ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500' :
              'bg-gradient-to-r from-gray-400 via-slate-500 to-zinc-500'
            }`}
            style={{ width: `${(userInput.length / text.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>Progress</span>
          <span>{userInput.length} / {text.length} characters</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-800 mb-6 animate-fade-in shadow-lg">
        <div className="text-xl leading-relaxed font-mono text-gray-900 dark:text-gray-100">
          {isLoadingText ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-purple-400"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading text...</span>
            </div>
          ) : (
            renderText()
          )}
        </div>
      </div>

      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleInputChange}
        disabled={isFinished}
        className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
        placeholder="Start typing here..."
        rows="4"
      />

      <div className="mt-6 flex justify-center">
        <button
          onClick={restartTest}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-purple-500"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart Test
        </button>
      </div>

      {isFinished && (
        <div className="mt-8 animate-fade-in">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Animated Header */}
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-2xl font-bold">Test Completed!</h2>
                </div>
                <p className="text-green-100">Great job! Here's your performance.</p>
              </div>
            </div>

            {/* Stats Grid with Animation Delays */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{wpm}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">WPM</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Words/Min</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{cpm}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">CPM</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Chars/Min</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{accuracy}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Precision</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{errorCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Errors</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Mistakes</div>
                </div>
              </div>

              {/* Level and Time Info */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-6 text-center animate-fade-in" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <span className="mr-1">
                      {currentLevel === 'beginner' ? '🐣' : currentLevel === 'intermediate' ? '⚡' : currentLevel === 'pro' ? '🏆' : '👑'}
                    </span>
                    <span className="capitalize font-medium">{currentLevel}</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentTimeMode}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{animationDelay: '0.6s'}}>
                <button
                  onClick={restartTest}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-purple-500 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
                <button
                  onClick={() => {
                    const resultText = `🎯 MultiMian TypePro Result:\n\n⚡ ${wpm} WPM | 🎯 ${accuracy}% Accuracy\n🏆 Level: ${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} | ⏱️ ${currentTimeMode}\n\nTest your typing skills at: https://multimian-typepro.vercel.app/`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Typing Test Result',
                        text: resultText,
                      });
                    } else {
                      navigator.clipboard.writeText(resultText).then(() => {
                        alert('Result copied to clipboard! 📋');
                      });
                    }
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-teal-500 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Result
                </button>
              </div>

              {/* Leaderboard Submission */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 animate-fade-in" style={{animationDelay: '0.7s'}}>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Save to Leaderboard</h3>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        saveScore(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={() => saveScore('Anonymous')}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Save as Anonymous
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingTest;

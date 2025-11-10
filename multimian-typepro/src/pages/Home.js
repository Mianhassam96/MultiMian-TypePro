import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            ⚡ MultiMian TypePro ⚡
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Master your typing skills with our advanced typing test platform.
            Track your progress, compete on leaderboards, and become a typing pro!
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">⌨️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Typing Tests</h3>
            <p className="text-gray-600 dark:text-gray-400">Multiple difficulty levels and time modes to challenge yourself</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Track your progress with detailed statistics and improvement charts</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Leaderboards</h3>
            <p className="text-gray-600 dark:text-gray-400">Compete with others and climb the global rankings</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/test"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🚀 Start Typing Test
          </Link>
          <Link
            to="/leaderboard"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            🏆 View Leaderboard
          </Link>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              <AnimatedCounter end={1000} suffix="+" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Tests Taken</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              <AnimatedCounter end={500} suffix="+" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              <AnimatedCounter end={95} suffix="%" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              <AnimatedCounter end={60} />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg WPM</div>
          </div>
        </motion.div>

        {/* Rolling Text Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 overflow-hidden"
        >
          <div className="relative">
            <div className="animate-bounce inline-block mr-4">💻</div>
            <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Join thousands of users improving their typing skills every day!
            </span>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

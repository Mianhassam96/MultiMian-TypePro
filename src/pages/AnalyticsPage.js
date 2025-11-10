import React from 'react';
import Analytics from '../components/Analytics';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your typing progress and see your improvement over time!
          </p>
        </div>
        <Analytics />
      </div>
    </div>
  );
};

export default AnalyticsPage;

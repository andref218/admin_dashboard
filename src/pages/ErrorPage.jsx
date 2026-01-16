import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen p-6 bg-linear-to-br
      from-slate-50 via-blue-50 to-indigo-50
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500"
    >
      <div
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-10 text-center
        shadow-lg border border-slate-200/50 dark:border-slate-700/50"
      >
        <h1 className="text-6xl font-bold text-slate-800 dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          Oops! Page not found.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600
          text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

import React from 'react';
import { Rocket, Server, Database, RefreshCw, AlertCircle } from 'lucide-react';

export default function Header({ health, checking, onRefresh }) {
  const isServerOnline = health.server === 'online';
  const isDbConnected = health.database === 'connected';

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <Rocket className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TaskFlow</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Full-Stack Deployment Project • React + Express + Live MySQL Database
          </p>
        </div>
      </div>

      {/* Health Indicators */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Backend Status */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isServerOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>API: {health.server.toUpperCase()}</span>
        </div>

        {/* Database Status */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isDbConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : health.database === 'checking'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SQL DB: {health.database.toUpperCase()}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          title="Refresh server & database status"
          disabled={checking}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition duration-150 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
}

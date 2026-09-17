import React from 'react';
import { ListTodo, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-slate-850/80 bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <ListTodo className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tasks</p>
          <p className="text-xl font-bold text-white">{stats.total}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-slate-500/10 text-slate-400">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</p>
          <p className="text-xl font-bold text-slate-200">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">In Progress</p>
          <p className="text-xl font-bold text-sky-400">{stats.inProgress}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed</p>
          <p className="text-xl font-bold text-emerald-400">{stats.completed}</p>
        </div>
      </div>
    </div>
  );
}

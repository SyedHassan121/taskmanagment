import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

const priorityStyles = {
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function TaskItem({ task, onStatusChange, onDelete }) {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <div className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition duration-150 flex items-start gap-3.5">
      {/* Quick Status Icon Button */}
      <button
        onClick={() => {
          const nextStatus = isCompleted ? 'pending' : isInProgress ? 'completed' : 'in_progress';
          onStatusChange(task.id, nextStatus);
        }}
        className="mt-0.5 text-slate-400 hover:text-white transition"
        title="Toggle status"
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : isInProgress ? (
          <Clock className="w-5 h-5 text-sky-400" />
        ) : (
          <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className={`text-sm font-semibold truncate ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {task.title}
          </h3>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${priorityStyles[task.priority] || priorityStyles.medium}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-xs text-slate-400 mb-3 whitespace-pre-line leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Footer Meta */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs text-slate-500">
          <span className="text-[11px]">
            {task.created_at ? new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
          </span>

          <div className="flex items-center gap-2">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

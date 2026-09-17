import React from 'react';
import TaskItem from './TaskItem';
import { Loader2, Inbox } from 'lucide-react';

export default function TaskList({
  tasks,
  loading,
  error,
  filter,
  onFilterChange,
  onStatusChange,
  onDeleteTask,
}) {
  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Header & Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-semibold text-white">Tasks in Database</h2>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          {filterOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                filter === key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500 mb-2" />
          <p className="text-sm">Querying SQL Server...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
          <p className="font-semibold mb-1">Database Error:</p>
          <p>{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Inbox className="w-8 h-8 mb-2 stroke-[1.5]" />
          <p className="text-sm">No tasks found for this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

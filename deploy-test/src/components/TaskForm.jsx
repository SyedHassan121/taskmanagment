import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      await onAddTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'pending',
      });
      setFormData({ title: '', description: '', priority: 'medium' });
    } catch (err) {
      setFormError(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="w-5 h-5 text-indigo-400" />
        <h2 className="text-base font-semibold text-white">Create New Task</h2>
      </div>

      {formError && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="block text-xs font-medium text-slate-400 mb-1.5">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g. Configure production environment"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="task-desc" className="block text-xs font-medium text-slate-400 mb-1.5">
            Description
          </label>
          <textarea
            id="task-desc"
            rows="3"
            placeholder="Add relevant notes or deployment steps..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        <div>
          <label htmlFor="task-priority" className="block text-xs font-medium text-slate-400 mb-1.5">
            Priority
          </label>
          <select
            id="task-priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow transition disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to SQL...</span>
            </>
          ) : (
            <span>Save Task</span>
          )}
        </button>
      </form>
    </div>
  );
}

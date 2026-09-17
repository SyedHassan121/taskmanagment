const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  // Check health and DB status
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  // Get all tasks
  getTasks: async () => {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch tasks' }));
      throw new Error(err.error || 'Failed to fetch tasks');
    }
    return res.json();
  },

  // Create a new task
  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create task' }));
      throw new Error(err.error || 'Failed to create task');
    }
    return res.json();
  },

  // Update a task
  updateTask: async (id, taskData) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update task' }));
      throw new Error(err.error || 'Failed to update task');
    }
    return res.json();
  },

  // Delete a task
  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete task' }));
      throw new Error(err.error || 'Failed to delete task');
    }
    return res.json();
  },
};

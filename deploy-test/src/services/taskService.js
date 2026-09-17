import { apiClient } from './apiClient';

export const taskService = {
  // Fetch all tasks
  getTasks: async () => {
    return await apiClient('/tasks');
  },

  // Create a new task
  createTask: async (taskData) => {
    return await apiClient('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update a task
  updateTask: async (id, updateData) => {
    return await apiClient(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a task
  deleteTask: async (id) => {
    return await apiClient(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskService } from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks();
      setTasks(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const addTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      if (response?.data) {
        setTasks((prev) => [response.data, ...prev]);
      }
      return response?.data;
    } catch (err) {
      throw err;
    }
  };

  // Update Task Status / Data
  const updateTask = async (id, updateData) => {
    try {
      const response = await taskService.updateTask(id, updateData);
      if (response?.data) {
        setTasks((prev) => prev.map((t) => (t.id === id ? response.data : t)));
      }
      return response?.data;
    } catch (err) {
      throw err;
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  // Summary Metrics
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
  }), [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    filter,
    setFilter,
    stats,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}

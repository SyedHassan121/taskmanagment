import React, { useState } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DeploymentGuide from './components/DeploymentGuide';
import { useHealth } from './hooks/useHealth';
import { useTasks } from './hooks/useTasks';
import { Layers, Globe, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'guide'

  // Custom Hooks
  const { health, checking, checkHealthStatus } = useHealth();
  const {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    stats,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const handleRefreshAll = () => {
    checkHealthStatus();
    fetchTasks();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Health Status Indicators */}
        <Header
          health={health}
          checking={checking}
          onRefresh={handleRefreshAll}
        />

        {/* Database Warning Banner if not connected */}
        {health.database !== 'connected' && health.database !== 'checking' && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Database Connection Notice</p>
              <p className="mt-0.5 text-rose-300/90">
                {health.dbError ||
                  'Backend cannot reach SQL Server. Ensure SQL Server is running locally, taskflow_db exists, and backend/.env credentials match.'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Deployment Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <main className="space-y-6">
            {/* Stats Metrics */}
            <StatsBar stats={stats} />

            {/* Grid: Task Form (Left) & Task List (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <TaskForm onAddTask={addTask} />
              </div>

              <div className="lg:col-span-7">
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  error={error}
                  filter={filter}
                  onFilterChange={setFilter}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </div>
          </main>
        ) : (
          <DeploymentGuide />
        )}
      </div>
    </div>
  );
}

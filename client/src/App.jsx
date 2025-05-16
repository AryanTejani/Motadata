import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterControls from './components/FilterControls';
import { motion, AnimatePresence } from 'framer-motion';
// Import the new components
import WelcomeBanner from './components/WelcomeBanner';
import EmptyState from './components/EmptyState';

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sort: 'dueDate'
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch todos with filters
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.sort) queryParams.append('sort', filters.sort);
      
      const response = await fetch(`/api/todos?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
      
      // Calculate stats
      const completed = data.filter(todo => todo.status === 'done').length;
      const highPriority = data.filter(todo => todo.priority === 'high').length;
      
      setStats({
        total: data.length,
        completed: completed,
        pending: data.length - completed,
        highPriority: highPriority
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleAddTodo = async (todo) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      fetchTodos();
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      fetchTodos();
      setEditingTodo(null);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'done' : 'open';
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo status');
      }
      
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditForm = (todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.header 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-indigo-600">Task Master</h1>
          <p className="text-gray-600 mt-2 text-lg">Your context-aware to-do list manager</p>
        </motion.header>

        {/* Welcome Banner added here */}
        <WelcomeBanner />

        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-700 hover:text-red-900 mt-1"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Tasks</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Completed</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of total
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500 hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">High Priority</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.highPriority}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingTodo(null);
              setIsFormOpen(!isFormOpen);
              if (!isFormOpen) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md flex items-center"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {isFormOpen ? 'Cancel' : 'Add New Task'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-md flex items-center border border-gray-200"
          >
            <svg className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </motion.button>
        </div>

        {/* Task Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg border border-indigo-100">
                <TodoForm 
                  onSubmit={editingTodo ? 
                    (todo) => handleUpdateTodo(editingTodo.id, todo) : 
                    handleAddTodo
                  }
                  initialData={editingTodo}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterControls 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
            </div>
          </div>
        ) : (
          <>
            {/* Task Counter */}
            <motion.div 
              className="mb-4 text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {filters.status || filters.priority ? (
                <p>Showing {todos.length} filtered tasks</p>
              ) : (
                <p>Showing all {todos.length} tasks</p>
              )}
            </motion.div>
            
            {/* Empty State or Todo List */}
            {todos.length === 0 ? (
              <EmptyState onAddNewClick={handleAddNewClick} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TodoList 
                  todos={todos} 
                  onDelete={handleDeleteTodo} 
                  onEdit={openEditForm}
                  onStatusToggle={handleStatusToggle}
                />
              </motion.div>
            )}
          </>
        )}
        
        {/* Footer */}
        <motion.footer 
          className="mt-12 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Task Master - Your Context-Aware To-Do List © {new Date().getFullYear()}</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;

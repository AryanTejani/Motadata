import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, isToday } from 'date-fns';

function TodoList({ todos, onDelete, onEdit, onStatusToggle }) {
  if (todos.length === 0) {
    return (
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-gray-500">Get started by adding a new task!</p>
      </motion.div>
    );
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDateClass = (dateStr) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) {
      return 'text-red-600 font-medium';
    } else if (isToday(date)) {
      return 'text-orange-600 font-medium';
    }
    return 'text-gray-600';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <ul className="divide-y divide-gray-100">
        <AnimatePresence>
          {todos.map(todo => (
            <motion.li 
              key={todo.id} 
              className={`p-4 hover:bg-gray-50 transition-colors ${todo.status === 'done' ? 'bg-gray-50' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="pt-1">
                    <motion.input
                      whileTap={{ scale: 1.3 }}
                      type="checkbox"
                      checked={todo.status === 'done'}
                      onChange={() => onStatusToggle(todo.id, todo.status)}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <motion.h3 
                      className={`font-medium text-lg ${todo.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}
                      animate={{ opacity: todo.status === 'done' ? 0.6 : 1 }}
                    >
                      {todo.title}
                    </motion.h3>
                    
                    {todo.description && (
                      <motion.p 
                        className={`text-sm mt-1 ${todo.status === 'done' ? 'text-gray-400' : 'text-gray-600'}`}
                        animate={{ opacity: todo.status === 'done' ? 0.6 : 1 }}
                      >
                        {todo.description}
                      </motion.p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityClass(todo.priority)}`}>
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                      </span>
                      
                      {todo.dueDate && (
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200 ${getDateClass(todo.dueDate)}`}>
                          <svg className="inline-block h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(todo.dueDate)}
                        </span>
                      )}
                      
                      <span className={`text-xs px-2 py-1 rounded-full border ${todo.status === 'done' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'}`}>
                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(todo)}
                    className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
                    title="Edit task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(todo.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;
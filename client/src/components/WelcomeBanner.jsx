// components/WelcomeBanner.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('taskmaster_visited');
    
    if (!hasVisited) {
      setIsVisible(true);
      localStorage.setItem('taskmaster_visited', 'true');
    }
  }, []);
  
  const dismiss = () => {
    setIsVisible(false);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-xl mb-8 overflow-hidden"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl">
                Welcome to Task Master!
              </h2>
              <p className="mt-3 max-w-3xl text-indigo-100">
                Your new favorite task management tool. Organize your tasks, set priorities, and track your progress all in one place.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={dismiss}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                Got it
              </motion.button>
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomeBanner;

import './components/app-root.component.js';

// Initialize the application
console.log('Todo App initialized');

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  // Router will handle this through the app-root component
});

// Simple router for navigation
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.listeners = [];
    
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    this.currentRoute = path;
    window.history.pushState({}, '', path);
    
    const handler = this.routes[path];
    if (handler) {
      handler();
    }
    
    this.listeners.forEach((listener) => listener(path));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getCurrentRoute() {
    return this.currentRoute;
  }
}

export const router = new Router();

export const navigate = (path) => {
  router.navigate(path);
};

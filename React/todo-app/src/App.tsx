import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTodos, fetchProjects, fetchUsers } from './app/store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TodoList from './components/TodoList';
import ProjectsMaster from './components/ProjectsMaster';
import type { AppDispatch } from './app/store';

type PageType = 'dashboard' | 'kanban' | 'todos' | 'projects';

function App() {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'kanban':
        return <KanbanBoard />;
      case 'todos':
        return <TodoList />;
      case 'projects':
        return <ProjectsMaster />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout flex">
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page as PageType)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="main-content flex-grow-1 p-4 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

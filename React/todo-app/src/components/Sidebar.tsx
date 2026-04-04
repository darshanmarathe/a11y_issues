import { classNames } from 'primereact/utils';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-home' },
  { id: 'kanban', label: 'Kanban Board', icon: 'pi pi-objects-column' },
  { id: 'todos', label: 'Todo List', icon: 'pi pi-list' },
  { id: 'projects', label: 'Projects', icon: 'pi pi-folder' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <div
      className={classNames('sidebar flex-shrink-0 transition-all duration-300', {
        'sidebar-collapsed': collapsed,
        'sidebar-expanded': !collapsed,
      })}
    >
      <div className="sidebar-header flex align-items-center justify-content-between p-3">
        {!collapsed && (
          <div className="logo-section flex align-items-center gap-2">
            <div className="logo-icon w-2rem h-2rem border-circle flex align-items-center justify-content-center"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <i className="pi pi-check-square text-white text-sm" />
            </div>
            <span className="font-bold text-lg text-white">TodoApp</span>
          </div>
        )}
        <button
          className="sidebar-toggle p-button p-component p-button-text p-button-rounded"
          onClick={onToggle}
          style={{ color: 'white' }}
        >
          <i className={classNames('pi', collapsed ? 'pi-angle-double-right' : 'pi-angle-double-left')} />
        </button>
      </div>

      <nav className="sidebar-nav mt-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={classNames('nav-item flex align-items-center gap-3 p-3 w-full border-none cursor-pointer transition-all duration-200', {
              'nav-item-active': activePage === item.id,
            })}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <i className={classNames(item.icon, 'text-xl', { 'nav-icon-collapsed': collapsed })} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer absolute bottom-0 left-0 right-0 p-3">
          <div className="user-card p-3 border-round" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="flex align-items-center gap-2">
              <img
                src="https://i.pravatar.cc/150?u=1"
                alt="User"
                className="w-2rem h-2rem border-circle"
              />
              <div>
                <div className="text-white font-medium text-sm">John Doe</div>
                <div className="text-300 text-xs">john@example.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

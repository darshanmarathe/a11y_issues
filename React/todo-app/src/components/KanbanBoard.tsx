import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import type { RootState, AppDispatch } from '../app/store';
import { updateTodo } from '../features/todos/todosSlice';
import type { Todo, Status, Priority } from '../types';

const statusOptions: Status[] = ['Backlog', 'Linedup', 'Wip', 'Done', 'Stuck'];
const priorityOptions: Priority[] = ['Urgent', 'High', 'Medium', 'Low'];

const statusColumns: { id: Status; label: string; color: string; gradient: string; icon: string }[] = [
  { id: 'Backlog', label: 'Backlog', color: '#6c757d', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'pi-inbox' },
  { id: 'Linedup', label: 'Lined Up', color: '#17a2b8', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: 'pi-list' },
  { id: 'Wip', label: 'In Progress', color: '#ffc107', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: 'pi-spinner' },
  { id: 'Done', label: 'Done', color: '#28a745', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: 'pi-check-circle' },
  { id: 'Stuck', label: 'Stuck', color: '#dc3545', gradient: 'linear-gradient(135deg, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)', icon: 'pi-exclamation-triangle' },
];

const priorityColorMap: Record<string, string> = {
  Urgent: '#dc3545',
  High: '#fd7e14',
  Medium: '#17a2b8',
  Low: '#28a745',
};

export default function KanbanBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: todos } = useSelector((state: RootState) => state.todos);
  const { items: projects } = useSelector((state: RootState) => state.projects);
  const { items: users } = useSelector((state: RootState) => state.users);

  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Todo>>({});

  const getTodosByStatus = (status: Status) => {
    return todos.filter((todo) => todo.status === status);
  };

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };

  const handleDrop = (status: Status) => {
    if (draggedTodo && draggedTodo.status !== status) {
      const isCompleted = status === 'Done';
      dispatch(
        updateTodo({
          id: draggedTodo.id,
          todo: {
            status,
            isCompleted,
            completion_date: isCompleted ? new Date().toISOString() : undefined,
          },
        })
      );
    }
    setDraggedTodo(null);
  };

  const openEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditFormData({ ...todo });
    setShowEditDialog(true);
  };

  const saveEditTodo = () => {
    if (editingTodo && editFormData.title?.trim()) {
      dispatch(updateTodo({ id: editingTodo.id, todo: editFormData })).then(() => {
        setShowEditDialog(false);
        setEditingTodo(null);
      });
    }
  };

  const hideEditDialog = () => {
    setShowEditDialog(false);
    setEditingTodo(null);
    setEditFormData({});
  };

  const editDialogFooter = (
    <div className="flex gap-2 justify-content-end">
      <Button label="Cancel" icon="pi pi-times" onClick={hideEditDialog} outlined />
      <Button label="Save" icon="pi pi-check" onClick={saveEditTodo} />
    </div>
  );

  const TodoCard = ({ todo }: { todo: Todo }) => {
    const project = projects.find((p) => p.id === todo.project_id);
    const user = users.find((u) => u.id === todo.user_id);

    return (
      <div
        draggable
        onDragStart={() => handleDragStart(todo)}
        className="p-3 mb-3 bg-white border-round shadow-sm hover:shadow-md transition-all cursor-move group relative"
        style={{ borderLeft: `4px solid ${priorityColorMap[todo.priority]}` }}
      >
        <button
          className="edit-btn absolute top-2 right-2 p-button p-component p-button-text p-button-rounded p-button-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            openEditTodo(todo);
          }}
          title="Edit Todo"
        >
          <i className="pi pi-pencil text-xs" />
        </button>
        <div className="flex justify-content-between align-items-start mb-2">
          <h4 className="text-sm font-semibold m-0 flex-1 pr-2 text-900">{todo.title}</h4>
          <Badge
            value={todo.priority}
            style={{ backgroundColor: priorityColorMap[todo.priority] }}
            className="text-xs"
          />
        </div>
        {todo.description && (
          <p className="text-sm text-600 m-0 mb-2 line-clamp-2">{todo.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {project && (
            <span className="text-xs px-2 py-1 border-round flex align-items-center gap-1" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
              <i className="pi pi-folder mr-1" style={{ fontSize: '0.6rem' }} />
              {project.name}
            </span>
          )}
          {user && (
            <span className="text-xs px-2 py-1 border-round bg-100 flex align-items-center gap-1">
              {user.avatar && (
                <img src={user.avatar} alt={user.name} className="w-1rem h-1rem border-circle" />
              )}
              {user.name}
            </span>
          )}
        </div>
        {todo.target_completion_date && (
          <div className="mt-2 text-xs text-600">
            <i className="pi pi-calendar mr-1" />
            {new Date(todo.target_completion_date).toLocaleDateString()}
          </div>
        )}
        {todo.link && (
          <div className="mt-1">
            <a
              href={todo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              <i className="pi pi-external-link mr-1" />
              View Link
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="kanban-page">
      <div className="mb-4">
        <h1 className="text-3xl font-bold m-0 text-900">Kanban Board</h1>
        <p className="text-600 mt-1">Drag and drop tasks between columns to update their status</p>
      </div>

      <div className="grid m-0">
        {statusColumns.map((column) => {
          const columnTodos = getTodosByStatus(column.id);
          return (
            <div key={column.id} className="col-12 md:col mb-3">
              <div
                className="kanban-column h-full border-round overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)' }}
              >
                <div
                  className="p-3 flex justify-content-between align-items-center"
                  style={{ background: column.gradient }}
                >
                  <span className="font-semibold text-white">
                    <i className={`${column.icon} mr-2`} />
                    {column.label}
                  </span>
                  <Badge value={columnTodos.length} className="bg-white text-900" />
                </div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(column.id)}
                  className="p-3 min-h-[300px]"
                >
                  {columnTodos.length === 0 ? (
                    <div className="text-center text-500 p-4">
                      <i className="pi pi-inbox text-3xl mb-2" />
                      <p className="m-0 text-sm">No tasks</p>
                    </div>
                  ) : (
                    columnTodos.map((todo) => <TodoCard key={todo.id} todo={todo} />)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Todo Dialog */}
      <Dialog
        header="Edit Todo"
        visible={showEditDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={hideEditDialog}
        footer={editDialogFooter}
      >
        {editingTodo && (
          <div className="flex flex-column gap-4">
            <div>
              <label htmlFor="kb-edit-title" className="font-semibold block mb-2">
                Title *
              </label>
              <InputText
                id="kb-edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label htmlFor="kb-edit-description" className="font-semibold block mb-2">
                Description
              </label>
              <InputTextarea
                id="kb-edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full"
                rows={3}
                placeholder="Enter description"
              />
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <label htmlFor="kb-edit-status" className="font-semibold block mb-2">
                  Status
                </label>
                <Dropdown
                  id="kb-edit-status"
                  value={editFormData.status}
                  options={statusOptions}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.value })}
                  className="w-full"
                  placeholder="Select status"
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="kb-edit-priority" className="font-semibold block mb-2">
                  Priority
                </label>
                <Dropdown
                  id="kb-edit-priority"
                  value={editFormData.priority}
                  options={priorityOptions}
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.value })}
                  className="w-full"
                  placeholder="Select priority"
                />
              </div>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <label htmlFor="kb-edit-project" className="font-semibold block mb-2">
                  Project
                </label>
                <Dropdown
                  id="kb-edit-project"
                  value={editFormData.project_id}
                  options={projects}
                  onChange={(e) => setEditFormData({ ...editFormData, project_id: e.value?.id })}
                  optionLabel="name"
                  optionValue="id"
                  className="w-full"
                  placeholder="Select project"
                  showClear
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="kb-edit-user" className="font-semibold block mb-2">
                  Assignee
                </label>
                <Dropdown
                  id="kb-edit-user"
                  value={editFormData.user_id}
                  options={users}
                  onChange={(e) => setEditFormData({ ...editFormData, user_id: e.value?.id })}
                  optionLabel="name"
                  optionValue="id"
                  className="w-full"
                  placeholder="Select user"
                  showClear
                />
              </div>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <label htmlFor="kb-edit-targetDate" className="font-semibold block mb-2">
                  Target Completion Date
                </label>
                <Calendar
                  id="kb-edit-targetDate"
                  value={editFormData.target_completion_date ? new Date(editFormData.target_completion_date) : undefined}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, target_completion_date: e.value?.toISOString() })
                  }
                  className="w-full"
                  showIcon
                />
              </div>
              <div className="col-12 md:col-6">
                <label htmlFor="kb-edit-link" className="font-semibold block mb-2">
                  Link
                </label>
                <InputText
                  id="kb-edit-link"
                  value={editFormData.link}
                  onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                  className="w-full"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex align-items-center gap-2">
              <input
                type="checkbox"
                id="kb-edit-isCompleted"
                checked={editFormData.isCompleted}
                onChange={(e) => setEditFormData({ ...editFormData, isCompleted: e.target.checked })}
              />
              <label htmlFor="kb-edit-isCompleted" className="font-semibold">
                Mark as Completed
              </label>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

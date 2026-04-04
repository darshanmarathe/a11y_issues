import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import type { RootState, AppDispatch } from '../app/store';
import { createTodo, updateTodo, deleteTodo, fetchTodos } from '../features/todos/todosSlice';
import type { Todo, Status, Priority } from '../types';

const statusOptions: Status[] = ['Backlog', 'Linedup', 'Wip', 'Done', 'Stuck'];
const priorityOptions: Priority[] = ['Urgent', 'High', 'Medium', 'Low'];

const statusColorMap: Record<Status, string> = {
  Backlog: 'secondary',
  Linedup: 'info',
  Wip: 'warning',
  Done: 'success',
  Stuck: 'danger',
};

const priorityColorMap: Record<Priority, string> = {
  Urgent: 'danger',
  High: 'warning',
  Medium: 'info',
  Low: 'success',
};

export default function TodoList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: todos, loading } = useSelector((state: RootState) => state.todos);
  const { items: projects } = useSelector((state: RootState) => state.projects);
  const { items: users } = useSelector((state: RootState) => state.users);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<Partial<Todo>>({
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'Medium',
    isCompleted: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchTodos());
      document.querySelector('.p-datatable-wrapper')?.scrollTo({ top: 0 });
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'Backlog',
      priority: 'Medium',
      isCompleted: false,
      project_id: undefined,
      user_id: undefined,
      link: '',
      target_completion_date: undefined,
    });
    setSelectedTodo(null);
  };

  const openNew = () => {
    resetForm();
    setIsEdit(false);
    setShowDialog(true);
  };

  const openEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setFormData({ ...todo });
    setIsEdit(true);
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    resetForm();
  };

  const saveTodo = () => {
    if (!formData.title?.trim()) return;

    if (isEdit && selectedTodo) {
      dispatch(updateTodo({ id: selectedTodo.id, todo: formData })).then(() => {
        hideDialog();
        document.body.focus();
      });
    } else {
      dispatch(
        createTodo({
          ...formData,
          title: formData.title!,
          description: formData.description || '',
          status: (formData.status as Status) || 'Backlog',
          priority: (formData.priority as Priority) || 'Medium',
          isCompleted: formData.isCompleted || false,
        } as Omit<Todo, 'id' | 'created_at' | 'updated_at'> & { created_at: string; updated_at: string })
      ).then(() => {
        hideDialog();
        document.body.focus();
      });
    }
  };

  const handleDelete = (todo: Todo) => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      dispatch(deleteTodo(todo.id));
    }
  };

  const statusBodyTemplate = (rowData: Todo) => {
    return (
      <span
        className="w-2rem h-2rem inline-block border-round"
        style={{ backgroundColor: statusColorMap[rowData.status] === 'secondary' ? '#6c757d' : statusColorMap[rowData.status] === 'info' ? '#17a2b8' : statusColorMap[rowData.status] === 'warning' ? '#ffc107' : statusColorMap[rowData.status] === 'success' ? '#28a745' : '#dc3545' }}
        title={rowData.status}
      />
    );
  };

  const priorityBodyTemplate = (rowData: Todo) => {
    return (
      <span
        className="w-1rem h-1rem inline-block border-circle"
        style={{ backgroundColor: priorityColorMap[rowData.priority] === 'danger' ? '#dc3545' : priorityColorMap[rowData.priority] === 'warning' ? '#fd7e14' : priorityColorMap[rowData.priority] === 'info' ? '#17a2b8' : '#28a745' }}
        title={rowData.priority}
      />
    );
  };

  const projectBodyTemplate = (rowData: Todo) => {
    const project = projects.find((p) => p.id === rowData.project_id);
    return project ? (
      <span className="flex align-items-center gap-2">
        <span
          className="w-2 h-2 border-round"
          style={{ backgroundColor: project.color }}
        />
        {project.name}
      </span>
    ) : (
      '-'
    );
  };

  const userBodyTemplate = (rowData: Todo) => {
    const user = users.find((u) => u.id === rowData.user_id);
    return user ? (
      <span className="flex align-items-center gap-2">
        {user.avatar && (
          <img
            src={user.avatar}
            className="w-2rem h-2rem border-circle"
          />
        )}
        {user.name}
      </span>
    ) : (
      '-'
    );
  };

  const completedBodyTemplate = (rowData: Todo) => {
    return (
      <i
        className={`pi ${rowData.isCompleted ? 'pi-check text-green-500' : 'pi-times text-red-500'}`}
      />
    );
  };

  const linkBodyTemplate = (rowData: Todo) => {
    return rowData.link ? (
      <a href={rowData.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
        Link
      </a>
    ) : (
      '-'
    );
  };

  const actionBodyTemplate = (rowData: Todo) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          severity="success"
          onClick={() => openEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  const dialogFooter = (
    <div className="flex gap-2 justify-content-end">
      <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} outlined />
      <Button label="Save" icon="pi pi-check" onClick={saveTodo} />
    </div>
  );

  return (
    <div className="card">
      <Toast />
      <div className="flex justify-content-between align-items-center mb-4">
        <div className="text-2xl font-bold m-0">Todo List</div>
        <Button label="New Todo" icon="pi pi-plus" onClick={openNew} severity="success" />
      </div>

      <DataTable
        value={todos}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '60rem' }}
        selection={selectedTodo}
        onSelectionChange={(e) => setSelectedTodo(e.value as Todo)}
        selectionMode="single"
        dataKey="id"
      >
        <Column field="title" header="Title" sortable style={{ width: '20%' }} />
        <Column field="description" header="Description" style={{ width: '20%' }} />
        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '10%' }} />
        <Column field="priority" header="Priority" body={priorityBodyTemplate} sortable style={{ width: '8%' }} />
        <Column field="project_id" header="Project" body={projectBodyTemplate} sortable style={{ width: '10%' }} />
        <Column field="user_id" header="Assignee" body={userBodyTemplate} style={{ width: '12%' }} />
        <Column field="isCompleted" header="Done" body={completedBodyTemplate} style={{ width: '5%' }} />
        <Column field="link" header="Link" body={linkBodyTemplate} style={{ width: '8%' }} />
        <Column
          field="target_completion_date"
          header="Target Date"
          dataType="date"
          sortable
          style={{ width: '10%' }}
        />
        <Column body={actionBodyTemplate} style={{ width: '8%' }} />
      </DataTable>

      <Dialog
        header={isEdit ? 'Edit Todo' : 'New Todo'}
        visible={showDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="flex flex-column gap-4">
          <div>
            <span className="font-semibold block mb-2">Title *</span>
            <InputText
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full"
              placeholder="Enter title"
            />
          </div>

          <div>
            <span className="font-semibold block mb-2">Description</span>
            <InputTextarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full"
              rows={3}
              placeholder="Enter description"
            />
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <span className="font-semibold block mb-2">Status</span>
              <Dropdown
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
                className="w-full"
                placeholder="Select status"
              />
            </div>
            <div className="col-12 md:col-6">
              <span className="font-semibold block mb-2">Priority</span>
              <Dropdown
                value={formData.priority}
                options={priorityOptions}
                onChange={(e) => setFormData({ ...formData, priority: e.value })}
                className="w-full"
                placeholder="Select priority"
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <span className="font-semibold block mb-2">Project</span>
              <Dropdown
                value={formData.project_id}
                options={projects}
                onChange={(e) => setFormData({ ...formData, project_id: e.value?.id })}
                optionLabel="name"
                optionValue="id"
                className="w-full"
                placeholder="Select project"
                showClear
              />
            </div>
            <div className="col-12 md:col-6">
              <span className="font-semibold block mb-2">Assignee</span>
              <Dropdown
                value={formData.user_id}
                options={users}
                onChange={(e) => setFormData({ ...formData, user_id: e.value?.id })}
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
              <span className="font-semibold block mb-2">Target Completion Date</span>
              <Calendar
                value={formData.target_completion_date ? new Date(formData.target_completion_date) : undefined}
                onChange={(e) =>
                  setFormData({ ...formData, target_completion_date: e.value?.toISOString() })
                }
                className="w-full"
                showIcon
              />
            </div>
            <div className="col-12 md:col-6">
              <span className="font-semibold block mb-2">Link</span>
              <InputText
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex align-items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isCompleted}
              onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
            />
            <span className="font-semibold">Mark as Completed</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

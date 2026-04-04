import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ColorPicker } from 'primereact/colorpicker';
import { Badge } from 'primereact/badge';
import type { RootState, AppDispatch } from '../app/store';
import { createProject, updateProject, deleteProject } from '../features/projects/projectsSlice';
import type { Project } from '../types';

export default function ProjectsMaster() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: projects, loading } = useSelector((state: RootState) => state.projects);
  const { items: todos } = useSelector((state: RootState) => state.todos);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
    });
    setSelectedProject(null);
  };

  const openNew = () => {
    resetForm();
    setIsEdit(false);
    setShowDialog(true);
  };

  const openEdit = (project: Project) => {
    setSelectedProject(project);
    setFormData({ ...project });
    setIsEdit(true);
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    resetForm();
  };

  const saveProject = () => {
    if (!formData.name?.trim()) return;

    if (isEdit && selectedProject) {
      dispatch(updateProject({ id: selectedProject.id, project: formData })).then(() => {
        hideDialog();
      });
    } else {
      dispatch(
        createProject({
          ...formData,
          name: formData.name!,
          description: formData.description || '',
          color: formData.color || '#3B82F6',
        } as Omit<Project, 'id' | 'created_at'>)
      ).then(() => {
        hideDialog();
      });
    }
  };

  const handleDelete = (project: Project) => {
    const projectTodos = todos.filter((t) => t.project_id === project.id);
    const message = projectTodos.length > 0
      ? `Project "${project.name}" has ${projectTodos.length} associated todos. Delete anyway?`
      : `Are you sure you want to delete "${project.name}"?`;

    if (window.confirm(message)) {
      dispatch(deleteProject(project.id));
    }
  };

  const getTodoCount = (projectId: number) => {
    return todos.filter((t) => t.project_id === projectId).length;
  };

  const getCompletedCount = (projectId: number) => {
    return todos.filter((t) => t.project_id === projectId && t.isCompleted).length;
  };

  const colorBodyTemplate = (rowData: Project) => {
    return (
      <div className="flex align-items-center gap-2">
        <span
          className="w-2rem h-2rem border-round"
          style={{ backgroundColor: rowData.color }}
        />
        <span className="text-sm">{rowData.color}</span>
      </div>
    );
  };

  const statsBodyTemplate = (rowData: Project) => {
    const total = getTodoCount(rowData.id);
    const completed = getCompletedCount(rowData.id);
    return (
      <div className="flex gap-2">
        <Badge value={`${total} total`} severity="info" />
        <Badge value={`${completed} done`} severity="success" />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Project) => {
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
      <Button label="Save" icon="pi pi-check" onClick={saveProject} />
    </div>
  );

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <div className="text-2xl font-bold m-0">Projects Master</div>
        <Button label="New Project" icon="pi pi-plus" onClick={openNew} severity="success" />
      </div>

      <DataTable
        value={projects}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        selection={selectedProject}
        onSelectionChange={(e) => setSelectedProject(e.value as Project)}
        selectionMode="single"
        dataKey="id"
      >
        <Column field="name" header="Name" sortable style={{ width: '20%' }} />
        <Column field="description" header="Description" style={{ width: '30%' }} />
        <Column field="color" header="Color" body={colorBodyTemplate} style={{ width: '15%' }} />
        <Column header="Stats" body={statsBodyTemplate} style={{ width: '20%' }} />
        <Column field="created_at" header="Created" dataType="date" sortable style={{ width: '15%' }} />
        <Column body={actionBodyTemplate} style={{ width: '15%' }} />
      </DataTable>

      <Dialog
        header={isEdit ? 'Edit Project' : 'New Project'}
        visible={showDialog}
        style={{ width: '40vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="flex flex-column gap-4">
          <div>
            <label htmlFor="name" className="font-semibold block mb-2">
              Name *
            </label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label htmlFor="description" className="font-semibold block mb-2">
              Description
            </label>
            <InputTextarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full"
              rows={3}
              placeholder="Enter description"
            />
          </div>

          <div>
            <label htmlFor="color" className="font-semibold block mb-2">
              Color
            </label>
            <ColorPicker
              id="color"
              value={formData.color || '#3B82F6'}
              onChange={(e) => {
                const colorValue = typeof e.value === 'string' ? e.value : '#3B82F6';
                setFormData({ ...formData, color: colorValue });
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

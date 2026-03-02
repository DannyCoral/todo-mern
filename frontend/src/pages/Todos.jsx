import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { useAuth } from '../context/AuthContext';
import KanbanColumn from '../components/KanbanColumn';
import KanbanCard from '../components/KanbanCard';
import TodoDetail from '../components/TodoDetail';
import api from '../api/axios';


const Todos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, darkMode, toggleTheme } = useTheme();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTodo, setActiveTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data } = await api.get('/todos');
    setTodos(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await api.post('/todos', { title, dueDate: dueDate || null });
    setTodos([data, ...todos]);
    setTitle('');
    setDueDate('');
  };

  const handleDelete = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const handleEdit = async (id, newTitle) => {
    const { data } = await api.put(`/todos/${id}`, { title: newTitle });
    setTodos(todos.map((t) => (t._id === data._id ? data : t)));
  };

  const handleUpdate = (updatedTodo) => {
    setTodos(todos.map((t) => (t._id === updatedTodo._id ? updatedTodo : t)));
    setSelectedTodo(updatedTodo);
  };

  // Drag & Drop
  const handleDragStart = (event) => {
    const todo = todos.find(t => t._id === event.active.id);
    setActiveTodo(todo);
  };

const handleDragEnd = async (event) => {
  const { active, over } = event;
  setActiveTodo(null);

  if (!over) return;

  const todoId = active.id;

  // Si se suelta sobre una tarjeta, obtenemos el status de esa tarjeta
  const overTodo = todos.find(t => t._id === over.id);
  const newStatus = overTodo ? overTodo.status : over.id;

  if (!['pending', 'inProgress', 'completed'].includes(newStatus)) return;

  const todo = todos.find(t => t._id === todoId);
  if (!todo || todo.status === newStatus) return;

  const newProgress = newStatus === 'completed' ? 100 : newStatus === 'inProgress' ? 50 : 0;

  // Actualizamos el estado local inmediatamente
  setTodos(todos.map(t =>
    t._id === todoId
      ? { ...t, status: newStatus, completed: newStatus === 'completed', progress: newProgress }
      : t
  ));

  // Luego actualizamos en el backend
  await api.put(`/todos/${todoId}`, { status: newStatus, progress: newProgress });
};

  // Filtrar tareas por columna
  const getTodosByStatus = (status) => {
    return todos.filter(t => {
      if (filter === 'all') return t.status === status;
      return t.status === status && (filter === status);
    });
  };

  const filteredByStatus = (status) => {
    if (filter === 'all') return todos.filter(t => t.status === status);
    if (filter === status) return todos.filter(t => t.status === status);
    return [];
  };

  return (
  <div style={{ ...styles.container, background: theme.background }}>

    {/* Panel izquierdo */}
    <div style={{ ...styles.leftPanel, background: theme.sidebar, boxShadow: `2px 0 8px rgba(0,0,0,0.08)` }}>

      {/* Header */}
      <div style={{ ...styles.header, borderBottom: `1px solid ${theme.border}` }}>
        <div>
          <h2 style={{ margin: 0, color: theme.text }}>Mis Tareas</h2>
          <p style={{ margin: '4px 0 0', color: theme.textSecondary, fontSize: '14px' }}>Hola, {user.name} 👋</p>
        </div>
        <button onClick={toggleTheme} style={{ ...styles.themeBtn, background: theme.cardHover, color: theme.text, border: `1px solid ${theme.border}` }}>
  {darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
</button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleCreate} style={styles.formWrapper}>
        <input
          style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
          placeholder="Nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div style={styles.dateGroup}>
          <label style={{ ...styles.dateLabel, color: theme.textMuted }}>🚀 Fecha de inicio</label>
          <input
            style={{ ...styles.dateInput, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
            type="date"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div style={styles.dateGroup}>
          <label style={{ ...styles.dateLabel, color: theme.textMuted }}>⏰ Fecha límite</label>
          <input
            style={{ ...styles.dateInput, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
            type="date"
            value={dueDate}
            min={startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button style={{ ...styles.addBtn, background: theme.button, color: theme.buttonText }} type="submit">+ Agregar</button>
      </form>

      {/* Estadísticas */}
      <div style={{ ...styles.stats, background: theme.cardHover }}>
        <div style={styles.stat}>
          <span style={{ ...styles.statNumber, color: '#e53e3e' }}>{todos.filter(t => t.status === 'pending').length}</span>
          <span style={{ ...styles.statLabel, color: theme.textMuted }}>Pendientes</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNumber, color: '#d69e2e' }}>{todos.filter(t => t.status === 'inProgress').length}</span>
          <span style={{ ...styles.statLabel, color: theme.textMuted }}>En Progreso</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNumber, color: '#38a169' }}>{todos.filter(t => t.status === 'completed').length}</span>
          <span style={{ ...styles.statLabel, color: theme.textMuted }}>Completadas</span>
        </div>
      </div>

      {/* Botones */}
      <button onClick={() => navigate('/profile')} style={{ ...styles.profileBtn, border: `1px solid ${theme.border}`, background: theme.card, color: theme.button }}>
        👤 Mi Perfil
      </button>
      <button onClick={logout} style={{ ...styles.logoutBtn, border: `1px solid ${theme.border}`, background: theme.card, color: '#e53e3e' }}>
        Cerrar sesión
      </button>
    </div>

    {/* Panel derecho — Kanban */}
    <div style={{ ...styles.rightPanel }}>

      {/* Filtros */}
      <div style={styles.filters}>
        {[
          { key: 'all', label: '📋 Todas' },
          { key: 'pending', label: '🔴 Pendientes' },
          { key: 'inProgress', label: '🟡 En Progreso' },
          { key: 'completed', label: '🟢 Completadas' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              ...styles.filterBtn,
              background: filter === f.key ? theme.button : theme.card,
              color: filter === f.key ? theme.buttonText : theme.textSecondary,
              border: `1px solid ${filter === f.key ? theme.button : theme.border}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={styles.kanban}>
          {['pending', 'inProgress', 'completed'].map(status => (
            <KanbanColumn
              key={status}
              status={status}
              todos={filteredByStatus(status)}
              onCardClick={setSelectedTodo}
              theme={theme}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTodo && <KanbanCard todo={activeTodo} onClick={() => {}} theme={theme} />}
        </DragOverlay>
      </DndContext>
    </div>

    {/* Modal de detalle */}
    {selectedTodo && (
      <TodoDetail
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
        onUpdate={handleUpdate}
        theme={theme}
      />
    )}

  </div>
);
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f0f2f5' },
  leftPanel: { width: '280px', minWidth: '280px', background: 'white', padding: '2rem', boxShadow: '2px 0 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { borderBottom: '1px solid #eee', paddingBottom: '1rem' },
  welcome: { margin: '4px 0 0', color: '#666', fontSize: '14px' },
  formWrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  dateInput: { padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', color: '#666' },
  addBtn: { padding: '10px', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  filters: { display: 'flex', flexDirection: 'column', gap: '6px' },
  filterBtn: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#666', textAlign: 'left' },
  filterActive: { background: '#4f46e5', color: 'white', border: '1px solid #4f46e5' },
  stats: { display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', borderRadius: '12px', padding: '1rem' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  statNumber: { fontSize: '24px', fontWeight: '700' },
  statLabel: { fontSize: '11px', color: '#888' },
  logoutBtn: { marginTop: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', color: '#666', fontSize: '14px' },
  rightPanel: { flex: 1, padding: '2rem', overflowX: 'auto' },
  kanban: { display: 'flex', gap: '1rem', minWidth: '600px', height: '100%' },
  dateGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  profileBtn: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', color: '#4f46e5', fontSize: '14px', fontWeight: '600' },
    filters: { display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' },
filterBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#666', fontWeight: '500' },
filterActive: { background: '#4f46e5', color: 'white', border: '1px solid #4f46e5' },
themeBtn: { padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
dateGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
};

export default Todos;
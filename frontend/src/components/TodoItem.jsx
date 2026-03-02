import { useState, useEffect } from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!todo.dueDate) return; // si no tiene fecha límite no hacemos nada

    const calculateTimeLeft = () => {
      const diff = new Date(todo.dueDate) - new Date();

      if (diff <= 0) {
        setIsOverdue(true);
        // calculamos cuanto tiempo lleva vencida
        const overdueDiff = Math.abs(diff);
        const days = Math.floor(overdueDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((overdueDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((overdueDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((overdueDiff / 1000) % 60);

        if (days > 0) setTimeLeft(`Venció hace ${days}d ${hours}h ${minutes}m`);
        else if (hours > 0) setTimeLeft(`Venció hace ${hours}h ${minutes}m ${seconds}s`);
        else setTimeLeft(`Venció hace ${minutes}m ${seconds}s`);
      } else {
        setIsOverdue(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days > 0) setTimeLeft(`Vence en ${days}d ${hours}h ${minutes}m`);
        else if (hours > 0) setTimeLeft(`Vence en ${hours}h ${minutes}m ${seconds}s`);
        else setTimeLeft(`Vence en ${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft(); // ejecutamos inmediatamente
    const interval = setInterval(calculateTimeLeft, 1000); // luego cada segundo

    return () => clearInterval(interval); // limpiamos al desmontar
  }, [todo.dueDate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = async () => {
    if (newTitle.trim() === '' || newTitle === todo.title) {
      setNewTitle(todo.title);
      setIsEditing(false);
      return;
    }
    await onEdit(todo._id, newTitle);
    setIsEditing(false);
  };

  // color del countdown según urgencia
  const getCountdownColor = () => {
    if (isOverdue) return '#e53e3e'; // rojo — vencida
    const diff = new Date(todo.dueDate) - new Date();
    const hoursLeft = diff / (1000 * 60 * 60);
    if (hoursLeft < 24) return '#dd6b20'; // naranja — menos de 24 horas
    if (hoursLeft < 72) return '#d69e2e'; // amarillo — menos de 3 días
    return '#38a169'; // verde — más de 3 días
  };

  return (
    <div style={{ 
      ...styles.item, 
      borderLeft: todo.dueDate ? `4px solid ${getCountdownColor()}` : '4px solid transparent' 
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        style={styles.checkbox}
      />
      <div style={styles.info}>
        {isEditing ? (
          <input
            style={styles.editInput}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            style={{
              ...styles.title,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#aaa' : '#333'
            }}
            title="Doble click para editar"
          >
            {todo.title}
          </span>
        )}

        <div style={styles.dates}>
          <span style={styles.date}>📅 Creada: {formatDate(todo.createdAt)}</span>
          {todo.dueDate && (
            <span style={{ ...styles.date, color: isOverdue && !todo.completed ? '#e53e3e' : '#666' }}>
              ⏰ Vence: {formatDate(todo.dueDate)}
            </span>
          )}
          {todo.dueDate && !todo.completed && (
            <span style={{ ...styles.countdown, color: getCountdownColor() }}>
              ⏱️ {timeLeft}
            </span>
          )}
          {todo.dueDate && todo.completed && (
            <span style={{ ...styles.date, color: '#38a169' }}>
              ✅ Completada a tiempo
            </span>
          )}
        </div>
      </div>
      <button onClick={() => onDelete(todo._id)} style={styles.deleteBtn}>✕</button>
    </div>
  );
};

const styles = {
  item: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '8px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  info: { display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' },
  title: { fontSize: '15px', cursor: 'pointer' },
  dates: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  date: { fontSize: '12px', color: '#aaa' },
  countdown: { fontSize: '12px', fontWeight: 'bold' },
  deleteBtn: { background: 'none', border: 'none', color: '#e53e3e', fontSize: '16px', cursor: 'pointer' },
  editInput: { fontSize: '15px', padding: '2px 8px', borderRadius: '6px', border: '1px solid #4f46e5', outline: 'none' },
};

export default TodoItem;
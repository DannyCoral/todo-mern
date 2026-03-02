import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';

const statusColors = {
  pending: '#e53e3e',
  inProgress: '#d69e2e',
  completed: '#38a169',
};

const KanbanCard = ({ todo, onClick, theme }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo._id });
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [startingSoon, setStartingSoon] = useState(false);

  useEffect(() => {
    if (!todo.dueDate || todo.completed) return;

    const calculateTimeLeft = () => {
      const diff = new Date(todo.dueDate) - new Date();
      if (diff <= 0) {
        setIsOverdue(true);
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

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [todo.dueDate, todo.completed]);

  useEffect(() => {
    if (!todo.startDate || todo.completed) return;
    const diffStart = new Date(todo.startDate) - new Date();
    const hoursToStart = diffStart / (1000 * 60 * 60);
    setStartingSoon(hoursToStart >= 0 && hoursToStart <= 24);
  }, [todo.startDate, todo.completed]);

  const getCountdownColor = () => {
    if (isOverdue) return '#e53e3e';
    const diff = new Date(todo.dueDate) - new Date();
    const hoursLeft = diff / (1000 * 60 * 60);
    if (hoursLeft < 24) return '#dd6b20';
    if (hoursLeft < 72) return '#d69e2e';
    return '#38a169';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...styles.card, ...style, background: theme.card, borderLeft: `4px solid ${statusColors[todo.status]}`, boxShadow: theme.shadow }}
      {...attributes}
    >
      <div style={styles.cardContent} onClick={() => onClick(todo)}>

        {/* Notificaciones */}
        {startingSoon && (
          <div style={{ ...styles.notification, background: '#fffff0', color: '#d69e2e', border: '1px solid #faf089' }}>
            🔔 ¡Próxima a iniciar!
          </div>
        )}
        {isOverdue && !todo.completed && (
          <div style={{ ...styles.notification, background: '#fff5f5', color: '#e53e3e', border: '1px solid #feb2b2' }}>
            ⚠️ ¡Tarea vencida!
          </div>
        )}

        {/* Título */}
        <p style={{ ...styles.title, color: theme.text }}>{todo.title}</p>

        {/* Barra de progreso */}
        <div style={{ ...styles.progressBar, background: theme.border }}>
          <div style={{ ...styles.progressFill, width: `${todo.progress}%`, background: statusColors[todo.status] }} />
        </div>
        <p style={{ ...styles.progressText, color: theme.textMuted }}>{todo.progress}%</p>

        {/* Fechas */}
        <div style={styles.dates}>
          <p style={{ ...styles.date, color: theme.textMuted }}>📅 Creada: {formatDate(todo.createdAt)}</p>
          {todo.startDate && (
            <p style={{ ...styles.date, color: startingSoon ? '#d69e2e' : theme.textMuted }}>
              🚀 Inicia: {formatDate(todo.startDate)}
            </p>
          )}
          {todo.dueDate && (
            <p style={{ ...styles.date, color: isOverdue && !todo.completed ? '#e53e3e' : theme.textMuted }}>
              ⏰ Vence: {formatDate(todo.dueDate)}
            </p>
          )}
          {todo.dueDate && !todo.completed && timeLeft && (
            <p style={{ ...styles.countdown, color: getCountdownColor() }}>
              ⏱️ {timeLeft}
            </p>
          )}
        </div>

        {/* Notas */}
        {todo.notes?.length > 0 && (
          <p style={{ ...styles.notesCount, color: theme.textMuted }}>📝 {todo.notes.length} nota(s)</p>
        )}
      </div>

      {/* Drag handle */}
      <div style={{ ...styles.dragHandle, borderLeft: `1px solid ${theme.border}`, color: theme.textMuted }} {...listeners} title="Arrastra para mover">
        ⠿
      </div>
    </div>
  );
};

const styles = {
  card: { borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'stretch' },
  cardContent: { flex: 1, padding: '12px', cursor: 'pointer' },
  dragHandle: { padding: '0 10px', display: 'flex', alignItems: 'center', cursor: 'grab', fontSize: '18px' },
  notification: { borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', marginBottom: '8px' },
  title: { margin: '0 0 8px', fontSize: '14px', fontWeight: '600' },
  progressBar: { height: '6px', borderRadius: '4px', marginBottom: '4px' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  progressText: { margin: '0 0 6px', fontSize: '11px', textAlign: 'right' },
  dates: { display: 'flex', flexDirection: 'column', gap: '2px' },
  date: { margin: 0, fontSize: '11px' },
  countdown: { margin: '2px 0 0', fontSize: '11px', fontWeight: 'bold' },
  notesCount: { margin: '6px 0 0', fontSize: '11px' },
};

export default KanbanCard;
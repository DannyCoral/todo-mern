import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const columnConfig = {
  pending: { label: 'Pendiente', color: '#e53e3e', bg: '#fff5f5' },
  inProgress: { label: 'En Progreso', color: '#d69e2e', bg: '#fffff0' },
  completed: { label: 'Completada', color: '#38a169', bg: '#f0fff4' },
};

const KanbanColumn = ({ status, todos, onCardClick, theme }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.column,
        background: isOver ? config.bg : theme.kanbanColumn,
        borderTop: `4px solid ${config.color}`,
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <span style={{ ...styles.dot, background: config.color }} />
        <h3 style={{ ...styles.title, color: theme.text }}>{config.label}</h3>
        <span style={{ ...styles.count, background: theme.badge, color: theme.badgeText }}>{todos.length}</span>
      </div>

      {/* Tarjetas */}
      <SortableContext items={todos.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <div style={styles.cards}>
          {todos.length === 0 ? (
            <p style={{ ...styles.empty, color: theme.textMuted }}>Sin tareas aquí</p>
          ) : (
            todos.map(todo => (
              <KanbanCard key={todo._id} todo={todo} onClick={onCardClick} theme={theme} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const styles = {
  column: { flex: 1, borderRadius: '12px', padding: '16px', minHeight: '400px', transition: 'background 0.2s' },
  header: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  title: { margin: 0, fontSize: '15px', fontWeight: '600', flex: 1 },
  count: { borderRadius: '12px', padding: '2px 8px', fontSize: '12px' },
  cards: { display: 'flex', flexDirection: 'column' },
  empty: { textAlign: 'center', fontSize: '13px', marginTop: '2rem' },
};

export default KanbanColumn;
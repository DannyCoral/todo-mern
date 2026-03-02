import { useState } from 'react';
import api from '../api/axios';

const statusConfig = {
  pending: { label: 'Pendiente', color: '#e53e3e' },
  inProgress: { label: 'En Progreso', color: '#d69e2e' },
  completed: { label: 'Completada', color: '#38a169' },
};

const TodoDetail = ({ todo, onClose, onUpdate, theme }) => {
  const [progress, setProgress] = useState(todo.progress);
  const [status, setStatus] = useState(todo.status);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(todo.notes || []);

  const handleProgressChange = async (value) => {
    setProgress(value);
    const { data } = await api.put(`/todos/${todo._id}`, { progress: value });
    onUpdate(data);
  };

  const handleStatusChange = async (value) => {
    setStatus(value);
    const newProgress = value === 'completed' ? 100 : value === 'inProgress' ? 50 : 0;
    setProgress(newProgress);
    const { data } = await api.put(`/todos/${todo._id}`, { status: value, progress: newProgress });
    onUpdate(data);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    const { data } = await api.post(`/todos/${todo._id}/notes`, { text: noteText });
    setNotes(data.notes);
    setNoteText('');
    onUpdate(data);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div style={{ ...styles.overlay, background: theme.overlay }} onClick={onClose}>
      <div style={{ ...styles.modal, background: theme.card, boxShadow: theme.shadow }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ ...styles.title, color: theme.text }}>{todo.title}</h2>
          <button onClick={onClose} style={{ ...styles.closeBtn, color: theme.textMuted }}>✕</button>
        </div>

        {/* Status */}
        <div style={styles.section}>
          <label style={{ ...styles.label, color: theme.textSecondary }}>Estado</label>
          <div style={styles.statusButtons}>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                style={{
                  ...styles.statusBtn,
                  background: status === key ? config.color : theme.card,
                  color: status === key ? 'white' : config.color,
                  border: `1px solid ${config.color}`,
                }}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progreso */}
        <div style={styles.section}>
          <label style={{ ...styles.label, color: theme.textSecondary }}>Progreso — {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            style={styles.range}
          />
          <div style={{ ...styles.progressBar, background: theme.border }}>
            <div style={{ ...styles.progressFill, width: `${progress}%`, background: statusConfig[status].color }} />
          </div>
        </div>

        {/* Notas */}
        <div style={styles.section}>
          <label style={{ ...styles.label, color: theme.textSecondary }}>Notas de avance</label>
          <div style={styles.noteInput}>
            <input
              style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
              placeholder="Escribe un avance..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <button onClick={handleAddNote} style={{ ...styles.addBtn, background: theme.button, color: theme.buttonText }}>
              Agregar
            </button>
          </div>

          <div style={styles.notesList}>
            {notes.length === 0 ? (
              <p style={{ textAlign: 'center', color: theme.textMuted, fontSize: '13px' }}>Sin notas aún</p>
            ) : (
              [...notes].reverse().map((note, index) => (
                <div key={index} style={{ ...styles.note, background: theme.cardHover }}>
                  <p style={{ ...styles.noteText, color: theme.text }}>{note.text}</p>
                  <p style={{ ...styles.noteDate, color: theme.textMuted }}>📅 {formatDate(note.date)}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { borderRadius: '16px', padding: '2rem', width: '500px', maxHeight: '80vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { margin: 0, fontSize: '18px', fontWeight: '700', flex: 1, paddingRight: '1rem' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  section: { marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statusButtons: { display: 'flex', gap: '8px' },
  statusBtn: { flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' },
  range: { width: '100%', marginBottom: '8px' },
  progressBar: { height: '8px', borderRadius: '4px' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  noteInput: { display: 'flex', gap: '8px', marginBottom: '12px' },
  input: { flex: 1, padding: '8px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  addBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' },
  notesList: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' },
  note: { borderRadius: '8px', padding: '10px 12px' },
  noteText: { margin: '0 0 4px', fontSize: '14px' },
  noteDate: { margin: 0, fontSize: '11px' },
};

export default TodoDetail;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', notificationsEmail: true });
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      setForm({ name: data.name, phone: data.phone || '', notificationsEmail: data.notificationsEmail });
      setIsGoogleUser(!!data.googleId);
    } catch (err) {
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/user/profile', form);
      setSuccess('¡Perfil actualizado correctamente! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: theme.background, color: theme.text }}>
      Cargando perfil...
    </div>
  );

  return (
    <div style={{ ...styles.container, background: theme.background }}>
      <div style={{ ...styles.card, background: theme.card, boxShadow: theme.shadow }}>

        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/todos')} style={{ ...styles.backBtn, border: `1px solid ${theme.border}`, color: theme.textSecondary, background: theme.card }}>← Volver</button>
          <h2 style={{ ...styles.title, color: theme.text }}>Mi Perfil</h2>
          <button onClick={toggleTheme} style={{ ...styles.themeBtn, background: theme.cardHover, color: theme.text, border: `1px solid ${theme.border}` }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Avatar */}
        <div style={{ ...styles.avatar, background: theme.cardHover }}>
          <div style={styles.avatarCircle}>
            {form.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ ...styles.avatarName, color: theme.text }}>{form.name}</p>
            <p style={{ ...styles.avatarEmail, color: theme.textSecondary }}>{user.email}</p>
            <span style={{ ...styles.badge, background: theme.badge, color: theme.badgeText }}>
              {isGoogleUser ? '🔵 Cuenta Google' : '📧 Cuenta Email'}
            </span>
          </div>
        </div>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={{ ...styles.label, color: theme.textSecondary }}>Nombre completo</label>
            <input
              style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={{ ...styles.label, color: theme.textSecondary }}>Email</label>
            <input
              style={{ ...styles.input, background: theme.cardHover, color: theme.textMuted, border: `1px solid ${theme.border}` }}
              value={user.email}
              disabled
            />
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: theme.textMuted }}>El email no puede modificarse</p>
          </div>

          <div style={styles.field}>
            <label style={{ ...styles.label, color: theme.textSecondary }}>📱 Teléfono <span style={{ fontWeight: '400', color: theme.textMuted }}>(para WhatsApp)</span></label>
            <input
              style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+50212345678"
            />
          </div>

          <div style={{ ...styles.notifSection, background: theme.cardHover }}>
            <p style={{ ...styles.label, color: theme.textSecondary }}>🔔 Notificaciones</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: theme.text }}>
              <input
                type="checkbox"
                name="notificationsEmail"
                checked={form.notificationsEmail}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              Recibir notificaciones por email
            </label>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: theme.textMuted }}>
              Recordatorios 48h antes del inicio y 72h antes del vencimiento
            </p>
          </div>

          <button style={{ ...styles.saveBtn, background: theme.button, color: theme.buttonText }} type="submit">
            Guardar cambios
          </button>
        </form>

        <button onClick={logout} style={{ ...styles.logoutBtn, border: `1px solid ${theme.border}`, background: theme.card }}>
          Cerrar sesión
        </button>

      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '2rem' },
  card: { padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '460px' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  backBtn: { borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '14px' },
  title: { margin: 0, fontSize: '20px', fontWeight: '700', flex: 1 },
  themeBtn: { padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  avatar: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' },
  avatarCircle: { width: '56px', height: '56px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', flexShrink: 0 },
  avatarName: { margin: '0 0 2px', fontWeight: '600', fontSize: '16px' },
  avatarEmail: { margin: '0 0 6px', fontSize: '13px' },
  badge: { borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' },
  success: { background: '#f0fff4', color: '#38a169', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '1rem' },
  error: { background: '#fff5f5', color: '#e53e3e', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600' },
  input: { padding: '10px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none' },
  notifSection: { padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' },
  saveBtn: { padding: '12px', borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer', fontWeight: '600' },
  logoutBtn: { width: '100%', marginTop: '1rem', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: '#e53e3e', fontSize: '14px' },
};

export default Profile;
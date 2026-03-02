import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const { theme, darkMode, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.phone);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div style={{ ...styles.container, background: theme.background }}>
      <div style={{ ...styles.card, background: theme.card, boxShadow: theme.shadow }}>

        {/* Botón tema */}
        <div style={styles.themeToggle}>
          <button onClick={toggleTheme} style={{ ...styles.themeBtn, background: theme.cardHover, color: theme.text, border: `1px solid ${theme.border}` }}>
            {darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
          </button>
        </div>

        <h2 style={{ color: theme.text }}>Crear cuenta</h2>
        <p style={{ color: theme.textSecondary, fontSize: '13px', margin: '0 0 1rem' }}>Completa tu información para recibir notificaciones</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <input
              style={{ ...styles.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }}
              name="phone"
              type="tel"
              placeholder="Teléfono (ej: +50212345678)"
              value={form.phone}
              onChange={handleChange}
            />
            <p style={{ margin: 0, fontSize: '11px', color: theme.textMuted }}>📱 Requerido para notificaciones por WhatsApp</p>
          </div>
          <button style={{ ...styles.button, background: theme.button, color: theme.buttonText }} type="submit">Registrarse</button>
        </form>

        <div style={styles.divider}>
          <hr style={{ ...styles.line, borderColor: theme.border }} />
          <span style={{ color: theme.textMuted }}>o</span>
          <hr style={{ ...styles.line, borderColor: theme.border }} />
        </div>

        <button onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'} style={{ ...styles.googleBtn, border: `1px solid ${theme.border}`, background: theme.card, color: theme.text }}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
          Registrarse con Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: theme.textSecondary }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: theme.button }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  card: { padding: '2rem', borderRadius: '12px', width: '360px' },
  themeToggle: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
  themeBtn: { padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', margin: '1rem 0' },
  input: { padding: '10px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none' },
  button: { padding: '10px', borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer', fontWeight: '600' },
  error: { color: '#e53e3e', fontSize: '14px' },
  divider: { display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0' },
  line: { flex: 1, border: 'none', borderTop: '1px solid' },
  googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
};

export default Register;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Leemos el token y user de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    console.log('token:', token); // 👈
    console.log('user:', user);   // 👈

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);

       

      navigate('/todos');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Iniciando sesión con Google...</p>
    </div>
  );
};

export default AuthCallback;
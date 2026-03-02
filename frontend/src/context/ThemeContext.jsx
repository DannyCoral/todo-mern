import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    background: '#f0f2f5',
    card: '#ffffff',
    cardHover: '#f8f9fa',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#aaaaaa',
    border: '#dddddd',
    input: '#ffffff',
    inputBorder: '#dddddd',
    button: '#4f46e5',
    buttonText: '#ffffff',
    sidebar: '#ffffff',
    kanbanColumn: '#f8f9fa',
    todoItem: '#f8f9fa',
    overlay: 'rgba(0,0,0,0.5)',
    shadow: '0 2px 16px rgba(0,0,0,0.1)',
    badge: '#eef2ff',
    badgeText: '#4f46e5',
  },
  dark: {
    background: '#0f0f1a',
    card: '#1a1a2e',
    cardHover: '#16213e',
    text: '#e0e0e0',
    textSecondary: '#aaaaaa',
    textMuted: '#666666',
    border: '#2d2d4e',
    input: '#16213e',
    inputBorder: '#2d2d4e',
    button: '#6366f1',
    buttonText: '#ffffff',
    sidebar: '#1a1a2e',
    kanbanColumn: '#16213e',
    todoItem: '#16213e',
    overlay: 'rgba(0,0,0,0.7)',
    shadow: '0 2px 16px rgba(0,0,0,0.4)',
    badge: '#2d2d4e',
    badgeText: '#818cf8',
  },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const theme = darkMode ? themes.dark : themes.light;

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  };

  // Cambia el color de fondo del body también
  useEffect(() => {
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado
export const useTheme = () => useContext(ThemeContext);
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  if (!isAuthenticated) {
    return <AuthPage onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <Dashboard onLogout={() => setIsAuthenticated(false)} />
  );
}

export default App;

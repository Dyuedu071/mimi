import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('login'); // 'login' | 'register'

  const goToLogin = () => setActivePage('login');
  const goToRegister = () => setActivePage('register');

  return (
    <div className="App">
      {activePage === 'login' ? (
        <LoginPage onRegisterClick={goToRegister} />
      ) : (
        <RegisterPage onLoginClick={goToLogin} />
      )}
    </div>
  );
}

export default App;

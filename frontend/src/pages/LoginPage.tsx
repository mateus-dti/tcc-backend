import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/chat');
    }
  }, [state.isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/chat');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__header">
          <h1 className="auth-page__brand">TCC Chat</h1>
          <p className="auth-page__subtitle">
            Entre na sua conta para continuar
          </p>
        </div>

        <LoginForm onLoginSuccess={handleLoginSuccess} />

        <div className="auth-page__footer">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className="auth-page__link">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

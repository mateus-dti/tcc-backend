import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/chat');
    }
  }, [state.isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    navigate('/chat');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__header">
          <h1 className="auth-page__brand">TCC Chat</h1>
          <p className="auth-page__subtitle">
            Crie sua conta para começar
          </p>
        </div>

        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />

        <div className="auth-page__footer">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="auth-page__link">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

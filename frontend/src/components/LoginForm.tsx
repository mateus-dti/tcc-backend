import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { state, login, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch {
      // Erro já tratado no contexto
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (state.error) {
      clearError();
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form__container">
        <h2 className="auth-form__title">Entrar</h2>
        
        {state.error && (
          <div className="auth-form__error">
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form__form">
          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="auth-form__input"
              placeholder="seu@email.com"
              required
              disabled={state.isLoading}
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="auth-form__input"
              placeholder="Sua senha"
              required
              disabled={state.isLoading}
            />
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={state.isLoading || !formData.email || !formData.password}
          >
            {state.isLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {onSwitchToRegister && (
          <div className="auth-form__switch">
            <p>
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="auth-form__switch-btn"
                disabled={state.isLoading}
              >
                Criar conta
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

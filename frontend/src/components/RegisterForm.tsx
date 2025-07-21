import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { state, register, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (name: string, value: string, allData = formData) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Nome é obrigatório';
        } else if (value.trim().length < 2) {
          error = 'Nome deve ter pelo menos 2 caracteres';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email deve ter um formato válido';
        }
        break;
      
      case 'password':
        if (!value) {
          error = 'Senha é obrigatória';
        } else if (value.length < 6) {
          error = 'Senha deve ter pelo menos 6 caracteres';
        } else if (!/(?=.*[a-zA-Z])/.test(value)) {
          error = 'Senha deve conter pelo menos uma letra';
        }
        break;
      
      case 'confirmPassword':
        if (!value) {
          error = 'Confirmação de senha é obrigatória';
        } else if (value !== allData.password) {
          error = 'As senhas não coincidem';
        }
        break;
    }
    
    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };

    setFieldErrors(errors);

    // Verificar se há erros
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setLocalError('Por favor, corrija os erros acima');
      return;
    }

    // Limpar erros locais
    setLocalError('');
    setFieldErrors({ name: '', email: '', password: '', confirmPassword: '' });

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch {
      // Erro já tratado no contexto
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    // Validar campo em tempo real
    const fieldError = validateField(name, value, newFormData);
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    // Se estamos validando confirmPassword, também revalidar password
    if (name === 'password') {
      const confirmError = validateField('confirmPassword', newFormData.confirmPassword, newFormData);
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
    
    // Limpar erros globais quando o usuário começar a digitar
    if (state.error) {
      clearError();
    }
    if (localError) {
      setLocalError('');
    }
  };

  const isFormValid = () => {
    const hasAllFields = formData.name.trim() && 
                        formData.email.trim() && 
                        formData.password && 
                        formData.confirmPassword;
    
    const hasNoErrors = Object.values(fieldErrors).every(error => error === '');
    
    return hasAllFields && hasNoErrors;
  };

  const displayError = state.error || localError;

  return (
    <div className="auth-form">
      <div className="auth-form__container">
        <h2 className="auth-form__title">Criar conta</h2>
        
        {displayError && (
          <div className="auth-form__error">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form__form">
          <div className="auth-form__field">
            <label htmlFor="name" className="auth-form__label">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`auth-form__input ${fieldErrors.name ? 'auth-form__input--error' : ''}`}
              placeholder="Seu nome completo"
              required
              disabled={state.isLoading}
            />
            {fieldErrors.name && (
              <span className="auth-form__field-error">{fieldErrors.name}</span>
            )}
          </div>

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
              className={`auth-form__input ${fieldErrors.email ? 'auth-form__input--error' : ''}`}
              placeholder="seu@email.com"
              required
              disabled={state.isLoading}
            />
            {fieldErrors.email && (
              <span className="auth-form__field-error">{fieldErrors.email}</span>
            )}
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
              className={`auth-form__input ${fieldErrors.password ? 'auth-form__input--error' : ''}`}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={state.isLoading}
            />
            {fieldErrors.password && (
              <span className="auth-form__field-error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="confirmPassword" className="auth-form__label">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`auth-form__input ${fieldErrors.confirmPassword ? 'auth-form__input--error' : ''}`}
              placeholder="Confirme sua senha"
              required
              disabled={state.isLoading}
            />
            {fieldErrors.confirmPassword && (
              <span className="auth-form__field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={state.isLoading || !isFormValid()}
          >
            {state.isLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        {onSwitchToLogin && (
          <div className="auth-form__switch">
            <p>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="auth-form__switch-btn"
                disabled={state.isLoading}
              >
                Entrar
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;

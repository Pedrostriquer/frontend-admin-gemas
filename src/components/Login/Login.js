import React, { useState } from 'react';
import { useAuth } from "../../Context/AuthContext";
import styles from './LoginStyle';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError('Email ou senha inválidos. Tente novamente.');
      setIsLoggingIn(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.loginContainer}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div style={styles.loginBranding}>
        <div style={styles.brandingContent}>
          <i className="fa-solid fa-gem" style={styles.brandingIcon}></i>
          <h1 style={styles.brandingH1}>Gemas brilhantes</h1>
          <p style={styles.brandingP}>Plataforma de Administração de Contratos e E-commerce de Gemas.</p>
        </div>
      </div>
      <div style={styles.loginFormArea}>
        {isLoggingIn && (
          <div style={styles.loadingOverlay}>
            <i className="fa-solid fa-gem" style={styles.loadingIcon}></i>
            <p style={styles.loadingText}>Verificando credenciais...</p>
          </div>
        )}
        <form style={styles.loginForm} onSubmit={handleLogin}>
          <h2 style={styles.loginFormH2}>Bem-vindo de volta!</h2>
          <p style={styles.formSubtitle}>Faça login para acessar o painel.</p>

          {error && <p style={styles.errorMessage}>{error}</p>}
          
          <div style={styles.inputGroup}>
            <i className="fa-solid fa-envelope" style={{...styles.inputIcon, ...(focusedInput === 'email' && styles.inputIconFocus)}}></i>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{...styles.inputField, ...(focusedInput === 'email' && styles.inputFieldFocus)}}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <i className="fa-solid fa-lock" style={{...styles.inputIcon, ...(focusedInput === 'password' && styles.inputIconFocus)}}></i>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{...styles.inputField, ...(focusedInput === 'password' && styles.inputFieldFocus)}}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
            <i 
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              style={{...styles.passwordToggleIcon, ...(focusedInput === 'password' && styles.inputIconFocus)}}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '8px' }}
            />
            <label htmlFor="rememberMe" style={{ color: '#555', fontSize: '0.9rem' }}>Lembrar de mim</label>
          </div>
          
          <button type="submit" style={styles.loginButton} disabled={isLoggingIn}>
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
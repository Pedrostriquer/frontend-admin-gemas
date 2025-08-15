import React, { useState } from 'react';
import styles from './Login.styles.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Tentando login com:', { email, password });
    alert('Login efetuado (simulação)! Verifique o console.');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginButtonStyle = {
    ...styles.loginButton,
    ...(isButtonHovered && styles.loginButtonHover),
  };

  const passwordToggleStyle = {
    ...styles.passwordToggleIcon,
    ...(isToggleHovered && styles.passwordToggleIconHover),
    ...(focusedInput === 'password' && styles.inputIconFocus),
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBranding}>
        <div style={styles.brandingContent}>
          <i className="fa-solid fa-gem" style={styles.brandingIcon}></i>
          <h1 style={styles.brandingH1}>Gemas brilhantes</h1>
          <p style={styles.brandingP}>Plataforma de Administração de Contratos e E-commerce de Gemas.</p>
        </div>
      </div>
      <div style={styles.loginFormArea}>
        <form style={styles.loginForm} onSubmit={handleLogin}>
          <h2 style={styles.loginFormH2}>Bem-vindo de volta!</h2>
          <p style={styles.formSubtitle}>Faça login para acessar o painel.</p>
          
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
              style={passwordToggleStyle}
              onClick={togglePasswordVisibility}
              onMouseEnter={() => setIsToggleHovered(true)}
              onMouseLeave={() => setIsToggleHovered(false)}
            ></i>
          </div>
          
          <button 
            type="submit" 
            style={loginButtonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Entrar
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
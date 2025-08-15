import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui virá a lógica de autenticação
    console.log('Tentando login com:', { email, password });
    alert('Login efetuado (simulação)! Verifique o console.');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-branding">
        <div className="branding-content">
          <i className="fa-solid fa-gem branding-icon"></i>
          <h1>Gemas brilhantes</h1>
          <p>Plataforma de Administração de Contratos e E-commerce de Gemas.</p>
        </div>
      </div>
      <div className="login-form-area">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Bem-vindo de volta!</h2>
          <p className="form-subtitle">Faça login para acessar o painel.</p>
          
          <div className="input-group">
            <i className="fa-solid fa-envelope input-icon"></i>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <i className="fa-solid fa-lock input-icon"></i>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <i 
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          
          <button type="submit" className="login-button">Entrar</button>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
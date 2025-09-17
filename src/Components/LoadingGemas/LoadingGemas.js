// src/components/LoadingGemas.js
import React from "react";
import "./LoadingGemas.css";

const LoadingGemas = ({ isLoading, text = "Carregando..." }) => {
  if (!isLoading) {
    return null;
  }

  // Criamos um array para gerar várias partículas de brilho dinamicamente
  const particulas = Array.from({ length: 20 });

  return (
    <div className="loading-overlay" aria-live="assertive" role="alert">
      <div className="gem-container">
        {/* As partículas de brilho que orbitam a gema */}
        {particulas.map((_, index) => (
          <div
            key={index}
            className="particula"
            style={{
              // Estilos inline para randomizar a animação de cada partícula
              "--angle": `${(360 / particulas.length) * index}deg`,
              "--duration": `${Math.random() * 2 + 2}s`, // Duração entre 2s e 4s
              "--delay": `${Math.random() * -4}s`, // Delay negativo para começar em pontos diferentes
            }}
          />
        ))}

        {/* A gema central */}
        <div className="gem">
          <div className="gem-face gem-face-top"></div>
          <div className="gem-face gem-face-bottom"></div>
        </div>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default LoadingGemas;

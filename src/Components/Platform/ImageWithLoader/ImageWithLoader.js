import React, { useState, useEffect } from "react";

const keyframes = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const skeletonStyle = {
  width: "100%",
  height: "100%",
  background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
};

const ImageWithLoader = ({ src, alt, style, fallbackSrc }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let isMounted = true; // Flag para evitar updates em componente desmontado
    let timeoutId = null;

    const handleLoad = (source) => {
      if (isMounted) {
        clearTimeout(timeoutId);
        setImageSrc(source);
        setIsLoading(false);
      }
    };

    if (src) {
      const image = new Image();
      image.src = src;
      image.onload = () => handleLoad(src);
      image.onerror = () => handleLoad(fallbackSrc);

      timeoutId = setTimeout(() => handleLoad(fallbackSrc), 4000);
    } else {
      const image = new Image();
      image.src = process.env.REACT_APP_DEFAULT_PROFILE_PICTURE;
      image.onload = () => handleLoad(src);
      image.onerror = () => handleLoad(fallbackSrc);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [src, fallbackSrc]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        ...style,
        overflow: "hidden",
        boxShadow: "3px 3px 2px rgba(0,0,0,0.2)",
      }}
    >
      <style>{keyframes}</style>

      {isLoading ? (
        <div style={skeletonStyle} />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          style={{
            width: "100%", // Ocupa 100% da largura do container (a div acima)
            height: "100%", // Ocupa 100% da altura do container
            objectFit: "cover", // A MÁGICA: preenche o espaço sem distorcer. Diva! ✨
          }}
        />
      )}
    </div>
  );
};

export default ImageWithLoader;

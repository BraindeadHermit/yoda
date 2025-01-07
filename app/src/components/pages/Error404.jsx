import React from 'react';

const Error404 = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(to bottom, #178563, white)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '4rem', color: 'white', marginBottom: '1rem' }}>Errore: 404!</h1>
      <h2 style={{ fontSize: '2rem', color: '#178563', marginBottom: '1rem' }}>Pagina non trovata</h2>
      <p style={{ fontSize: '1.2rem', color: '#178563', marginBottom: '2rem' }}>
        La pagina che stai cercando potrebbe essere stata rimossa o non esiste.
      </p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#178563',
          color: 'white',
          borderRadius: '50px', // Bottone tondeggiante
          textDecoration: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Leggera ombra per un effetto 3D
        }}
      >
        Torna alla Home
      </a>
    </div>
  );
};

export default Error404;
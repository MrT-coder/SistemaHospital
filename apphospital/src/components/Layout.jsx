import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        padding: '2rem',
        backgroundColor: '#fafafa'
      }}>
        {children}
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid #ddd',
        backgroundColor: '#f5f5f5'
      }}>
        &copy; 2025 Mi Sistema Hospitalario
      </footer>
    </div>
  );
}

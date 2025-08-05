import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">AI Tutor</Link>
      <nav className="navbar-menu">
        {!user ? (
          <>
            <Link to="/login" className="navbar-link">Entrar</Link>
            <Link to="/signup" className="navbar-link">Criar Conta</Link>
          </>
        ) : (
          <>
            <Link to="/" className="navbar-link">Home</Link>
            <button onClick={handleLogout} className="navbar-link">Sair</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

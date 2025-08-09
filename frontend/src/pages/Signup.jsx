import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

import './Page.css';
import './Signup.css';
import Navbar from '../components/Navbar';
import { signup } from '../utils/api';
import { auth } from '../firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('parent');
  const [inviteCode, setInviteCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      // Use API utility for signup (calls the deployed Firebase Function endpoint)
      await signup({ email, password, role, inviteCode });
      // Sign in the user in the frontend so App.jsx user state is set
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="card">
        <h2>Criar Conta</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <p className="error-text">{error}</p>}
          <label htmlFor="role">Eu sou:</label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="signup-role-select"
          >
            <option value="parent">Responsável</option>
            <option value="child">Criança</option>
          </select>
          {role === 'child' && (
            <>
              <label htmlFor="inviteCode">Código de convite do responsável</label>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                placeholder="Digite o código fornecido pelo responsável"
                className="signup-invite-input"
              />
            </>
          )}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-email-input"
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-password-input"
          />
          <button type="submit" className="btn btn-primary signup-submit-btn" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
        <p className="alt-link">
          Já possui conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

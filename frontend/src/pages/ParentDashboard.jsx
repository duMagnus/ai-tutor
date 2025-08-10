import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import { getUserInfo } from '../utils/api';

function ParentDashboard() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInviteCode = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userInfo = await getUserInfo(user.uid);
          setInviteCode(userInfo.inviteCode || '');
        } catch (err) {
          setInviteCode('');
        }
      }
      setLoading(false);
    };
    fetchInviteCode();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="card">
        <h2>Painel do Responsável</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <p><strong>Código de convite para crianças:</strong></p>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{inviteCode}</div>
            <p>Compartilhe este código com seu filho para que ele possa se cadastrar.</p>
          </>
        )}
        {/* Future: List children, show metrics, etc. */}
      </div>
    </div>
  );
}

export default ParentDashboard;

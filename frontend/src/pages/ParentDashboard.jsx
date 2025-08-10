import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import { getUserInfo, getParentChildren } from '../utils/api';

function ParentDashboard() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userInfo = await getUserInfo(user.uid);
          setInviteCode(userInfo.inviteCode || '');
          const childrenList = await getParentChildren(user.uid);
          setChildren(childrenList);
        } catch (err) {
          setInviteCode('');
          setChildren([]);
        }
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="parent-dashboard-fullscreen">
      <Navbar />
      <div className="card parent-dashboard-card">
        <h2>Painel do Responsável</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <p><strong>Código de convite para crianças:</strong></p>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{inviteCode}</div>
            <p>Compartilhe este código com seu filho para que ele possa se cadastrar.</p>
            <hr style={{ margin: '2rem 0' }} />
            <h3>Contas de Crianças Vinculadas</h3>
            {children.length === 0 ? (
              <p>Nenhuma criança vinculada ainda.</p>
            ) : (
              <div className="children-list">
                {children.map(child => (
                  <div key={child.uid} className="child-card" style={{ background: '#F3F4F6', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{child.name || child.email}</div>
                    <div style={{ marginBottom: '0.5rem' }}>Progresso: <span style={{ fontWeight: 'bold', color: '#3B82F6' }}>{child.progress}%</span></div>
                    <div style={{ marginBottom: '0.5rem' }}>Tempo de estudo: <span style={{ fontWeight: 'bold', color: '#FBBF24' }}>{child.timeSpent} min</span></div>
                    <div style={{ background: '#3B82F6', height: '8px', borderRadius: '8px', width: '100%', marginTop: '0.5rem' }}>
                      <div style={{ background: '#FBBF24', height: '8px', borderRadius: '8px', width: `${child.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Future: Add charts, child management, etc. */}
      </div>
    </div>
  );
}

export default ParentDashboard;

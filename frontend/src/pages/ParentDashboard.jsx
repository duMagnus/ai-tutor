import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import { getUserInfo, getParentChildren, generateCurriculum, approveCurriculum, requestCurriculumChanges, cancelCurriculum } from '../utils/api';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Dashboard.css';

function ParentDashboard() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [subject, setSubject] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [curriculum, setCurriculum] = useState(null);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [curriculumError, setCurriculumError] = useState('');
  const [curriculumId, setCurriculumId] = useState('');
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [changesRequested, setChangesRequested] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeRequestText, setChangeRequestText] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [editingCurriculum, setEditingCurriculum] = useState(false);
  const [editedCurriculum, setEditedCurriculum] = useState('');
  const [cancelled, setCancelled] = useState(false);

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

  const handleGenerateCurriculum = async (e) => {
    e.preventDefault();
    setCurriculumLoading(true);
    setCurriculumError('');
    setCurriculum(null);
    setApproved(false);
    setCurriculumId('');
    try {
      const user = auth.currentUser;
      const res = await generateCurriculum({
        parentId: user.uid,
        childId: selectedChild,
        subject,
        ageRange,
      });
      setCurriculum(res.curriculum);
      setCurriculumId(res.curriculumId);
    } catch (err) {
      setCurriculumError('Erro ao gerar currículo. Tente novamente.');
    }
    setCurriculumLoading(false);
  };

  const handleApproveCurriculum = async () => {
    setCurriculumLoading(true);
    try {
      const user = auth.currentUser;
      await approveCurriculum({
        curriculumId,
        parentId: user.uid,
        childId: selectedChild,
      });
      setApproved(true);
    } catch (err) {
      setCurriculumError('Erro ao aprovar o currículo. Tente novamente.');
    }
    setCurriculumLoading(false);
  };

  const handleRequestChanges = async () => {
    setCurriculumLoading(true);
    try {
      const user = auth.currentUser;
      const res = await requestCurriculumChanges({
        curriculumId,
        parentId: user.uid,
        changeRequest: changeRequestText,
      });
      setCurriculum(res.curriculum); // Show revised curriculum
      setShowChangeModal(false);
      setChangesRequested(true);
      setChangeRequestText('');
    } catch (err) {
      setCurriculumError('Erro ao solicitar alterações. Tente novamente.');
    }
    setCurriculumLoading(false);
  };

  const handleCancelCurriculum = async () => {
    setCurriculumLoading(true);
    try {
      const user = auth.currentUser;
      await cancelCurriculum({
        curriculumId,
        parentId: user.uid,
      });
      setCurriculum(null);
      setCurriculumId('');
      setCancelled(true);
    } catch (err) {
      setCurriculumError('Erro ao cancelar o currículo. Tente novamente.');
    }
    setCurriculumLoading(false);
  };

  return (
    <div className="parent-dashboard-fullscreen" style={{ background: '#F3F4F6', minHeight: '100vh', padding: '0', margin: '0', width: '100vw', overflowX: 'hidden', position: 'relative' }}>
      <Navbar />
      <div className="parent-dashboard-content" style={{ width: '100%', minHeight: '100vh', margin: '0', padding: '2.5rem 2.5rem', background: '#fff', borderRadius: '0', boxShadow: 'none', border: 'none', boxSizing: 'border-box', overflow: 'hidden', maxWidth: '100%', position: 'relative' }}>
        <h2 style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Painel do Responsável</h2>
        {loading ? (
          <div className="dashboard-loading" style={{ textAlign: 'center', color: '#4B5563', fontSize: '1.2rem', margin: '2rem 0' }}>Carregando...</div>
        ) : (
          <>
            <div className="invite-section" style={{ marginBottom: '2.5rem', background: '#F3F4F6', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
              <p style={{ color: '#1F2937', fontWeight: 'bold', marginBottom: '0.5rem' }}>Código de convite para crianças:</p>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem', letterSpacing: '2px' }}>{inviteCode}</div>
              <p style={{ color: '#4B5563', marginBottom: '0' }}>Compartilhe este código com seu filho para que ele possa se cadastrar.</p>
            </div>
            <h3 style={{ color: '#1F2937', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem' }}>Contas de Crianças Vinculadas</h3>
            {children.length === 0 ? (
              <div style={{ color: '#4B5563', fontSize: '1.1rem', marginBottom: '2rem' }}>Nenhuma criança vinculada ainda.</div>
            ) : (
              <div className="children-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {children.map(child => (
                  <div key={child.uid} className="child-card" style={{ background: '#F3F4F6', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#3B82F6' }}>{child.name || child.email}</div>
                    <div style={{ color: '#4B5563' }}>Progresso: <span style={{ fontWeight: 'bold', color: '#3B82F6' }}>{child.progress}%</span></div>
                    <div style={{ color: '#4B5563' }}>Tempo de estudo: <span style={{ fontWeight: 'bold', color: '#FBBF24' }}>{child.timeSpent} min</span></div>
                    <div style={{ background: '#E5E7EB', height: '8px', borderRadius: '8px', width: '100%', marginTop: '0.5rem' }}>
                      <div style={{ background: '#3B82F6', height: '8px', borderRadius: '8px', width: `${child.progress}%`, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #E5E7EB' }} />
            <h3 style={{ color: '#1F2937', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem' }}>Gerar Currículo AI para uma Criança</h3>
            <form onSubmit={handleGenerateCurriculum} style={{ marginBottom: '2rem', background: '#F3F4F6', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <label style={{ color: '#1F2937', fontWeight: 'bold' }}>
                  Selecione a criança:
                  <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} required style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '1rem', background: '#fff' }}>
                    <option value="">--</option>
                    {children.map(child => (
                      <option key={child.uid} value={child.uid}>{child.name || child.email}</option>
                    ))}
                  </select>
                </label>
                <label style={{ color: '#1F2937', fontWeight: 'bold' }}>
                  Tema/Matéria:
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '1rem', background: '#fff', width: '60%' }} />
                </label>
                <label style={{ color: '#1F2937', fontWeight: 'bold' }}>
                  Faixa etária:
                  <input type="text" value={ageRange} onChange={e => setAgeRange(e.target.value)} required style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '1rem', background: '#fff', width: '40%' }} placeholder="Ex: 8-10 anos" />
                </label>
                <button type="submit" disabled={curriculumLoading} style={{ background: '#3B82F6', color: 'white', padding: '0.7rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1rem', boxShadow: curriculumLoading ? 'none' : '0 2px 8px rgba(59,130,246,0.07)' }}>
                  {curriculumLoading ? 'Gerando...' : 'Gerar Currículo'}
                </button>
              </div>
            </form>
            {curriculumError && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{curriculumError}</div>}
            {curriculum && !cancelled && (
              <div className="curriculum-review" style={{ background: '#F3F4F6', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <h4 style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>Currículo Gerado</h4>
                <div className="curriculum-markdown" style={{ background: '#fff', borderRadius: '8px', padding: '1rem', border: '1px solid #E5E7EB', marginBottom: '1rem', color: '#1F2937', fontFamily: 'inherit', fontSize: '1rem' }}>
                  <ReactMarkdown>{curriculum}</ReactMarkdown>
                </div>
                {!approved && (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleApproveCurriculum} style={{ background: '#FBBF24', color: '#1F2937', padding: '0.7rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem', boxShadow: '0 2px 8px rgba(251,191,36,0.07)' }}>
                      Aprovar e atribuir à criança
                    </button>
                    <button onClick={() => setShowChangeModal(true)} style={{ background: '#3B82F6', color: 'white', padding: '0.7rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem', boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
                      Solicitar alterações
                    </button>
                    <button onClick={handleCancelCurriculum} style={{ background: '#EF4444', color: 'white', padding: '0.7rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem', boxShadow: '0 2px 8px rgba(239,68,68,0.07)' }}>
                      Cancelar currículo
                    </button>
                  </div>
                )}
                {showChangeModal && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', minWidth: '320px', maxWidth: '90vw' }}>
                      <h4 style={{ color: '#3B82F6', fontWeight: 'bold', marginBottom: '1rem' }}>Solicitar alterações no currículo</h4>
                      <textarea value={changeRequestText} onChange={e => setChangeRequestText(e.target.value)} rows={4} style={{ width: '100%', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }} placeholder="Descreva as mudanças desejadas..." />
                      {curriculumLoading ? (
                        <div style={{ textAlign: 'center', color: '#3B82F6', fontWeight: 'bold', marginBottom: '1rem' }}>
                          <span className="loading-spinner" style={{ display: 'inline-block', width: '32px', height: '32px', border: '4px solid #3B82F6', borderTop: '4px solid #FBBF24', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '0.5rem', verticalAlign: 'middle' }}></span>
                          Gerando nova versão do currículo...
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                          <button onClick={handleRequestChanges} style={{ background: '#3B82F6', color: 'white', padding: '0.7rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Enviar solicitação</button>
                          <button onClick={() => setShowChangeModal(false)} style={{ background: '#E5E7EB', color: '#1F2937', padding: '0.7rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Cancelar</button>
                        </div>
                      )}
                    </div>
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                )}
                {approved && <div style={{ color: '#3B82F6', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.1rem' }}>Currículo aprovado e atribuído!</div>}
                {changesRequested && <div style={{ color: '#3B82F6', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.1rem' }}>Nova versão enviada para revisão.</div>}
              </div>
            )}
            {cancelled && <div style={{ color: '#EF4444', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.1rem' }}>Currículo cancelado.</div>}
          </>
        )}
        {/* Future: Add charts, child management, etc. */}
      </div>
    </div>
  );
}

export default ParentDashboard;

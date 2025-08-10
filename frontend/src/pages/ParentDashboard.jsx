import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import { getUserInfo, getParentChildren, generateCurriculum, approveCurriculum, requestCurriculumChanges, cancelCurriculum } from '../utils/api';
import './ParentDashboard.css';

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
  const [changesRequested, setChangesRequested] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeRequestText, setChangeRequestText] = useState('');
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
      console.log('Curriculum generation response:', res); // Log backend response
      setCurriculum(res); // Use the full response object
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
      // Hide curriculum after approval and reset fields
      setCurriculum(null);
      setCurriculumId('');
      setSubject('');
      setAgeRange('');
      setSelectedChild('');
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
    <div className="parent-dashboard-fullscreen">
      <Navbar />
      <div className="parent-dashboard-content">
        <h2 className="dashboard-title">Painel do Responsável</h2>
        {loading ? (
          <div className="dashboard-loading">Carregando...</div>
        ) : (
          <>
            <div className="invite-section">
              <p className="invite-label">Código de convite para crianças:</p>
              <div className="invite-code">{inviteCode}</div>
              <p className="invite-desc">Compartilhe este código com seu filho para que ele possa se cadastrar.</p>
            </div>
            <h3 className="dashboard-section-title">Contas de Crianças Vinculadas</h3>
            {children.length === 0 ? (
              <div className="children-empty">Nenhuma criança vinculada ainda.</div>
            ) : (
              <div className="children-list">
                {children.map(child => (
                  <div key={child.uid} className="child-card">
                    <div className="child-name">{child.name || child.email}</div>
                    <div className="child-progress-label">Progresso: <span className="child-progress-value">{child.progress}%</span></div>
                    <div className="child-time-label">Tempo de estudo: <span className="child-time-value">{child.timeSpent} min</span></div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${child.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <hr className="dashboard-divider" />
            <h3 className="dashboard-section-title">Gerar Currículo AI para uma Criança</h3>
            <form onSubmit={handleGenerateCurriculum} className="curriculum-generate-form">
              <div className="form-group">
                <label className="form-label">
                  Selecione a criança:
                  <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} required className="form-select">
                    <option value="">--</option>
                    {children.map(child => (
                      <option key={child.uid} value={child.uid}>{child.name || child.email}</option>
                    ))}
                  </select>
                </label>
                <label className="form-label">
                  Tema/Matéria:
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="form-input" />
                </label>
                <label className="form-label">
                  Faixa etária:
                  <input type="text" value={ageRange} onChange={e => setAgeRange(e.target.value)} required className="form-input" placeholder="Ex: 8-10 anos" />
                </label>
                <button type="submit" disabled={curriculumLoading} className="curriculum-generate-button">
                  {curriculumLoading ? 'Gerando...' : 'Gerar Currículo'}
                </button>
              </div>
            </form>
            {curriculumError && <div className="error-message">{curriculumError}</div>}
            {curriculum && !cancelled && !approved && (
              <div className="curriculum-review">
                <h4 className="curriculum-title">Currículo Gerado</h4>
                <div className="curriculum-fields">
                  <div><strong>Título:</strong> {curriculum.title}</div>
                  <div><strong>Visão geral:</strong> {curriculum.overview}</div>
                  <div><strong>Objetivos:</strong>
                    <ul>{curriculum.objectives && curriculum.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}</ul>
                  </div>
                  <div><strong>Conceitos-chave:</strong>
                    <ul>{curriculum.keyConcepts && curriculum.keyConcepts.map((concept, idx) => <li key={idx}>{concept}</li>)}</ul>
                  </div>
                  <div><strong>Lições:</strong>
                    <ul>
                      {curriculum.lessons && curriculum.lessons.map((lesson, idx) => (
                        <li key={idx}>
                          <strong>{lesson.title}</strong><br />
                          <span>{lesson.description}</span><br />
                          <span><strong>Metas:</strong> {lesson.goals && lesson.goals.join(', ')}</span><br />
                          <span><strong>Atividades:</strong> {lesson.activities && lesson.activities.join(', ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div><strong>Avaliação:</strong> {curriculum.assessment}</div>
                  <div><strong>Recursos adicionais:</strong> {curriculum.resources}</div>
                </div>
                {!approved && (
                  <div className="curriculum-action-buttons">
                    <button onClick={handleApproveCurriculum} className="approve-button">
                      Aprovar e atribuir à criança
                    </button>
                    <button onClick={() => setShowChangeModal(true)} className="request-changes-button">
                      Solicitar alterações
                    </button>
                    <button onClick={handleCancelCurriculum} className="cancel-button">
                      Cancelar currículo
                    </button>
                  </div>
                )}
                {showChangeModal && (
                  <div className="change-request-modal">
                    <div className="change-request-content">
                      <h4 className="change-request-title">Solicitar alterações no currículo</h4>
                      <textarea value={changeRequestText} onChange={e => setChangeRequestText(e.target.value)} rows={4} className="change-request-textarea" placeholder="Descreva as mudanças desejadas..." />
                      {curriculumLoading ? (
                        <div className="loading-message">
                          <span className="loading-spinner"></span>
                          Gerando nova versão do currículo...
                        </div>
                      ) : (
                        <div className="change-request-buttons">
                          <button onClick={handleRequestChanges} className="send-request-button">Enviar solicitação</button>
                          <button onClick={() => setShowChangeModal(false)} className="cancel-request-button">Cancelar</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {approved && <div className="approval-message">Currículo aprovado e atribuído!</div>}
                {changesRequested && <div className="changes-requested-message">Nova versão enviada para revisão.</div>}
              </div>
            )}
            {cancelled && <div className="cancellation-message">Currículo cancelado.</div>}
          </>
        )}
        {/* Future: Add charts, child management, etc. */}
      </div>
    </div>
  );
}

export default ParentDashboard;

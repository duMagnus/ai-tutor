import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import { getApprovedCurricula } from '../utils/api';
import './Dashboard.css';

function Dashboard() {
  const scrollRefs = useRef({});
  const [scrollStates, setScrollStates] = useState({});
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateScrollButtons = (subject) => {
    const ref = scrollRefs.current[subject];
    if (ref) {
      const { scrollLeft, scrollWidth, clientWidth } = ref;
      setScrollStates((prev) => ({
        ...prev,
        [subject]: {
          canScrollLeft: scrollLeft > 0,
          canScrollRight: scrollLeft + clientWidth < scrollWidth,
        },
      }));
    }
  };

  const scrollLeft = (subject) => {
    const ref = scrollRefs.current[subject];
    if (ref) {
      const { clientWidth } = ref;
      ref.scrollBy({ left: -clientWidth / 2, behavior: 'smooth' });
      setTimeout(() => updateScrollButtons(subject), 300);
    }
  };

  const scrollRight = (subject) => {
    const ref = scrollRefs.current[subject];
    if (ref) {
      const { clientWidth } = ref;
      ref.scrollBy({ left: clientWidth / 2, behavior: 'smooth' });
      setTimeout(() => updateScrollButtons(subject), 300);
    }
  };

  useEffect(() => {
    const fetchCurricula = async () => {
      setLoading(true);
      setError('');
      try {
        const user = auth.currentUser;
        if (user) {
          const data = await getApprovedCurricula(user.uid);
          setCurricula(data.curricula);
        } else {
          setError('Usuário não autenticado.');
        }
      } catch (err) {
        setError('Erro ao buscar currículos.');
      }
      setLoading(false);
    };
    fetchCurricula();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Bem-vindo ao AI Tutor</h1>
        {loading ? (
          <div className="dashboard-loading">Carregando currículos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="topics-section">
            <h2>Currículos Aprovados</h2>
            {curricula.length === 0 ? (
              <div className="children-empty">Nenhum currículo aprovado disponível.</div>
            ) : (
              <div className="subject">
                <div className="subject-cards">
                  {curricula.map((curriculum) => (
                    <Link to={`/subject/${curriculum.subject}`} className="subject-card" key={curriculum.id}>
                      <h3>{curriculum.title || curriculum.subject}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
  const scrollRefs = useRef({});
  const [scrollStates, setScrollStates] = useState({});

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

  const subjects = [
    { name: 'Matemática', cards: ['Adição', 'Subtração', 'Divisão', 'Expoentes', 'Frações', 'Geometria', 'Trigonometria', 'Álgebra', 'Cálculo', 'Estatística', 'Probabilidade', 'Números Complexos', 'Equações Diferenciais', 'Um título muito longo para testar o comportamento do texto'] },
    { name: 'Ciências', cards: ['Fotossíntese', 'Estados da Matéria', 'Leis de Newton', 'Sistema Solar', 'Ciclo da Água', 'Evolução', 'Genética', 'Energia', 'Química Orgânica', 'Um título muito longo para testar o comportamento do texto'] },
    { name: 'História', cards: ['Civilizações Antigas', 'Guerras Mundiais', 'Revolução Industrial', 'Idade Média', 'Renascimento', 'Revolução Francesa', 'História do Brasil', 'Guerra Fria', 'Globalização', 'Um título muito longo para testar o comportamento do texto'] },
    { name: 'Idiomas', cards: ['Gramática', 'Vocabulário', 'Compreensão de Leitura', 'Redação', 'Interpretação de Textos', 'Expressões Idiomáticas', 'Pronúncia', 'Tradução', 'Conversação', 'Um título muito longo para testar o comportamento do texto'] },
  ];

  useEffect(() => {
    subjects.forEach((subject) => updateScrollButtons(subject.name));
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Bem-vindo ao AI Tutor</h1>
        <div className="search-section">
          <input
            type="text"
            placeholder="Digite o que você quer estudar..."
            className="search-input"
          />
          <button className="search-button">Pesquisar</button>
        </div>
        <div className="topics-section">
          <h2>Assuntos Preparados</h2>
          {subjects.map((subject) => (
            <div className="subject" key={subject.name}>
              <h3>{subject.name}</h3>
              <div className="scroll-buttons">
                <button
                  onClick={() => scrollLeft(subject.name)}
                  className={`scroll-button left ${!scrollStates[subject.name]?.canScrollLeft ? 'hidden' : ''}`}
                >
                  ◀
                </button>
                <button
                  onClick={() => scrollRight(subject.name)}
                  className={`scroll-button right ${!scrollStates[subject.name]?.canScrollRight ? 'hidden' : ''}`}
                >
                  ▶
                </button>
              </div>
              <div
                className="subject-cards"
                ref={(el) => (scrollRefs.current[subject.name] = el)}
                onScroll={() => updateScrollButtons(subject.name)}
              >
                {subject.cards.map((card) => (
                  <Link to={`/subject/${card}`} className="subject-card" key={card}>{card}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

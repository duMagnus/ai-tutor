import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>AI Tutor</h1>
        <nav>
          <Link to="/login" className="btn">
            Entrar
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Criar Conta
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <h2>A plataforma de aprendizagem inteligente para seu filho</h2>
        <p>
          Transforme o estudo em uma experiência interativa e eficaz com
          inteligência artificial.
        </p>

        <section className="features">
          <h3>Por que escolher o AI Tutor?</h3>
          <ul>
            <li>Aulas personalizadas de acordo com o ritmo do seu filho</li>
            <li>Economia em comparação a aulas particulares tradicionais</li>
            <li>Tutor IA interativo que ensina e guia nos exercícios</li>
            <li>Acompanhamento de progresso em tempo real pelos pais</li>
            <li>Disponível 24/7 sem necessidade de agendamento</li>
          </ul>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} AI Tutor. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
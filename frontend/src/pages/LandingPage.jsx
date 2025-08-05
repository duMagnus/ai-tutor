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
        {/* Hero Section */}
        <div className="hero-section">
          <h2>A plataforma de aprendizagem inteligente para seu filho</h2>
          <p>
            Transforme o estudo em uma experiência interativa e eficaz com
            inteligência artificial.
          </p>
          {/* Image placeholder: ilustração de uma criança estudando com um tutor de IA */}
          <div className="image-placeholder hero-image" />
        </div>

        {/* Features Section */}
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

        {/* How It Works Section */}
        <section className="how-it-works">
          <h3>Como funciona</h3>
          <p>
            Escolha o tema de estudo, receba um plano de aulas elaborado por IA
            e acompanhe cada etapa do aprendizado em tempo real.
          </p>
          {/* Image placeholder: diagrama de fluxo mostrando planejamento > estudo > progresso */}
          <div className="image-placeholder process-image" />
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <h3>O que dizem os pais</h3>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              {/* Imagem de perfil: avatar do pai/mãe */}
              <div className="image-placeholder avatar" />
              <p>
                “O AI Tutor revolucionou o estudo da minha filha. O progresso é
                visível a cada semana!”
              </p>
              <span>- João Silva</span>
            </div>
            <div className="testimonial-card">
              <div className="image-placeholder avatar" />
              <p>
                “Agora meu filho estuda com autonomia e eu tenho total controle
                do progresso.”
              </p>
              <span>- Maria Fernandes</span>
            </div>
            <div className="testimonial-card">
              <div className="image-placeholder avatar" />
              <p>
                “A flexibilidade de estudar a qualquer hora e o feedback em
                tempo real são incríveis.”
              </p>
              <span>- Carlos Pereira</span>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h3>Pronto para melhorar o desempenho do seu filho?</h3>
          <Link to="/signup" className="btn btn-primary">
            Criar Conta
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} AI Tutor. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
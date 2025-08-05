import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import './Page.css';
import Navbar from '../components/Navbar';

function SubjectPage() {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'LLM', text: `Bem-vindo à página de ${subjectName}! Como posso ajudá-lo hoje?` },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'Student', text: input }]);
      setInput('');

      // Simulate LLM response (to be replaced with API call)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'LLM', text: `Você perguntou sobre: ${input}. Vamos mergulhar nisso!` },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', overflow: 'hidden', padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <FaArrowLeft size={24} color="#3b82f6" />
          </button>
          <h1 style={{ fontSize: '2.5rem', color: '#1f2937', margin: 0 }}>{subjectName}</h1>
        </div>
        <div className="chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#f9f9f9' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'Student' ? 'student' : 'llm'}`}
                style={{ marginBottom: '1rem', textAlign: msg.sender === 'Student' ? 'right' : 'left' }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input" style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '1rem', backgroundColor: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', marginRight: '1rem' }}
            />
            <button onClick={handleSend} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectPage;

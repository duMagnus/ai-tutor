import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import './Page.css';
import Navbar from '../components/Navbar';
import { sendMessageToLLM, streamMessageToLLM } from '../utils/api';

function SubjectPage() {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'LLM', text: `Bem-vindo à página de ${subjectName}! Como posso ajudá-lo hoje?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { sender: 'Student', text: input }]);
      setLoading(true);
      const userInput = input;
      setInput('');
      let llmMessageIndex = null;
      // Add a loading message from LLM
      setMessages((prev) => [...prev, { sender: 'LLM', loading: true, text: '' }]);
      streamMessageToLLM(
        userInput,
        (fullText) => {
          console.log('LLM streamed text:', JSON.stringify(fullText));
          setMessages((prev) => {
            // Find the last LLM message (with or without loading)
            const idx = prev.map((msg, i) => ({msg, i})).reverse().find(({msg}) => msg.sender === 'LLM')?.i;
            if (idx !== undefined) {
              // Update the last LLM message with the streamed text
              const updated = [...prev];
              updated[idx] = { sender: 'LLM', text: fullText };
              return updated;
            }
            // Fallback: append if not found
            return [...prev, { sender: 'LLM', text: fullText }];
          });
        },
        () => {
          setLoading(false);
        },
        (error) => {
          setMessages((prev) => [
            ...prev,
            { sender: 'LLM', text: 'Ocorreu um erro ao tentar responder. Tente novamente.' },
          ]);
          setLoading(false);
        }
      );
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
          <div className="chat-messages" ref={chatMessagesRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#f9f9f9' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'Student' ? 'student' : 'llm'}`}
                style={{
                  marginBottom: '1rem',
                  textAlign: msg.sender === 'Student' ? 'right' : 'left',
                  display: 'flex',
                  justifyContent: msg.sender === 'Student' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.loading ? (
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '18px',
                      backgroundColor: '#e5e7eb',
                      color: '#1f2937',
                      maxWidth: '70%',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 50 50" style={{ verticalAlign: 'middle', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>
                      <circle cx="25" cy="25" r="20" stroke="#3b82f6" strokeWidth="5" fill="none" strokeDasharray="90" strokeDashoffset="60" />
                    </svg>
                  </span>
                ) : (
                  <span className={msg.sender === 'Student' ? 'chat-bubble student-bubble' : 'chat-bubble llm-bubble'}>
                    <div className="chat-bubble-content">
                      {msg.sender === 'LLM' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkBreaks]}
                          components={{
                            p: ({node, ...props}) => <p className="chat-bubble-paragraph" {...props} />,
                            br: () => <br />,
                            ul: ({node, ...props}) => <ul className="chat-bubble-list" {...props} />,
                            ol: ({node, ...props}) => <ol className="chat-bubble-list" {...props} />,
                            li: ({node, ...props}) => <li className="chat-bubble-list-item" {...props} />,
                          }}
                        >{msg.text}</ReactMarkdown>
                      ) : (
                        msg.text.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))
                      )}
                    </div>
                  </span>
                )}
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
              disabled={loading}
            />
            <button onClick={handleSend} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="25" cy="25" r="20" stroke="#fff" strokeWidth="5" fill="none" strokeDasharray="90" strokeDashoffset="60" />
                  </svg>
                </span>
              ) : (
                <FaPaperPlane size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Move keyframes to CSS file instead of inline style */}
    </div>
  );
}

export default SubjectPage;

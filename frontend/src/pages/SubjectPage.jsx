import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import './Page.css';
import Navbar from '../components/Navbar';
import { sendMessageToLLM, streamMessageToLLM, getApprovedCurricula, startOrFetchSession, updateSessionProgress } from '../utils/api';
import { auth } from '../firebase';

function SubjectPage() {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'LLM', text: `Bem-vindo à página de ${subjectName}! Como posso ajudá-lo hoje?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [curriculum, setCurriculum] = useState(null);
  const chatMessagesRef = useRef(null);

  // Fetch curriculum and start/fetch session on mount
  useEffect(() => {
    const fetchCurriculumAndSession = async () => {
      try {
        const user = auth.currentUser;
        // Fetch approved curricula for child using API utility
        const curriculaRes = await getApprovedCurricula(user.uid);
        // Find curriculum for this subject
        const found = curriculaRes.curricula.find(c => c.subject === subjectName);
        if (!found) return;
        setCurriculum(found);
        // Start or fetch session using API utility
        const sessionRes = await startOrFetchSession({
          childId: user.uid,
          curriculumId: found.curriculumId || found.id,
          subjectName: found.subject,
        });
        setSession(sessionRes);
        setLessonIdx(sessionRes.currentLesson || 0);
        // Restore chat history if present
        if (sessionRes.chatHistory && sessionRes.chatHistory.length > 0) {
          setMessages(sessionRes.chatHistory);
        }
      } catch (err) {
        // Could show error UI here
      }
    };
    fetchCurriculumAndSession();
  }, [subjectName]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    if (session && messages.length > 0) {
      updateSessionProgress({
        sessionId: session.sessionId,
        currentLesson: lessonIdx,
        chatHistory: messages,
      }).catch(() => {});
    }
  }, [messages, lessonIdx, session]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { sender: 'Student', text: input }]);
      setLoading(true);
      const userInput = input;
      setInput('');
      setMessages((prev) => [...prev, { sender: 'LLM', loading: true, text: '' }]);
      streamMessageToLLM(
        userInput,
        (fullText) => {
          setMessages((prev) => {
            const idx = prev.map((msg, i) => ({msg, i})).reverse().find(({msg}) => msg.sender === 'LLM')?.i;
            if (idx !== undefined) {
              const updated = [...prev];
              updated[idx] = { sender: 'LLM', text: fullText };
              return updated;
            }
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

  // Lesson navigation
  const handleNextLesson = () => {
    if (curriculum && lessonIdx < curriculum.lessons.length - 1) {
      setLessonIdx(lessonIdx + 1);
    }
  };
  const handlePrevLesson = () => {
    if (lessonIdx > 0) {
      setLessonIdx(lessonIdx - 1);
    }
  };

  return (
    <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '2rem', overflow: 'hidden', padding: '3rem' }}>
        {/* Lessons/Info on the left */}
        <div style={{ flex: '0 0 400px', minWidth: '320px', maxWidth: '480px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ padding: '0.5rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <FaArrowLeft size={24} color="#3b82f6" />
            </button>
            <h1 style={{ fontSize: '2.5rem', color: '#1f2937', margin: 0 }}>{subjectName}</h1>
          </div>
          {curriculum && (
            <div className="lesson-info" style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#3b82f6' }}>Lição {lessonIdx + 1}: {curriculum.lessons[lessonIdx]?.title}</h2>
              <p style={{ color: '#4b5563' }}>{curriculum.lessons[lessonIdx]?.description}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button onClick={handlePrevLesson} disabled={lessonIdx === 0} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#e5e7eb', color: '#1f2937', cursor: lessonIdx === 0 ? 'not-allowed' : 'pointer' }}>Anterior</button>
                <button onClick={handleNextLesson} disabled={lessonIdx === curriculum.lessons.length - 1} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#e5e7eb', color: '#1f2937', cursor: lessonIdx === curriculum.lessons.length - 1 ? 'not-allowed' : 'pointer' }}>Próxima</button>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <strong>Metas:</strong> {Array.isArray(curriculum.lessons[lessonIdx]?.goals) ? curriculum.lessons[lessonIdx].goals.join(', ') : curriculum.lessons[lessonIdx]?.learningGoals}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Atividades:</strong> {Array.isArray(curriculum.lessons[lessonIdx]?.activities) ? curriculum.lessons[lessonIdx].activities.join(', ') : curriculum.lessons[lessonIdx]?.activities}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', width: '100%', marginBottom: '0.5rem' }}>
                  <div style={{ height: '8px', background: '#3b82f6', borderRadius: '4px', width: `${((lessonIdx + 1) / curriculum.lessons.length) * 100}%` }}></div>
                </div>
                <span style={{ color: '#4b5563' }}>Progresso: {lessonIdx + 1} / {curriculum.lessons.length}</span>
              </div>
            </div>
          )}
        </div>
        {/* Chat on the right */}
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
    </div>
  );
}

export default SubjectPage;

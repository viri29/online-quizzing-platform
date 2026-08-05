import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const STEPS = [
  { title: 'Create', text: 'Build a quiz with true/false or multiple-choice questions.' },
  { title: 'Take', text: 'Answer one question at a time with instant feedback.' },
  { title: 'Review', text: 'See your score and go back over what you missed.' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch(`${API_URL}/api/quizzes`);
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error('Error loading quizzes:', err);
      }
    }
    fetchQuizzes();
  }, []);

  const totalQuestions = quizzes.reduce((sum, q) => sum + q.questions.length, 0);
  const categoryCount = new Set(quizzes.map((q) => q.category)).size;
  const featured = quizzes.slice(0, 3);

  const goToQuiz = (quizId) => navigate('/takequiz', { state: { quizId } });

  return (
    <main className="home-page">
      <section className="hero">
        <h1 className="welcome">{user ? `Welcome back, ${user.firstName}!` : 'Welcome to Online Quizzes!'}</h1>
        <p className="hero-subtitle">Create quizzes in minutes, challenge yourself, and track how you score.</p>
        <div className="hero-actions">
          <button type="button" className="btn-primary" onClick={() => navigate('/takequiz')}>
            Take a Quiz
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/makequiz')}>
            Create a Quiz
          </button>
          {!user && (
            <button type="button" className="btn-secondary" onClick={() => navigate('/register')}>
              Sign Up Free
            </button>
          )}
        </div>
      </section>

      {quizzes.length > 0 && (
        <section className="home-stats">
          <div className="home-stat">
            <span className="home-stat-value">{quizzes.length}</span>
            <span className="home-stat-label">Quizzes</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">{categoryCount}</span>
            <span className="home-stat-label">Categories</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">{totalQuestions}</span>
            <span className="home-stat-label">Questions</span>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="home-featured">
          <h2>Featured Quizzes</h2>
          <div className="quiz-picker-grid">
            {featured.map((quiz) => (
              <button type="button" key={quiz._id} className="quiz-card" onClick={() => goToQuiz(quiz._id)}>
                <h3>{quiz.title}</h3>
                <span className="quiz-card-category">{quiz.category}</span>
                <span className="quiz-card-meta">
                  {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="home-steps">
        <h2>How it works</h2>
        <div className="home-steps-grid">
          {STEPS.map((step, i) => (
            <div className="home-step" key={step.title}>
              <span className="mq-badge">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

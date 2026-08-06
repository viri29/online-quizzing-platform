import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../api';

export default function Account() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!user) {
      toast.error('You are not logged in.');
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchAccountData() {
      try {
        const [quizzesRes, resultsRes] = await Promise.all([
          fetch(`${API_URL}/api/quizzes`),
          fetch(`${API_URL}/api/results/user/${user.userId}`),
        ]);
        setQuizzes(await quizzesRes.json());
        setResults(await resultsRes.json());
      } catch (err) {
        console.error('Error loading account data:', err);
      }
    }
    fetchAccountData();
  }, [user]);

  const handleSignOut = () => {
    logout();
    toast.success('You have been signed out.');
    navigate('/login');
  };

  const goToQuiz = (quizId) => navigate('/takequiz', { state: { quizId } });

  if (!user) return null;

  const myQuizzes = quizzes.filter((q) => q.createdBy === user.userId);
  const quizById = Object.fromEntries(quizzes.map((q) => [q._id, q]));
  const resultsByQuiz = results.reduce((acc, r) => {
    (acc[r.quizId] ||= []).push(r);
    return acc;
  }, {});

  return (
    <main className="account-page">
      <div className="account-info">
        <h2>Your Account</h2>
        <p>
          <strong>First Name:</strong> <span id="first-name">{user.firstName}</span>
        </p>
        <p>
          <strong>Last Name:</strong> <span id="last-name">{user.lastName}</span>
        </p>
        <p>
          <strong>Email:</strong> <span id="email">{user.email}</span>
        </p>
        <p>
          <strong>Username:</strong> <span id="username">{user.username}</span>
        </p>
        <button id="sign-out-button" className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <section className="account-section">
        <h2>My Quizzes</h2>
        {myQuizzes.length === 0 ? (
          <div className="account-empty">
            <p>You haven't created any quizzes yet.</p>
            <button type="button" className="btn-primary" onClick={() => navigate('/makequiz')}>
              Create a Quiz
            </button>
          </div>
        ) : (
          <div className="quiz-picker-grid">
            {myQuizzes.map((quiz) => (
              <button type="button" key={quiz._id} className="quiz-card" onClick={() => goToQuiz(quiz._id)}>
                <h3>{quiz.title}</h3>
                <span className="quiz-card-category">{quiz.category}</span>
                <span className="quiz-card-meta">
                  {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="account-section">
        <h2>Quiz History</h2>
        {Object.keys(resultsByQuiz).length === 0 ? (
          <div className="account-empty">
            <p>You haven't taken any quizzes yet.</p>
            <button type="button" className="btn-primary" onClick={() => navigate('/takequiz')}>
              Take a Quiz
            </button>
          </div>
        ) : (
          <div className="history-groups">
            {Object.entries(resultsByQuiz).map(([quizId, attempts]) => (
              <div className="history-quiz-group" key={quizId}>
                <h3>{quizById[quizId]?.title ?? 'Deleted quiz'}</h3>
                <ul className="history-list">
                  {attempts.map((r) => (
                    <li key={r._id} className="history-item">
                      <span className="history-score">
                        {r.score} / {r.total} ({Math.round((r.score / r.total) * 100)}%)
                      </span>
                      <span className="history-date">{new Date(r.submittedAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

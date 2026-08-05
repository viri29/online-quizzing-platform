import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../api';
import ScoreDonut from '../components/ScoreDonut';

export default function TakeQuiz() {
  const location = useLocation();
  const [quizzes, setQuizzes] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAnswers, setShowAnswers] = useState(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch(`${API_URL}/api/quizzes`);
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error('Error loading quizzes:', err);
        setLoadError(true);
      }
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (quizzes.length > 0 && location.state?.quizId && selectedIndex === '') {
      const idx = quizzes.findIndex((q) => q._id === location.state.quizId);
      if (idx !== -1) selectQuiz(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzes]);

  const selectedQuiz = selectedIndex !== '' ? quizzes[selectedIndex] : null;
  const totalQuestions = selectedQuiz ? selectedQuiz.questions.length : 0;
  const currentQuestion = selectedQuiz ? selectedQuiz.questions[step] : null;
  const isAnswered = answers[step] !== undefined;
  const isLastQuestion = step === totalQuestions - 1;

  const selectQuiz = (index) => {
    setSelectedIndex(index);
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowAnswers(null);
  };

  const backToQuizList = () => {
    setSelectedIndex('');
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowAnswers(null);
  };

  const selectAnswer = (idx) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [step]: idx }));
  };

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    const answerArray = selectedQuiz.questions.map((_, i) => finalAnswers[i]);

    try {
      const res = await fetch(`${API_URL}/api/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: selectedQuiz._id, answers: answerArray }),
      });

      const data = await res.json();
      setResult({ score: data.score, total: data.total });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setResult('error');
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (isLastQuestion) {
      submitQuiz(answers);
    } else {
      setStep((s) => s + 1);
    }
  };

  const progressPercent = totalQuestions ? (Object.keys(answers).length / totalQuestions) * 100 : 0;

  return (
    <main>
      <div id="quiz-container">
        {loadError && <p>Failed to load quizzes.</p>}

        {!loadError && selectedIndex === '' && (
          <>
            <h2>Choose a Quiz</h2>
            {quizzes.length === 0 ? (
              <p className="quiz-picker-empty">No quizzes yet — create one first!</p>
            ) : (
              <div className="quiz-picker-grid">
                {quizzes.map((quiz, index) => (
                  <button
                    type="button"
                    key={quiz._id ?? index}
                    className="quiz-card"
                    onClick={() => selectQuiz(index)}
                  >
                    <h3>{quiz.title}</h3>
                    <span className="quiz-card-category">{quiz.category}</span>
                    <span className="quiz-card-meta">
                      {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selectedQuiz && !result && currentQuestion && (
          <div className="quiz-runner">
            <button type="button" className="back-link" onClick={backToQuizList}>
              ← Choose another quiz
            </button>
            <h2>{selectedQuiz.title}</h2>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="progress-label">
              Question {step + 1} of {totalQuestions}
            </p>

            <div className="question-block quiz-question" key={step}>
              <p>
                <strong>Q{step + 1}:</strong> {currentQuestion.question}
              </p>
              {currentQuestion.options.map((opt, idx) => {
                const isCorrectOption = idx === currentQuestion.correctAnswer;
                const isSelected = answers[step] === idx;
                let optionClass = 'quiz-option';
                if (isAnswered && isCorrectOption) optionClass += ' option-correct';
                else if (isAnswered && isSelected) optionClass += ' option-incorrect';

                return (
                  <button
                    type="button"
                    key={idx}
                    className={optionClass}
                    onClick={() => selectAnswer(idx)}
                    disabled={isAnswered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="center-buttons">
              <button type="button" onClick={goNext} disabled={!isAnswered || submitting}>
                {isLastQuestion ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {result === 'error' && <p>Submission failed.</p>}

        {result && result !== 'error' && (
          <div className="quiz-results">
            <ScoreDonut score={result.score} total={result.total} />
            {showAnswers === null && (
              <div className="answer-choice">
                <p className="answer-choice-prompt">Want to see the correct answers?</p>
                <div className="answer-choice-buttons">
                  <button type="button" className="btn-secondary btn-small" onClick={() => setShowAnswers(false)}>
                    Keep Hidden
                  </button>
                  <button type="button" className="btn-primary btn-small" onClick={() => setShowAnswers(true)}>
                    Show Answers
                  </button>
                </div>
              </div>
            )}
            <ul className="results-recap">
              {selectedQuiz.questions.map((q, i) => {
                const correct = answers[i] === q.correctAnswer;
                return (
                  <li key={i} className={correct ? 'recap-correct' : 'recap-incorrect'}>
                    <span className="recap-question">
                      Q{i + 1}: {q.question}
                    </span>
                    {!correct && showAnswers && (
                      <span className="recap-answer">Correct answer: {q.options[q.correctAnswer]}</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="center-buttons">
              <button type="button" className="btn-secondary" onClick={backToQuizList}>
                Choose another quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

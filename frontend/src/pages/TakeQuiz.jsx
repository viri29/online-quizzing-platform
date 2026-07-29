import { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function TakeQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const selectedQuiz = selectedIndex !== '' ? quizzes[selectedIndex] : null;
  const totalQuestions = selectedQuiz ? selectedQuiz.questions.length : 0;
  const currentQuestion = selectedQuiz ? selectedQuiz.questions[step] : null;
  const isAnswered = answers[step] !== undefined;
  const isLastQuestion = step === totalQuestions - 1;

  const handleSelectChange = (e) => {
    setSelectedIndex(e.target.value);
    setStep(0);
    setAnswers({});
    setResult(null);
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
        {loadError ? (
          <p>Failed to load quizzes.</p>
        ) : (
          <>
            <h2>Choose a Quiz</h2>
            <select id="quiz-selector" value={selectedIndex} onChange={handleSelectChange}>
              <option disabled value="">
                Select a quiz
              </option>
              {quizzes.map((quiz, index) => (
                <option key={quiz._id ?? index} value={index}>
                  {quiz.title} ({quiz.category})
                </option>
              ))}
            </select>

            {selectedQuiz && !result && currentQuestion && (
              <div className="quiz-runner">
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
                <h3 className="score-reveal">
                  You scored {result.score} out of {result.total}
                </h3>
                <ul className="results-recap">
                  {selectedQuiz.questions.map((q, i) => {
                    const correct = answers[i] === q.correctAnswer;
                    return (
                      <li key={i} className={correct ? 'recap-correct' : 'recap-incorrect'}>
                        Q{i + 1}: {q.question} — {correct ? 'Correct' : `Incorrect (answer: ${q.options[q.correctAnswer]})`}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

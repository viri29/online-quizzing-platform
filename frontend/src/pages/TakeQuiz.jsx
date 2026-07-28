import { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function TakeQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

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

  const handleSelectChange = (e) => {
    setSelectedIndex(e.target.value);
    setAnswers({});
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerArray = selectedQuiz.questions.map((_, i) => Number(answers[i]));

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
    }
  };

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

            {selectedQuiz && (
              <>
                <h2>{selectedQuiz.title}</h2>
                <form id="quiz-form" onSubmit={handleSubmit}>
                  {selectedQuiz.questions.map((q, i) => (
                    <div className="question-block" key={i}>
                      <p>
                        <strong>Q{i + 1}:</strong> {q.question}
                      </p>
                      {q.options.map((opt, idx) => (
                        <label key={idx}>
                          <input
                            type="radio"
                            name={`q${i}`}
                            value={idx}
                            checked={answers[i] === String(idx)}
                            onChange={() => setAnswers((prev) => ({ ...prev, [i]: String(idx) }))}
                          />{' '}
                          {opt}
                          <br />
                        </label>
                      ))}
                    </div>
                  ))}
                  <button type="submit">Submit</button>
                </form>
                <div id="result">
                  {result === 'error' && <p>Submission failed.</p>}
                  {result && result !== 'error' && (
                    <h3>
                      You scored {result.score} out of {result.total}
                    </h3>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

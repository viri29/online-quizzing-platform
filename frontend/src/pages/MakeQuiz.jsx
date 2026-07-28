import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

function emptyQuestion() {
  return {
    question: '',
    type: 'truefalse',
    answer: 'true',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    mcAnswer: '',
  };
}

export default function MakeQuiz() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const updateQuestion = (index, changes) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...changes } : q)));
  };

  const handleTypeChange = (index, type) => {
    updateQuestion(index, {
      type,
      answer: 'true',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      mcAnswer: '',
    });
  };

  const endQuizCreation = async () => {
    if (!confirm('Do you want to save your quiz?')) {
      setQuestions([]);
      return;
    }

    const title = prompt('Enter a quiz title:');
    const category = prompt('Enter a category:');

    const payload = questions.map((q) => {
      if (q.type === 'truefalse') {
        return {
          question: q.question,
          options: ['True', 'False'],
          correctAnswer: q.answer === 'true' ? 0 : 1,
        };
      }
      return {
        question: q.question,
        options: [q.optA, q.optB, q.optC, q.optD],
        correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.mcAnswer.toUpperCase()),
      };
    });

    const res = await fetch(`${API_URL}/api/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, questions: payload }),
    });

    const data = await res.json();
    if (data.quiz) {
      alert('Quiz saved successfully!');
      navigate('/');
    } else {
      alert('Error: ' + data.error);
    }
  };

  return (
    <main className="quiz-page makequiz-page">
      <h2 className="quiz-title">Create a Quiz</h2>
      <form id="quiz-form" onSubmit={(e) => e.preventDefault()}>
        <div id="questions-container">
          {questions.map((q, i) => (
            <div className="question-block" key={i}>
              <label>Question {i + 1}:</label>
              <br />
              <input
                type="text"
                placeholder="Enter your question"
                value={q.question}
                onChange={(e) => updateQuestion(i, { question: e.target.value })}
              />
              <br />
              <label>Type:</label>
              <select value={q.type} onChange={(e) => handleTypeChange(i, e.target.value)}>
                <option value="truefalse">True/False</option>
                <option value="multiple">Multiple Choice</option>
              </select>
              <div>
                {q.type === 'truefalse' ? (
                  <>
                    <label>Correct Answer:</label>
                    <select value={q.answer} onChange={(e) => updateQuestion(i, { answer: e.target.value })}>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </>
                ) : (
                  <>
                    <label>Option A:</label>{' '}
                    <input type="text" value={q.optA} onChange={(e) => updateQuestion(i, { optA: e.target.value })} />
                    <br />
                    <label>Option B:</label>{' '}
                    <input type="text" value={q.optB} onChange={(e) => updateQuestion(i, { optB: e.target.value })} />
                    <br />
                    <label>Option C:</label>{' '}
                    <input type="text" value={q.optC} onChange={(e) => updateQuestion(i, { optC: e.target.value })} />
                    <br />
                    <label>Option D:</label>{' '}
                    <input type="text" value={q.optD} onChange={(e) => updateQuestion(i, { optD: e.target.value })} />
                    <br />
                    <label>Correct Answer (A/B/C/D):</label>
                    <input
                      type="text"
                      maxLength={1}
                      value={q.mcAnswer}
                      onChange={(e) => updateQuestion(i, { mcAnswer: e.target.value })}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="center-buttons">
          <button type="button" onClick={addQuestion}>
            Add Question
          </button>
          <button type="button" onClick={endQuizCreation}>
            End Quiz Creation
          </button>
        </div>
      </form>
    </main>
  );
}

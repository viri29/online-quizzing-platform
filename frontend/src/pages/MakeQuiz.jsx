import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import { useToast } from '../context/ToastContext';
import SaveQuizModal from './SaveQuizModal';

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

function validateQuestions(questions) {
  if (questions.length === 0) return 'Add at least one question before saving.';
  for (const q of questions) {
    if (!q.question.trim()) return 'Every question needs question text.';
    if (q.type === 'truefalse') continue;
    if (!q.optA.trim() || !q.optB.trim() || !q.optC.trim() || !q.optD.trim()) {
      return 'Fill in all four options for each multiple-choice question.';
    }
    if (!['A', 'B', 'C', 'D'].includes(q.mcAnswer.trim().toUpperCase())) {
      return 'Correct Answer must be A, B, C, or D.';
    }
  }
  return null;
}

function toPreviewOptions(q) {
  if (q.type === 'truefalse') {
    return { options: ['True', 'False'], correctIndex: q.answer === 'true' ? 0 : 1 };
  }
  return {
    options: [q.optA, q.optB, q.optC, q.optD],
    correctIndex: ['A', 'B', 'C', 'D'].indexOf(q.mcAnswer.trim().toUpperCase()),
  };
}

export default function MakeQuiz() {
  const [questions, setQuestions] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const toast = useToast();
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

  const handleDrop = (index) => (e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setQuestions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const handleEndQuizCreation = () => {
    const error = validateQuestions(questions);
    if (error) {
      toast.error(error);
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveQuiz = async (title, category) => {
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
        correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.mcAnswer.trim().toUpperCase()),
      };
    });

    const res = await fetch(`${API_URL}/api/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, questions: payload }),
    });

    const data = await res.json();
    setShowSaveModal(false);
    if (data.quiz) {
      toast.success('Quiz saved successfully!');
      navigate('/');
    } else {
      toast.error(data.error);
    }
  };

  const handleDiscard = () => {
    setShowSaveModal(false);
    setQuestions([]);
  };

  return (
    <main className="quiz-page makequiz-page">
      <h2 className="quiz-title">Create a Quiz</h2>
      <form id="quiz-form" onSubmit={(e) => e.preventDefault()}>
        <div id="questions-container">
          {questions.map((q, i) => (
            <div
              className={`question-block draggable-block ${dragIndex === i ? 'dragging' : ''}`}
              key={i}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
            >
              <span className="drag-handle" title="Drag to reorder">⠿</span>
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
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowPreview((prev) => !prev)}
            disabled={questions.length === 0}
          >
            {showPreview ? 'Hide Preview' : 'Preview Quiz'}
          </button>
          <button type="button" onClick={handleEndQuizCreation}>
            End Quiz Creation
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="quiz-preview">
          <h3>Preview</h3>
          {questions.map((q, i) => {
            const { options, correctIndex } = toPreviewOptions(q);
            return (
              <div className="question-block preview-block" key={i}>
                <p>
                  <strong>Q{i + 1}:</strong> {q.question || <em>Untitled question</em>}
                </p>
                {options.map((opt, idx) => (
                  <div key={idx} className={`preview-option ${idx === correctIndex ? 'preview-correct' : ''}`}>
                    {opt || <em>Empty option</em>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {showSaveModal && <SaveQuizModal onSave={handleSaveQuiz} onDiscard={handleDiscard} />}
    </main>
  );
}

import { useState } from 'react';
import Modal from '../components/Modal';

export default function SaveQuizModal({ onSave, onDiscard }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title, category);
  };

  return (
    <Modal title="Save your quiz" onClose={onDiscard}>
      <form className="save-quiz-form" onSubmit={handleSubmit}>
        <label htmlFor="quiz-title">Quiz title</label>
        <input
          id="quiz-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label htmlFor="quiz-category">Category</label>
        <input
          id="quiz-category"
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onDiscard}>
            Discard
          </button>
          <button type="submit" className="btn-primary">
            Save Quiz
          </button>
        </div>
      </form>
    </Modal>
  );
}

import { useEffect, useState } from 'react';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreDonut({ score, total }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const targetOffset = CIRCUMFERENCE * (1 - percent / 100);
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(targetOffset));
    return () => cancelAnimationFrame(id);
  }, [targetOffset]);

  return (
    <div className="score-donut" role="img" aria-label={`${percent}% correct: ${score} out of ${total} questions`}>
      <svg viewBox="0 0 120 120" width="160" height="160">
        <circle className="donut-track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="donut-fill"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="donut-label">
        <span className="donut-percent">{percent}%</span>
        <span className="donut-sub">
          {score} / {total} correct
        </span>
      </div>
    </div>
  );
}

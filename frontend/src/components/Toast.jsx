import { useEffect } from 'react';

export default function Toast({ toasts, remove }) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const id = toasts[toasts.length - 1].id;
    const timer = setTimeout(() => remove(id), 3500);
    return () => clearTimeout(timer);
  }, [toasts, remove]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

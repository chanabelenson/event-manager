import { useState, useEffect } from 'react';
import { getUpdates, addUpdate, markUpdateDone } from '../../../services/producerService';
import UpdateItem from './UpdateItem';
import './Producer.css';

export default function ProducerUpdates({ eventId, userRole }) {
  const [updates, setUpdates] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    getUpdates(eventId).then(setUpdates).catch(console.error);
  }, [eventId]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const { id } = await addUpdate(eventId, input.trim());
    setUpdates((prev) => [...prev, { id, event_id: eventId, author_role: userRole, content: input.trim(), status: 'pending' }]);
    setInput('');
  };

  return (
    <div className="producer-updates">
      <h4>עדכונים ומשימות</h4>
      <div className="producer-updates-list">
        {updates.length === 0 && <p className="producer-updates-empty">אין עדכונים עדיין</p>}
        {updates.map((u) => (
          <UpdateItem
            key={u.id}
            update={u}
            canMarkDone={userRole === 'owner' && u.author_role === 'producer'}
            onMarkDone={handleMarkDone}
          />
        ))}
      </div>
      <div className="producer-update-input-row">
        <input
          placeholder="הוסף עדכון..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className="btn-primary" onClick={handleAdd}>+</button>
      </div>
    </div>
  );

  function handleMarkDone(updateId) {
    markUpdateDone(eventId, updateId);
    setUpdates((prev) => prev.map((u) => u.id === updateId ? { ...u, status: 'done' } : u));
  }
}

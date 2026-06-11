import { useState, useEffect } from 'react';
import { getUpdates, addUpdate, markUpdateDone } from '../../../services/producerService';
import UpdateItem from './UpdateItem';

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

  const handleMarkDone = async (updateId) => {
    await markUpdateDone(eventId, updateId);
    setUpdates((prev) => prev.map((u) => u.id === updateId ? { ...u, status: 'done' } : u));
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ marginBottom: '10px' }}>עדכונים ומשימות</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {updates.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>אין עדכונים עדיין</p>}
        {updates.map((u) => (
          <UpdateItem
            key={u.id}
            update={u}
            canMarkDone={userRole === 'owner' && u.author_role === 'producer'}
            onMarkDone={handleMarkDone}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          placeholder="הוסף עדכון..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={handleAdd}>+</button>
      </div>
    </div>
  );
}

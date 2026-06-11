import { useState, useEffect } from 'react';
import { getProducers, getEventProducer, getEventRequest, sendRequest, cancelRequest, removeProducer, rateProducer } from '../../../services/producerService';
import ProducerCatalog from './ProducerCatalog';
import ProducerProfile from './ProducerProfile';
import RequestConfirmModal from './RequestConfirmModal';
import AssignedProducerView from './AssignedProducerView';

export default function ProducerTab({ eventId }) {
const [producers, setProducers] = useState([]);
  const [assigned, setAssigned] = useState(null);
  const [viewProducer, setViewProducer] = useState(null);
  const [showManage, setShowManage] = useState(false);
  const [pendingProducer, setPendingProducer] = useState(null);
  const [sentProducerId, setSentProducerId] = useState(null);

  useEffect(() => {
    getProducers().then(setProducers).catch(console.error);
    getEventProducer(eventId).then(setAssigned).catch(console.error);
    getEventRequest(eventId).then((req) => {
      if (req) setSentProducerId(req.producer_id);
    }).catch(console.error);
  }, [eventId]);

  const handleClickProducer = (producer) => {
    if (assigned && producer.id === assigned.id) {
      setShowManage(true);
    } else {
      setViewProducer(producer);
    }
  };

  const handleRequestConfirm = async () => {
    try {
      await sendRequest(eventId, pendingProducer.id);
    } catch {
      // בקשה כבר קיימת — treat as sent
    }
    setSentProducerId(pendingProducer.id);
    setPendingProducer(null);
    setViewProducer(null);
  };

  const handleCancel = async () => {
    await cancelRequest(eventId);
    setSentProducerId(null);
    setViewProducer(null);
  };

  const handleRemove = async () => {
    await removeProducer(eventId);
    setAssigned(null);
    setSentProducerId(null);
    setShowManage(false);
  };

  const handleRate = async (rating, review) => {
    await rateProducer(eventId, rating, review);
  };

  const sentProducerName = sentProducerId
    ? producers.find((p) => p.id === sentProducerId)?.full_name
    : null;

  return (
    <div className="tab-content">
      <h3 className="section-title">מפיק האירוע</h3>

      {sentProducerId && sentProducerName && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px' }}>
            ⏳ ממתין לאישור מ-<strong>{sentProducerName}</strong>
          </span>
          <button className="btn-ghost" style={{ color: '#ef4444', fontSize: '13px' }} onClick={handleCancel}>
            בטל בקשה
          </button>
        </div>
      )}

      <ProducerCatalog
        producers={producers}
        assignedId={assigned?.id}
        onClickProducer={handleClickProducer}
      />

      {viewProducer && (
        <ProducerProfile
          producer={viewProducer}
          requestSent={sentProducerId === viewProducer.id}
          requestLocked={sentProducerId !== null}
          onRequest={setPendingProducer}
          onCancel={handleCancel}
          onClose={() => setViewProducer(null)}
        />
      )}

      {pendingProducer && (
        <RequestConfirmModal
          producer={pendingProducer}
          onConfirm={handleRequestConfirm}
          onCancel={() => setPendingProducer(null)}
        />
      )}

      {showManage && assigned && (
        <div className="modal-overlay" onClick={() => setShowManage(false)}>
          <div className="modal-card" style={{ maxWidth: '560px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3>ניהול מפיק</h3>
              <button className="btn-ghost" onClick={() => setShowManage(false)}>✕</button>
            </div>
            <AssignedProducerView
              producer={assigned}
              eventId={eventId}
              onRate={handleRate}
              onRemove={handleRemove}
            />
          </div>
        </div>
      )}
    </div>
  );
}

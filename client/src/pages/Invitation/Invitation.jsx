import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getInvitation, updateInvitationStatus } from '../../services/invitationService';
import GiftsList from '../../components/Invitation/GiftsList';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const formatDeadline = (dateStr) =>
  new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Invitation() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmedCount, setConfirmedCount] = useState(1);

  useEffect(() => {
    getInvitation(token)
      .then((d) => { setData(d); setConfirmedCount(d.guests_count); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleResponse = async (status) => {
    if (submitting) return;
    setSubmitting(true);
    setSuccessMsg('');
    try {
      await updateInvitationStatus(token, status, status === 'confirmed' ? confirmedCount : 0);
      setData((prev) => ({ ...prev, status, confirmed_count: status === 'confirmed' ? confirmedCount : 0 }));
      setSuccessMsg(status === 'confirmed' ? `אישרת הגעה ל-${confirmedCount} אנשים! נשמח לראותכם 🎉` : 'עדכנו שלא תוכל להגיע 😔');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="invitation-page"><p className="invitation-loading">טוען...</p></div>;

  if (error) return (
    <div className="invitation-page">
      <div className="invitation-card">
        <div className="invitation-header">
          <span className="invitation-icon">❌</span>
          <h1>שגיאה</h1>
        </div>
        <div className="invitation-body">
          <p style={{ color: 'var(--rose)', textAlign: 'center' }}>{error}</p>
        </div>
      </div>
    </div>
  );

  const { status, deadline_passed, deadline_date } = data;
  const isConfirmed = status === 'confirmed';
  const isDeclined = status === 'declined';

  return (
    <div className="invitation-page">
      <div className="invitation-card">

        <div className="invitation-header">
          <span className="invitation-icon">💌</span>
          <h1>הוזמנת!</h1>
        </div>

        <div className="invitation-body">
          <h2>{data.event_name}</h2>

          <div className="invitation-details">
            <p className="invitation-date">📅 {formatDate(data.event_date)}</p>
            <p className="invitation-location">📍 {data.location_name}</p>
            {data.location_address && <p className="invitation-address">{data.location_address}</p>}
          </div>

          <div className="invitation-guest">
            <p>שלום <strong>{data.guest_name}</strong> 👋</p>
            {data.guests_count > 1 && (
              <p className="guests-count">מוזמנים: {data.guests_count} אנשים</p>
            )}
          </div>

          {successMsg && <p className="invitation-success">{successMsg}</p>}

          {deadline_passed ? (
            <div className="invitation-locked">
              <span>🔒</span>
              <p>לא ניתן לשנות אישור הגעה לאחר {formatDeadline(deadline_date)}</p>
              {isConfirmed && <small>סטטוס נוכחי: אישרת הגעה ל-{data.confirmed_count} אנשים ✅</small>}
              {isDeclined && <small>סטטוס נוכחי: לא מגיע 😔</small>}
              {status === 'pending' && <small>סטטוס נוכחי: לא ענית</small>}
            </div>
          ) : (
            <div className="invitation-actions">
              <p className="invitation-question">
                {status === 'pending' ? 'האם תגיעו?' : 'ניתן לשנות את תשובתך'}
              </p>
              <p className="invitation-deadline">ניתן לשנות עד {formatDeadline(deadline_date)}</p>

              {data.guests_count > 1 && (
                <div className="guests-count-selector">
                  <label>כמה אנשים מגיעים?</label>
                  <select value={confirmedCount} onChange={(e) => setConfirmedCount(Number(e.target.value))}>
                    {Array.from({ length: data.guests_count }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="invitation-buttons">
                <button
                  className={`btn-confirm ${isConfirmed ? 'btn-active' : ''}`}
                  onClick={() => handleResponse('confirmed')}
                  disabled={submitting}
                >
                  ✓ {isConfirmed ? `אישרת הגעה (${data.confirmed_count})` : 'כן, אגיע'}
                </button>
                <button
                  className={`btn-decline ${isDeclined ? 'btn-active-decline' : ''}`}
                  onClick={() => handleResponse('declined')}
                  disabled={submitting || isDeclined}
                >
                  ✕ {isDeclined ? 'לא מגיע' : 'לא אוכל להגיע'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <GiftsList token={token} />
    </div>
  );
}

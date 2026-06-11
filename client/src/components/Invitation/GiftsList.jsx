import { useState, useEffect } from 'react';
import { getGiftsForGuest, updateGiftClaim } from '../../services/invitationGiftService';

export default function GiftsList({ token }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGifts, setShowGifts] = useState(false);

  useEffect(() => {
    setGifts([]);
    setError('');
    setShowGifts(false);
    setLoading(false);
  }, [token]);

  const normalizeGifts = (data) =>
    data.map((gift) => ({
      ...gift,
      is_claimed: !!gift.is_claimed,
      claimed_by_me: !!gift.claimed_by_me,
    }));

  const loadGifts = async () => {
    if (loading) return;
    setShowGifts(true);
    setLoading(true);
    setError('');

    try {
      const data = await getGiftsForGuest(token);
      setGifts(normalizeGifts(data));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (gift) => {
    try {
      setError('');
      if (gift.claimed_by_me) {
        await updateGiftClaim(token, gift.id, false);
        setGifts((prev) =>
          prev.map((g) => (g.id === gift.id ? { ...g, claimed_by_me: false, is_claimed: false } : g))
        );
      } else {
        await updateGiftClaim(token, gift.id, true);
        setGifts((prev) =>
          prev.map((g) => (g.id === gift.id ? { ...g, claimed_by_me: true, is_claimed: true } : g))
        );
      }
    } catch (e) {
      setError(e.message);
    }
  };

  if (!showGifts) {
    return (
      <div className="gifts-invitation-toggle">
        <button type="button" className="gift-open-btn" onClick={loadGifts}>
          🎁 אני רוצה לקנות מתנה
        </button>
      </div>
    );
  }

  return (
    <div className="gifts-list-invitation">
      <div className="gifts-invitation-header">
        <h3>🎁 רשימת מתנות</h3>
        <p className="gifts-invitation-hint">
          סמן את המתנה שתרצה לקנות - כולם יוכלו לראות מה כבר נבחר
        </p>
      </div>

      {loading && <p className="gifts-empty">טוען מתנות...</p>}
      {error && <p className="auth-error">{error}</p>}
      {!loading && !error && gifts.length === 0 && <p className="gifts-empty">אין כרגע מתנות לבחירה</p>}

      {!loading && gifts.length > 0 && (
        <div className="gifts-items">
          {gifts.map((gift) => {
            const isMine = gift.claimed_by_me;
            const isTaken = gift.is_claimed && !isMine;

            return (
              <div
                key={gift.id}
                className={`gift-item-inv${isMine ? ' gift-inv-mine' : isTaken ? ' gift-inv-taken' : ''}`}
              >
                <div className="gift-inv-icon">{isMine ? '✅' : isTaken ? '🔒' : '🎁'}</div>
                <div className="gift-inv-body">
                  <p className="gift-inv-name">{gift.name}</p>
                  {gift.description && <p className="gift-inv-desc">{gift.description}</p>}
                  {gift.link && (
                    <a href={gift.link} target="_blank" rel="noreferrer" className="gift-inv-link">
                      🔗 קישור לרכישה
                    </a>
                  )}
                  {isTaken && <span className="gift-inv-badge taken">נקנתה על ידי מישהו אחר</span>}
                  {isMine && <span className="gift-inv-badge mine">בחרתי לקנות</span>}
                </div>
                {!isTaken && (
                  <button
                    className={`gift-inv-btn${isMine ? ' gift-inv-btn-unclaim' : ''}`}
                    onClick={() => handleClaim(gift)}
                  >
                    {isMine ? 'בטל' : 'אני קונה'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getGiftsForGuest, claimGift, unclaimGift } from '../../services/invitationGiftService';

export default function GiftsList({ token }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getGiftsForGuest(token)
      .then((data) => setGifts(data.map((g) => ({ ...g, is_claimed: !!g.is_claimed, claimed_by_me: !!g.claimed_by_me }))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleClaim = async (gift) => {
    try {
      if (gift.claimed_by_me) {
        await unclaimGift(token, gift.id);
        setGifts((prev) => prev.map((g) => g.id === gift.id ? { ...g, claimed_by_me: false, is_claimed: false } : g));
      } else {
        await claimGift(token, gift.id);
        setGifts((prev) => prev.map((g) => g.id === gift.id ? { ...g, claimed_by_me: true, is_claimed: true } : g));
      }
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="invitation-loading">טוען מתנות...</p>;
  if (gifts.length === 0) return null;

  return (
    <div className="gifts-list-invitation">
      <div className="gifts-invitation-header">
        <h3>🎁 רשימת מתנות</h3>
        <p className="gifts-invitation-hint">סמן את המתנה שתרצה לקנות — כולם יוכלו לראות מה כבר נבחר</p>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <div className="gifts-items">
        {gifts.map((gift) => {
          const isMine = gift.claimed_by_me;
          const isTaken = gift.is_claimed && !isMine;
          return (
            <div key={gift.id} className={`gift-item-inv${isMine ? ' gift-inv-mine' : isTaken ? ' gift-inv-taken' : ''}`}>
              <div className="gift-inv-icon">{isMine ? '✅' : isTaken ? '🔒' : '🎁'}</div>
              <div className="gift-inv-body">
                <p className="gift-inv-name">{gift.name}</p>
                {gift.description && <p className="gift-inv-desc">{gift.description}</p>}
                {gift.link && <a href={gift.link} target="_blank" rel="noreferrer" className="gift-inv-link">🔗 קישור לרכישה</a>}
                {isTaken && <span className="gift-inv-badge taken">נקנתה על ידי מישהו אחר</span>}
                {isMine && <span className="gift-inv-badge mine">בחרתי לקנות</span>}
              </div>
              {!isTaken && (
                <button className={`gift-inv-btn${isMine ? ' gift-inv-btn-unclaim' : ''}`} onClick={() => handleClaim(gift)}>
                  {isMine ? 'בטל' : 'אני קונה'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

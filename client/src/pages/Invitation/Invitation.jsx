 import React from 'react';
import { useParams } from 'react-router-dom';

export default function Invitation() {
  const { token } = useParams(); // תפיסת הטוקן הייחודי מהכתובת לזיהוי האורח

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>💌 הזמנה דיגיטלית לאירוע</h1>
      <p>שלום, הגעתם לדף אישור ההגעה האישי שלכם.</p>
      <small style={{ color: 'gray' }}>קוד אורח: {token}</small>
    </div>
  );
}

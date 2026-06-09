import nodemailer from 'nodemailer';

// הגדרת החיבור לגוגל באמצעות המשתנים מקובץ ה-.env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // מושך את המייל מה-.env שלך
    pass: process.env.EMAIL_PASS  // מושך את סיסמת 16 האותיות מה-.env שלך
  }
});

// פונקציה לשליחת מייל הזמנה
export async function sendInvitationEmail({ guestEmail, guestName, eventName, invitationLink }) {
  try {
    const mailOptions = {
      from: `"מערכת ניהול אירועים" <${process.env.EMAIL_USER}>`,
      to: guestEmail,
      subject: `הזמנה ל${eventName} עבור ${guestName}`,
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">שלום ${guestName},</h2>
          <p style="font-size: 16px; color: #555;">הוזמנת ל<strong>${eventName}</strong>! נשמח מאוד לראותך בין אורחינו.</p>
          <p style="font-size: 16px; color: #555;">כדי לצפות בהזמנה ולאשר או לעדכן הגעה, אנא לחץ על הכפתור למטה:</p>
          <br/>
          <a href="${invitationLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">לצפייה בהזמנה ואישור הגעה</a>
          <br/><br/><br/>
          <p style="font-size: 12px; color: #999;">אם הכפתור לא עובד, ניתן להעתיק את הקישור הבא לדפדפן:</p>
          <p style="font-size: 12px; color: #0066cc;">${invitationLink}</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendResetCodeEmail({ userEmail, userName, code }) {
  try {
    const mailOptions = {
      from: `"מערכת ניהול אירועים" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'קוד אימות לשינוי סיסמה',
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">שלום ${userName},</h2>
          <p style="font-size: 16px; color: #555;">קיבלנו בקשה לשינוי הסיסמה שלך.</p>
          <p style="font-size: 16px; color: #555;">קוד האימות שלך הוא:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #333; margin: 20px 0; padding: 16px; background: #f5f5f5; border-radius: 8px; display: inline-block;">${code}</div>
          <p style="font-size: 14px; color: #999;">הקוד תקף ל-10 דקות בלבד.</p>
          <p style="font-size: 12px; color: #bbb;">אם לא ביקשת לשנות סיסמה, ניתן להתעלם מהודעה זו.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reset code email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending reset code email:', error);
    return false;
  }
}
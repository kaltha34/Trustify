const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendFraudAlert = async (email) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "⚠️ Security Alert: Suspicious Login Attempts",
    html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="background: #ffffff; padding: 20px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: red; margin-bottom: 10px;">⚠️ Security Alert</h2>
          <p style="color: #555; font-size: 16px;">Your account has experienced multiple failed login attempts.</p>
          <p style="color: #222; font-weight: bold; font-size: 16px;">If this wasn't you, <strong>please secure your account immediately.</strong></p>

          <div style="margin: 20px 0;">
            <a href="http://localhost:3000/reset-password"
               style="background-color: #ff4d4d; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
              Reset Your Password
            </a>
          </div>

          <p style="color: #777; font-size: 14px;">If you did not request this, you can ignore this email.</p>

          <p style="margin-top: 20px; color: #888; font-size: 12px;">For security reasons, never share your login credentials.</p>
          <p style="font-size: 14px; color: #444;">Stay safe, <br><strong>Trustify Security Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Fraud alert email sent to", email);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.body : error.message
    );
  }
};

module.exports = sendFraudAlert;

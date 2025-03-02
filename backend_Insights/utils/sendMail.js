const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendFraudAlert = async (email) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "⚠️ Security Alert: Suspicious Login Attempts",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
        <h2 style="color: red; text-align: center;">⚠️ Security Alert</h2>
        <p>Your account has experienced multiple failed login attempts.</p>
        <p>If this wasn't you, <strong>please secure your account immediately.</strong></p>

        <div style="text-align: center; margin: 20px 0; ">
          <a href="https://your-app.com/reset-password?email=${email}"
             style="background-color: #ff4d4d; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
            Reset Your Password
          </a>
        </div>

        <p>If you did not request this, you can ignore this email.</p>
        <p>Stay safe, <br><strong>Trustify Security Team</strong></p>
      </div>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Fraud alert email sent to", email);
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error.message);
  }
};

module.exports = sendFraudAlert;

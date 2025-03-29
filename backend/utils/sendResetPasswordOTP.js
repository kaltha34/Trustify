const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetPasswordOTP = async (email, otp) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "🔐 Reset Your Password - TRUSTIFY",
    html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="background: #ffffff; padding: 20px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #007bff; margin-bottom: 10px;">🔐 Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">We received a request to reset your password for your Trustify account.</p>
          
          <p style="color: #222; font-weight: bold; font-size: 18px;">Your OTP for password reset:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 22px; font-weight: bold; letter-spacing: 2px; color: #333; display: inline-block; margin: 10px 0;">
            ${otp}
          </div>

          <p style="color: #777; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>

          <p style="margin-top: 20px; color: #888; font-size: 12px;">For security reasons, never share your OTP with anyone.</p>
          <p style="font-size: 14px; color: #444;">Best Regards, <br><strong>Trustify Security Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Reset password OTP email sent to", email);
  } catch (error) {
    console.error("Error sending reset password OTP:", error.response ? error.response.body : error.message);
  }
};

module.exports = sendResetPasswordOTP;

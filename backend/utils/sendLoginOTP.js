const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTP = async (user, otp) => {
  try {
    if (!user || !user.email) {
      throw new Error("User email not found");
    }

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: "🔐 Your One-Time Password (OTP) - TRUSTIFY",
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
          <div style="background: #ffffff; padding: 20px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #007bff; margin-bottom: 10px;">🔐 Your OTP for Login</h2>
            <p style="color: #555; font-size: 16px;">Use the following One-Time Password (OTP) to log in to your account.</p>
            
            <h3 style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 2px; color: #222; display: inline-block;">
              ${otp}
            </h3>

            <p style="color: #777; font-size: 14px;">This OTP is valid for only 5 minutes. Do not share it with anyone.</p>
            
            <p style="margin-top: 20px; color: #888; font-size: 12px;">For security reasons, never share your login credentials.</p>
            <p style="font-size: 14px; color: #444;">Stay secure, <br><strong>Trustify Security Team</strong></p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("OTP sent successfully to", user.email);
  } catch (error) {
    console.error("Error sending OTP:", error.response ? error.response.body : error.message);
  }
};

module.exports = sendOTP;

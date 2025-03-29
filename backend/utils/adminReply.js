const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAdminReplyEmail = async (email, reply) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "💬 Your Support Ticket Reply - TRUSTIFY",
    html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="background: #ffffff; padding: 20px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #007bff; margin-bottom: 10px;">💬 Support Ticket Reply</h2>
          <p style="color: #555; font-size: 16px;">We have received your support ticket and our admin has responded to it.</p>
          
          <p style="color: #222; font-weight: bold; font-size: 18px;">Admin's reply:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 18px; color: #333; display: inline-block; margin: 10px 0;">
            ${reply}
          </div>

          <p style="color: #777; font-size: 14px;">If you have any further questions or concerns, please don't hesitate to reply to this email.</p>

          <p style="margin-top: 20px; color: #888; font-size: 12px;">Best Regards, <br><strong>Trustify Support Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent to", email);
  } catch (error) {
    console.error("Error sending admin reply email:", error.response ? error.response.body : error.message);
  }
};

module.exports = sendAdminReplyEmail;

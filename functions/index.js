const {onRequest} = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");
const {defineSecret} = require("firebase-functions/params");

// Визнач секрет для пароля
const gmailPassword = defineSecret("GMAIL_PASSWORD");

exports.sendHelpEmail = onRequest(
    {cors: true, secrets: [gmailPassword]},
    async (req, res) => {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const {userId, userName, message, userEmail} = req.body;

      if (!userName || !message) {
        return res.status(400).send("Missing required fields");
      }

      // Створи transporter тут (щоб мати доступ до секрету)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "romeenice@gmail.com",
          pass: gmailPassword.value(), // ✅ Використовуй секрет
        },
      });

      const mailOptions = {
        from: "romeenice@gmail.com",
        to: "romeenice@gmail.com",
        subject: `Help Request from ${userName} (${userId})`,
        html: `
        <h2>New Help Request from Parents+ App</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Email:</strong> 
          ${userEmail || "Not provided"}
        </p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).send({success: true});
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({
          success: false,
          error: error.message,
        });
      }
    },
);

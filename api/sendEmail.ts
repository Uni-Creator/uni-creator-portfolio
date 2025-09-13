import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { name, email, message } = req.body;

  try {
    // OAuth2 setup
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://vercel.com/your-username/your-project-name/api/oauth2callback"
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();

    // Nodemailer with Gmail API
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // admin email
      subject: `💼 Portfolio Inquiry from ${name}`,
      html: `<div style="font-family: Arial, sans-serif;">
               <h2>New Message from Portfolio</h2>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p>${message}</p>
             </div>`,
    });

    res.status(200).json({ success: true, msg: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ success: false, msg: "❌ Email send failed." });
  }
}

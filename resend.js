import { Resend } from 'resend';
import 'dotenv/config'; // Loads your API key from .env

const resend = new Resend(process.env.RESEND_API_KEY);



async function sendWelcomeEmail(riskData) {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'johnturnerdick@gmail.com',
    subject: 'Update on the risks',
    text: `Hi John,\n\n${riskData}\n\nBest regards,\nJohn`,
  });

  return result; // this is what index.js expects to destructure
}

export default sendWelcomeEmail;
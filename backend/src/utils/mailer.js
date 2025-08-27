const nodemailer = require('nodemailer');

function createTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST) throw new Error('SMTP_HOST is not set');
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: false,
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    });
}

async function sendMail({ to, subject, text, html }) {
    const transporter = createTransport();
    const from = process.env.SMTP_FROM || 'no-reply@example.com';
    return transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendMail };


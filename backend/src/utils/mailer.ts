import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

// Created on first use so it reads SMTP settings after dotenv has loaded
function getTransporter(): Transporter | null {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });

    return transporter;
}

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailTransporter = getTransporter();

    // Without SMTP settings, print the email so the flow can be tested locally
    if (!mailTransporter) {
        console.log(`[mailer] SMTP not configured. Email to ${to}\nSubject: ${subject}\n${text}`);
        return;
    }

    await mailTransporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        text
    });
}

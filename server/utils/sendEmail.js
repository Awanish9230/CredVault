const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const smtpUser = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;
    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass) {
        console.warn('[Email] Missing SMTP credentials.');
        return;
    }

    // Port 2525 is the most reliable port for Brevo on Render
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 2525,
        secure: false, // Port 2525 does not use SSL/TLS directly
        auth: {
            user: smtpUser,
            pass: smtpPass
        },
        // High timeouts for Render stability
        connectionTimeout: 30000, 
        greetingTimeout: 30000,
        socketTimeout: 30000,
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `CredVault <${fromEmail}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        console.log(`[Email] Attempting SMTP delivery to ${options.email} via Port 2525...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('[Email] Success! Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('[Email] SMTP Error:', error.message);
        throw new Error(`Email failed: ${error.message}`);
    }
};

module.exports = sendEmail;







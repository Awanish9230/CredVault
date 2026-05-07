const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpUser && smtpPass) {
        console.log(`[Email] Attempting to configure SMTP: ${smtpHost}:${smtpPort}`);
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection configuration
        try {
            await transporter.verify();
            console.log('[Email] SMTP Connection Verified Successfully');
        } catch (verifyError) {
            console.error('[Email] SMTP Verification Failed:', verifyError.message);
            // We'll still try to send, but this is a major red flag
        }
    } else {
        console.log('[Email] No SMTP credentials found, using Ethereal for testing');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser || 'noreply@credvault.com';
    const mailOptions = {
        from: `CredVault <${fromEmail}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        console.log(`[Email] Sending email to: ${options.email}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('[Email] Message sent: %s', info.messageId);
        
        if (!smtpUser) {
            console.log('[Email] Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        return info;
    } catch (error) {
        console.error('[Email] Send error:', error.message);
        if (error.code === 'EAUTH') {
            console.error('[Email] Authentication failed. Please check SMTP_EMAIL and SMTP_PASSWORD.');
        }
        throw new Error(`Email delivery failed: ${error.message}`);
    }
};

module.exports = sendEmail;



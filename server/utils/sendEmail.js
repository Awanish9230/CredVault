const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpUser && smtpPass) {
        console.log(`Configuring SMTP with ${smtpHost}:${smtpPort}`);
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            // Production recommended settings
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            tls: {
                rejectUnauthorized: false // Helps with some hosting providers
            }
        });
    } else {
        console.log('No SMTP credentials found, using Ethereal for testing');
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

    const mailOptions = {
        from: `CredVault <${process.env.SMTP_FROM_EMAIL || smtpUser || 'noreply@credvault.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        
        if (!smtpUser) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email delivery failed. Please check server logs.');
    }
};

module.exports = sendEmail;


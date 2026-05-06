const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For free real emails, you can use Gmail, but it requires an App Password.
    // If credentials are not provided in .env, we fallback to Ethereal Email for testing purposes (free).
    let transporter;

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL, // Your Brevo login email
                pass: process.env.SMTP_PASSWORD // Your Brevo SMTP key
            }
        });
    } else {
        // Fallback to Ethereal Email (Free testing SMTP)
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('Using Ethereal Email for testing. Please check console logs for the email preview URL.');
    }

    // Define the email options
    const mailOptions = {
        from: `CredVault <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL || 'noreply@credvault.local'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    if (!process.env.SMTP_EMAIL) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
};

module.exports = sendEmail;

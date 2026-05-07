const sendEmail = async (options) => {
    const apiKey = process.env.SMTP_PASSWORD;
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL;

    if (!apiKey || apiKey.startsWith('xsmtpsib') === false) {
        console.warn('[Email] Valid Brevo API Key not found. Falling back to log-only mode.');
        console.log('--- Email Content ---');
        console.log('To:', options.email);
        console.log('Subject:', options.subject);
        console.log('--------------------');
        return { messageId: 'log-only' };
    }

    console.log(`[Email] Sending via Brevo HTTP API to: ${options.email}`);

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { 
                    name: 'CredVault', 
                    email: fromEmail || 'noreply@credvault.com' 
                },
                to: [{ email: options.email }],
                subject: options.subject,
                htmlContent: options.message
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('[Email] Success! Message ID:', data.messageId);
            return data;
        } else {
            console.error('[Email] Brevo API Error:', data.message || data);
            throw new Error(data.message || 'Brevo API request failed');
        }
    } catch (error) {
        console.error('[Email] Critical error:', error.message);
        throw new Error(`Email failed: ${error.message}`);
    }
};

module.exports = sendEmail;




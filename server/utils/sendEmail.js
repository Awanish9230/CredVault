const sendEmail = async (options) => {
    const apiKey = (process.env.SMTP_PASSWORD || '').trim();
    const fromEmail = (process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL || '').trim();

    if (!apiKey) {
        console.warn('[Email] SMTP_PASSWORD (API Key) is missing.');
        return { messageId: 'missing-key' };
    }

    console.log(`[Email] Sending via Brevo API | From: ${fromEmail} | To: ${options.email}`);

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                sender: { 
                    name: 'CredVault', 
                    email: fromEmail 
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
            console.error('[Email] Brevo API Error Detail:', JSON.stringify(data));
            
            if (data.code === 'unauthorized' || data.message === 'Key not found') {
                console.error('[Email] CRITICAL: The API Key is invalid or the Sender Email is not verified in Brevo.');
            }
            
            throw new Error(data.message || 'Brevo API error');
        }
    } catch (error) {
        console.error('[Email] Error:', error.message);
        throw new Error(`Email failed: ${error.message}`);
    }
};

module.exports = sendEmail;






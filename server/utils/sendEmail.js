const sendEmail = async (options) => {
    // Ensure API Key is trimmed of any hidden spaces
    const apiKey = (process.env.SMTP_PASSWORD || '').trim();
    const fromEmail = (process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL || '').trim();

    if (!apiKey || apiKey.startsWith('xsmtpsib') === false) {
        console.warn('[Email] Valid Brevo API Key not found. Please ensure SMTP_PASSWORD is set in Render.');
        return { messageId: 'log-only' };
    }

    console.log(`[Email] Sending via Brevo API | From: ${fromEmail} | To: ${options.email}`);

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                'accept': 'application/json'
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
            // "Key not found" often means the sender email is not verified in Brevo
            console.error('[Email] Brevo API Error:', data.message || data.code || 'Unknown Error');
            if (data.message === 'Key not found' || data.code === 'unauthorized') {
                console.error('[Email] IMPORTANT: Check if ' + fromEmail + ' is a VERIFIED SENDER in your Brevo Dashboard.');
            }
            throw new Error(data.message || 'Brevo API request failed');
        }
    } catch (error) {
        console.error('[Email] Critical error:', error.message);
        throw new Error(`Email failed: ${error.message}`);
    }
};

module.exports = sendEmail;





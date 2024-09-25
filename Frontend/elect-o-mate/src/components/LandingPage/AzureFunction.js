const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const formData = req.body;

    // Construct email body
    const emailBody = `
        New form submission:
        Name: ${formData.name}
        Email: ${formData.email}
        LinkedIn/Twitter: ${formData.social}
        Role/Organization: ${formData.role || formData.organization || 'N/A'}
        Country of Interest: ${formData.country || 'N/A'}
        Comment: ${formData.comment}
    `;

    // Send email using SendGrid (you'll need to set up SendGrid first)
    const sendGridKey = process.env.SENDGRID_API_KEY;
    
    try {
        await axios.post('https://api.sendgrid.com/v3/mail/send', {
            personalizations: [{ to: [{ email: 'info@electomate.com' }] }],
            from: { email: 'noreply@yourdomain.com' },
            subject: 'New Interest Form Submission',
            content: [{ type: 'text/plain', value: emailBody }]
        }, {
            headers: {
                'Authorization': `Bearer ${sendGridKey}`,
                'Content-Type': 'application/json'
            }
        });

        context.res = {
            status: 200,
            body: "Form submitted successfully"
        };
    } catch (error) {
        context.log.error('Error sending email:', error);
        context.res = {
            status: 500,
            body: "An error occurred while submitting the form"
        };
    }
};
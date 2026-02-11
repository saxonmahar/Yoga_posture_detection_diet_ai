# 📧 Email Providers Setup Guide

Your YogaAI application supports multiple email providers. Choose the one that best fits your needs:

## 🏠 **For Personal/Development Use**

### Option 1: Gmail (Free)
**Best for:** Personal projects, development, testing

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM_NAME=YogaAI - Yoga Posture Detection
```

**Setup Steps:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Generate App Password for "YogaAI"
4. Use the 16-character password in `EMAIL_PASS`

---

## 🏢 **For Production/Business Use**

### Option 2: Custom SMTP (Any Provider)
**Best for:** Using your own email server or any SMTP provider

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@your-domain.com
SMTP_PASS=your-smtp-password
EMAIL_FROM_NAME=YogaAI - Yoga Posture Detection
```

**Common SMTP Settings:**
- **Gmail:** `smtp.gmail.com:587` (use Gmail option instead)
- **Yahoo:** `smtp.mail.yahoo.com:587`
- **Outlook:** `smtp-mail.outlook.com:587`
- **Custom Domain:** Check with your hosting provider

### Option 3: SendGrid (Professional)
**Best for:** High-volume emails, reliable delivery

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
EMAIL_FROM_NAME=YogaAI - Yoga Posture Detection
```

**Setup Steps:**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your domain
3. Create API key with "Mail Send" permissions
4. Use the API key in `SENDGRID_API_KEY`

**Pricing:** Free tier: 100 emails/day

### Option 4: Mailgun (Professional)
**Best for:** Developer-friendly, good API

```env
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
MAILGUN_FROM_EMAIL=noreply@your-domain.com
EMAIL_FROM_NAME=YogaAI - Yoga Posture Detection
```

**Setup Steps:**
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Add and verify your domain
3. Get API key from dashboard
4. Use your verified domain

**Pricing:** Free tier: 5,000 emails/month for 3 months

### Option 5: AWS SES (Enterprise)
**Best for:** Large scale, AWS infrastructure

```env
EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@your-domain.com
EMAIL_FROM_NAME=YogaAI - Yoga Posture Detection
```

**Setup Steps:**
1. Set up AWS account
2. Configure SES in AWS Console
3. Verify your domain/email
4. Create IAM user with SES permissions
5. Use IAM credentials

**Pricing:** $0.10 per 1,000 emails

---

## 🚀 **Quick Setup for Different Scenarios**

### Scenario 1: "I just want to test locally"
Use Gmail with your personal account:
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=your-app-password
```

### Scenario 2: "I'm deploying for a client"
Use SMTP with their email provider:
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=mail.their-domain.com
SMTP_PORT=587
SMTP_USER=noreply@their-domain.com
SMTP_PASS=their-email-password
```

### Scenario 3: "I need professional email service"
Use SendGrid or Mailgun:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xyz...
SENDGRID_FROM_EMAIL=noreply@your-domain.com
```

### Scenario 4: "I'm building a SaaS product"
Use AWS SES for scalability:
```env
EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xyz...
SES_FROM_EMAIL=noreply@your-saas.com
```

---

## 🧪 **Testing Your Email Setup**

After configuring any provider:

1. **Update your `.env` file** with the chosen provider settings
2. **Restart your backend server**
3. **Test registration** with a real email address
4. **Check your inbox** for the verification email

Use the test files:
- `test-email-sending.html` - Test email functionality
- `test-email-system.html` - Complete system test

---

## 🔒 **Security Best Practices**

1. **Never commit credentials** to Git
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Use dedicated email addresses** for your app (like `noreply@your-domain.com`)
5. **Enable SPF/DKIM records** for your domain to improve deliverability

---

## 📊 **Provider Comparison**

| Provider | Cost | Setup Difficulty | Reliability | Best For |
|----------|------|------------------|-------------|----------|
| Gmail | Free | Easy | Good | Development |
| SMTP | Varies | Medium | Varies | Custom setups |
| SendGrid | Free tier | Easy | Excellent | Small business |
| Mailgun | Free tier | Easy | Excellent | Developers |
| AWS SES | Pay-per-use | Hard | Excellent | Enterprise |

---

## ❓ **Need Help?**

1. **Check the logs** - Backend will show email sending errors
2. **Test with simple SMTP first** - Easier to debug
3. **Verify your domain** - Many providers require domain verification
4. **Check spam folders** - Test emails might go to spam initially

Choose the option that best fits your needs and follow the setup guide for that provider!
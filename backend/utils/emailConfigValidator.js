// Email configuration validator
const validateEmailConfig = () => {
  const provider = process.env.EMAIL_PROVIDER || 'gmail';
  const errors = [];
  const warnings = [];

  switch (provider.toLowerCase()) {
    case 'gmail':
      if (!process.env.EMAIL_USER) {
        errors.push('EMAIL_USER is required for Gmail provider');
      }
      if (!process.env.EMAIL_PASS) {
        errors.push('EMAIL_PASS (Gmail App Password) is required for Gmail provider');
      }
      if (process.env.EMAIL_PASS === 'your-gmail-app-password-here') {
        warnings.push('EMAIL_PASS is still set to placeholder value');
      }
      break;

    case 'smtp':
      if (!process.env.SMTP_HOST) {
        errors.push('SMTP_HOST is required for SMTP provider');
      }
      if (!process.env.SMTP_USER) {
        errors.push('SMTP_USER is required for SMTP provider');
      }
      if (!process.env.SMTP_PASS) {
        errors.push('SMTP_PASS is required for SMTP provider');
      }
      break;

    case 'sendgrid':
      if (!process.env.SENDGRID_API_KEY) {
        errors.push('SENDGRID_API_KEY is required for SendGrid provider');
      }
      if (!process.env.SENDGRID_FROM_EMAIL) {
        errors.push('SENDGRID_FROM_EMAIL is required for SendGrid provider');
      }
      break;

    case 'mailgun':
      if (!process.env.MAILGUN_API_KEY) {
        errors.push('MAILGUN_API_KEY is required for Mailgun provider');
      }
      if (!process.env.MAILGUN_DOMAIN) {
        errors.push('MAILGUN_DOMAIN is required for Mailgun provider');
      }
      if (!process.env.MAILGUN_FROM_EMAIL) {
        errors.push('MAILGUN_FROM_EMAIL is required for Mailgun provider');
      }
      break;

    case 'ses':
      if (!process.env.AWS_ACCESS_KEY_ID) {
        errors.push('AWS_ACCESS_KEY_ID is required for AWS SES provider');
      }
      if (!process.env.AWS_SECRET_ACCESS_KEY) {
        errors.push('AWS_SECRET_ACCESS_KEY is required for AWS SES provider');
      }
      if (!process.env.SES_FROM_EMAIL) {
        errors.push('SES_FROM_EMAIL is required for AWS SES provider');
      }
      break;

    default:
      warnings.push(`Unknown email provider: ${provider}. Falling back to Gmail.`);
  }

  return {
    isValid: errors.length === 0,
    provider,
    errors,
    warnings
  };
};

// Log email configuration status
const logEmailConfigStatus = () => {
  const config = validateEmailConfig();
  
  console.log('\n📧 Email Configuration Status:');
  console.log(`Provider: ${config.provider}`);
  
  if (config.isValid) {
    console.log('✅ Email configuration is valid');
  } else {
    console.log('❌ Email configuration has errors:');
    config.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (config.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    config.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('📖 See EMAIL_PROVIDERS_GUIDE.md for setup instructions\n');
  
  return config;
};

module.exports = {
  validateEmailConfig,
  logEmailConfigStatus
};
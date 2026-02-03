const dns = require('dns').promises;

// Whitelist of trusted email domains
const TRUSTED_DOMAINS = [
  // Major providers
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'protonmail.com', 'proton.me',
  
  // Indian providers
  'rediffmail.com', 'sify.com', 'in.com', 'indiatimes.com',
  
  // Educational domains
  'edu', 'ac.in', 'edu.in', 'student.', 'university.',
  
  // Corporate domains (common ones)
  'company.com', 'corp.com', 'office.com'
];

// Blacklist of suspicious/temporary email domains
const SUSPICIOUS_DOMAINS = [
  // Temporary email services
  '10minutemail.com', 'tempmail.org', 'tempmail.com', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'temp-mail.org', 'temp-mail.com',
  'throwaway.email', 'getnada.com', 'maildrop.cc', 'sharklasers.com',
  'grr.la', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
  'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com',
  
  // Common fake domains
  'test.com', 'example.com', 'fake.com', 'dummy.com',
  'invalid.com', 'notreal.com', 'fakemail.com', 'fakefakedomain123.com',
  
  // More temporary services
  'mohmal.com', 'mytrashmail.com', 'no-spam.ws', 'nospam.ze.tc',
  'nowmymail.com', 'objectmail.com', 'obobbo.com', 'odnorazovoe.ru',
  'oneoffemail.com', 'onewaymail.com', 'opayq.com', 'ordinaryamerican.net'
];

// Enhanced email validation with regex
const validateEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

// Extract domain from email
const extractDomain = (email) => {
  return email.toLowerCase().split('@')[1];
};

// Check if domain is trusted
const isTrustedDomain = (domain) => {
  return TRUSTED_DOMAINS.some(trustedDomain => {
    if (trustedDomain.startsWith('.')) {
      return domain.endsWith(trustedDomain);
    }
    return domain === trustedDomain || domain.endsWith('.' + trustedDomain);
  });
};

// Check if domain is suspicious
const isSuspiciousDomain = (domain) => {
  return SUSPICIOUS_DOMAINS.some(suspiciousDomain => {
    return domain === suspiciousDomain || domain.endsWith('.' + suspiciousDomain);
  });
};

// Check if domain exists (DNS lookup)
const checkDomainExists = async (domain) => {
  try {
    await dns.resolveMx(domain);
    return true;
  } catch (error) {
    try {
      // Fallback to A record check
      await dns.resolve4(domain);
      return true;
    } catch (fallbackError) {
      return false;
    }
  }
};

// Main email validation function
const validateEmail = async (email) => {
  const result = {
    isValid: false,
    email: email.toLowerCase().trim(),
    errors: [],
    warnings: [],
    domain: null,
    checks: {
      format: false,
      domain: false,
      trusted: false,
      suspicious: false,
      exists: false
    }
  };

  // Basic format check
  if (!validateEmailFormat(email)) {
    result.errors.push('Invalid email format');
    return result;
  }
  result.checks.format = true;

  // Extract domain
  const domain = extractDomain(email);
  result.domain = domain;

  // Check for suspicious domains
  if (isSuspiciousDomain(domain)) {
    result.errors.push('Email domain is not allowed (temporary/fake email service)');
    result.checks.suspicious = true;
    return result;
  }

  // Check if domain is trusted
  if (isTrustedDomain(domain)) {
    result.checks.trusted = true;
  } else {
    result.warnings.push('Email domain is not in our trusted list');
  }

  // Check if domain exists
  try {
    const domainExists = await checkDomainExists(domain);
    result.checks.exists = domainExists;
    
    if (!domainExists) {
      result.errors.push('Email domain does not exist');
      return result;
    }
  } catch (error) {
    result.warnings.push('Could not verify domain existence');
  }

  // Final validation
  if (result.errors.length === 0) {
    result.isValid = true;
  }

  return result;
};

// Quick domain check (synchronous) - More restrictive approach
const quickDomainCheck = (email) => {
  if (!validateEmailFormat(email)) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  const domain = extractDomain(email);
  
  // First check: Block known suspicious domains
  if (isSuspiciousDomain(domain)) {
    return { isValid: false, reason: 'Suspicious or temporary email domain not allowed' };
  }

  // Second check: Allow trusted domains
  if (isTrustedDomain(domain)) {
    return { isValid: true, reason: 'Trusted email domain' };
  }

  // Third check: For unknown domains, be more restrictive
  // Block domains that look suspicious (very short, contain numbers, etc.)
  if (domain.length < 4 || /\d{3,}/.test(domain) || domain.includes('fake') || domain.includes('test')) {
    return { isValid: false, reason: 'Domain appears to be fake or suspicious' };
  }

  // Allow other domains but with a warning
  return { isValid: true, reason: 'Domain appears valid', warning: 'Domain not in trusted list - please verify' };
};

module.exports = {
  validateEmail,
  quickDomainCheck,
  validateEmailFormat,
  extractDomain,
  isTrustedDomain,
  isSuspiciousDomain,
  checkDomainExists,
  TRUSTED_DOMAINS,
  SUSPICIOUS_DOMAINS
};
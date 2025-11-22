const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function verifyTransport() {
  try {
    await transporter.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function baseWrapper(title, bodyLines) {
  const body = bodyLines.join('\n');
  const htmlLines = bodyLines.map(l => `<p style="margin:0 0 8px;">${l.replace(/\n/g,'<br/>')}</p>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>${title}</title></head><body style="font-family:Arial,sans-serif;background:#f8f9fa;padding:24px;">`+
    `<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:32px;">`+
    `<h2 style="font-size:20px;margin:0 0 16px;color:#111827;">${title}</h2>`+
    `${htmlLines}`+
    `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>`+
    `<p style="font-size:12px;color:#6b7280;">This is an automated message from Price Monitor. Do not reply.</p>`+
    `</div></body></html>`;
  return { text: body, html };
}

function buildTemplate(type, data = {}) {
  switch (type) {
    case 'test': {
      const subject = 'Price Monitor — Email Test';
      const lines = [
        'Hello,',
        'This confirms your email configuration is working.',
        `Timestamp: ${new Date().toISOString()}`
      ];
      return { subject, ...baseWrapper(subject, lines) };
    }
    case 'forgot_password': {
      const subject = 'Price Monitor — Temporary Password';
      const lines = [
        `Hello ${data.name || ''},`,
        'A temporary password has been generated for your account.',
        `Temporary Password: ${data.temp}`,
        'Use it to sign in and immediately change your password in settings.'
      ];
      return { subject, ...baseWrapper(subject, lines) };
    }
    case 'reset_password_admin': {
      const subject = 'Price Monitor — Password Reset by Admin';
      const lines = [
        `Hello ${data.name || ''},`,
        'An administrator reset your password.',
        `Temporary Password: ${data.temp}`,
        'Please log in and update your password.'
      ];
      return { subject, ...baseWrapper(subject, lines) };
    }
    case 'alert_single': {
      const subject = `Price Monitor Alert — ${data.title}`;
      const lines = [
        `Hello ${data.name || ''},`,
        data.type === 'drop'
          ? `Price drop detected: ${data.oldPrice} → ${data.newPrice}`
          : `Price now below threshold: ${data.newPrice}`,
        data.url ? `Product Link: ${data.url}` : '',
        'Visit your dashboard for details.'
      ].filter(Boolean);
      return { subject, ...baseWrapper(subject, lines) };
    }
    case 'alert_digest': {
      const subject = `Price Monitor — ${data.count} Alert(s) for ${data.label}`;
      const itemLines = data.items.map(i => {
        if (i.type === 'drop') return `• ${i.title} | Drop: ${i.oldPrice} → ${i.newPrice}`;
        return `• ${i.title} | Price: ${i.newPrice}`;
      });
      const lines = [
        `Hello ${data.name || ''},`,
        `${data.count} alert(s) were generated for ${data.label}:`,
        ...itemLines,
        'Review your dashboard for more information.'
      ];
      return { subject, ...baseWrapper(subject, lines) };
    }
    default: {
      const subject = 'Price Monitor Notification';
      return { subject, ...baseWrapper(subject, ['Notification']) };
    }
  }
}

async function sendEmail({ to, subject, text, html, type, data }) {
  if (type && !subject) {
    const tpl = buildTemplate(type, data);
    subject = tpl.subject;
    text = tpl.text;
    html = tpl.html;
  }
  const mailOptions = { from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text, html };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail, verifyTransport, buildTemplate };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendPasswordResetEmail(opts: {
  to: string;
  name?: string;
  resetUrl: string;
}) {
  const { to, name, resetUrl } = opts;

  const subject = "Reset your password – Cinema E-Booking";
  const text = `Hi ${name || "there"},

We received a request to reset your password.
If you made this request, click the link below to set a new password:

${resetUrl}

If you didn't request this, you can ignore this email.`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:32px 0;color:#fff"><div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;padding:24px"><h1 style="margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-0.5px">Cinema E-Booking</h1><p style="color:#d1d5db;margin:0 0 12px">Hi ${escapeHtml(name || "there")},</p><p style="margin:0 0 16px">We received a request to reset your password.</p><a href="${resetUrl}" style="display:inline-block;background:#ba0c2f;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700">Reset your password</a><p style="color:#d1d5db;margin:16px 0 0">If you didn't request this, you can safely ignore this email.</p></div></div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    text,
    html,
  });
}

export async function sendRegistrationEmail(opts: {
  to: string;
  name: string;
}) {
  const { to, name } = opts;

  const subject = "You have registered – Cinema E-Booking";
  const text = `Hi ${name || "there"},

You have been registered!
Thanks for creating an account with the Cinema E-Booking.

Visit the site: ${process.env.APP_URL || ""}`;

  const appUrl = process.env.APP_URL || "";
  const visitLink = appUrl ? `<a href="${appUrl}" style="display:inline-block;background:#ba0c2f;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700">Visit the site</a>` : "";
  
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:32px 0;color:#fff"><div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;padding:24px"><h1 style="margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-0.5px">Cinema E-Booking</h1><p style="color:#d1d5db;margin:0 0 12px">Hi ${escapeHtml(name) || "there"},</p><p style="margin:0 0 16px"><strong>You have registered.</strong><br/>Thanks for creating an account with Cinema E-Booking.</p>${visitLink}</div></div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    text,
    html,
  });
}

export async function sendProfileChangeEmail(opts: {
  to: string;
  name: string;
}) {
  const { to, name } = opts;

  const subject = "Profile Updated – Cinema E-Booking";
  const text = `Hi ${name || "there"},

Your profile has been successfully updated!
If you did not make this change, please contact our support team immediately.

Visit the site: ${process.env.APP_URL || ""}`;

  const appUrl = process.env.APP_URL || "";
  const visitLink = appUrl ? `<a href="${appUrl}" style="display:inline-block;background:#ba0c2f;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700">Visit the site</a>` : "";
  
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:32px 0;color:#fff"><div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;padding:24px"><h1 style="margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-0.5px">Cinema E-Booking</h1><p style="color:#d1d5db;margin:0 0 12px">Hi ${escapeHtml(name) || "there"},</p><p style="margin:0 0 16px"><strong>Your profile has been successfully updated!</strong><br/>If you did not make this change, please contact our support team immediately.</p>${visitLink}</div></div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    text,
    html,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

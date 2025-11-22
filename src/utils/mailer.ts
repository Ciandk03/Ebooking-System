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

export async function sendVerificationEmail(opts: {
  to: string;
  name: string;
  verifyUrl: string;
}) {
  const { to, name, verifyUrl } = opts;

  const subject = "Verify your email – Cinema E-Booking";
  const text = `Hi ${name || "there"},

Please confirm your email to activate your Cinema E-Booking account.
Click the link below to finish setting things up:

${verifyUrl}

If you didn't create this account, you can ignore this email.`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:32px 0;color:#fff"><div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;padding:24px"><h1 style="margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-0.5px">Cinema E-Booking</h1><p style="color:#d1d5db;margin:0 0 12px">Hi ${escapeHtml(name) || "there"},</p><p style="margin:0 0 16px">Please confirm your email so we can activate your account.</p><a href="${verifyUrl}" style="display:inline-block;background:#ba0c2f;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700">Verify email</a><p style="color:#d1d5db;margin:16px 0 0">If you didn't create this account, feel free to ignore this message.</p></div></div>`;

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

export async function sendPromotionEmail(opts: {
  to: string;
  name?: string;
  code: string;
  startDate: string;
  endDate: string;
  discount: number;
}) {
  const { to, name, code, startDate, endDate, discount } = opts;

  const subject = `Promotion: ${code} - ${discount}% off`; 
  const text = `Hi ${name || 'there'},\n\nWe've launched a promotion: use code ${code} to get ${discount}% off between ${startDate} and ${endDate}.\n\nEnjoy the movies!`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:32px 0;color:#fff"><div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;padding:24px"><h1 style="margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-0.5px">Cinema E-Booking</h1><p style="color:#d1d5db;margin:0 0 12px">Hi ${escapeHtml(name || 'there')},</p><p style="margin:0 0 16px">Good news — we've just launched a promotion.</p><p style="background:#111;padding:12px;border-radius:8px;color:#fff;font-weight:700">Code: ${code} — ${discount}% off</p><p style="margin:8px 0 16px;color:#d1d5db">Valid: ${startDate} – ${endDate}</p><a href="${process.env.APP_URL || '#'}" style="display:inline-block;background:#ba0c2f;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700">Use the code on Cinema E-Booking</a><p style="color:#d1d5db;margin:16px 0 0">Enjoy the show!</p></div></div>`;

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

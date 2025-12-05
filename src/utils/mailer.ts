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
  discount: number;
  startDate?: string;
  endDate?: string;
}) {
  const { to, name, code, discount, startDate, endDate } = opts;

  const appUrl = process.env.APP_URL || '';
  const displayName = name || 'there';

  const periodText =
    startDate && endDate
      ? `This offer is valid from ${startDate} to ${endDate}.`
      : '';

  const subject = `New promotion – save ${discount}% on your next booking`;
  const text = `Hi ${displayName},

We've just launched a new promotion at Cinema E-Booking!

Use promo code ${code} to save ${discount}% on eligible tickets.
${periodText}

${appUrl ? `Book now at: ${appUrl}` : ''}

You are receiving this email because you subscribed to promotions. You can update your preferences in your profile.`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:24px;color:#e5e7eb">
  <div style="max-width:600px;margin:0 auto;background:#0b0b0b;border-radius:12px;border:1px solid #2a2a2a;padding:24px">
    <h1 style="margin:0 0 12px;font-size:24px;color:#f9fafb">New Promotion Just For You 🎬</h1>
    <p style="margin:0 0 12px;color:#d1d5db">Hi ${escapeHtml(displayName)},</p>
    <p style="margin:0 0 12px;color:#d1d5db">
      We've just launched a new promotion at <strong>Cinema E-Booking</strong>!
    </p>
    <p style="margin:0 0 12px;color:#fbbf24">
      <strong>Promo code:</strong>
      <span style="font-family:monospace">${escapeHtml(code)}</span><br />
      <strong>Discount:</strong> ${discount}% off
    </p>
    ${periodText
      ? `<p style="margin:0 0 12px;color:#9ca3af">${escapeHtml(periodText)}</p>`
      : ''
    }
    ${appUrl
      ? `<p style="margin:0 0 16px">
        <a href="${appUrl}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ba0c2f;color:#f9fafb;font-weight:600;text-decoration:none">
          Book now
        </a>
      </p>`
      : ''
    }
    <p style="margin:16px 0 0;font-size:12px;color:#6b7280">
      You are receiving this email because you subscribed to promotions.
      You can update your preferences any time in your profile.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    text,
    html,
  });
}

export async function sendBookingConfirmationEmail(opts: {
  to: string;
  name?: string;
  bookingId: string;
  movieTitle?: string;
  totalPrice: number;
  seats: string[];
}) {
  const { to, name, bookingId, movieTitle, totalPrice, seats } = opts;

  const subject = `Your booking is confirmed – #${bookingId}`;

  const text = `Hi ${name || "there"},

Your booking has been confirmed!

Booking number: ${bookingId}
Movie: ${movieTitle || "Movie"}
Seats: ${seats.length ? seats.join(", ") : "N/A"}
Total: $${totalPrice.toFixed(2)}

Thank you for choosing Cinema E-Booking!`;

  const appUrl = process.env.APP_URL || "";
  const manageLink = appUrl ? `<a href="${appUrl}/dashboard" style="display:inline-block;padding:10px 18px;margin-top:16px;background:#ba0c2f;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">View your bookings</a>` : "";

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#050608;padding:24px;">
      <div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:16px;padding:24px;">
        <h1 style="margin:0 0 8px;color:#ffffff;font-size:22px;letter-spacing:0.3px;">
          Booking Confirmed 🎟️
        </h1>
        <p style="margin:0 0 12px;color:#d1d5db;">
          Hi ${escapeHtml(name || "there")},
        </p>
        <p style="margin:0 0 16px;color:#d1d5db;">
          Your booking has been successfully processed. Here are your details:
        </p>

        <div style="background:#050608;border-radius:12px;padding:16px;border:1px solid #2a2a2a;margin-bottom:16px;">
          <p style="margin:0 0 8px;color:#ffffff;">
            <strong>Booking number:</strong> ${escapeHtml(bookingId)}
          </p>
          ${movieTitle
      ? `<p style="margin:0 0 8px;color:#d1d5db;"><strong>Movie:</strong> ${escapeHtml(
        movieTitle
      )}</p>`
      : ""
    }
          <p style="margin:0 0 8px;color:#d1d5db;">
            <strong>Seats:</strong> ${seats.length ? escapeHtml(seats.join(", ")) : "N/A"
    }
          </p>
          <p style="margin:0;color:#ffffff;font-weight:600;">
            <strong>Total:</strong> $${totalPrice.toFixed(2)}
          </p>
        </div>

        <p style="margin:0 0 16px;color:#9ca3af;font-size:14px;">
          You can view or manage your bookings from your account dashboard.
        </p>
        ${manageLink}
      </div>
    </div>
  `;

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

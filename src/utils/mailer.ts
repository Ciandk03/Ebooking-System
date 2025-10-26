import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

//Main function to send a simple registration email
export async function sendRegistrationEmail(opts: {
  to: string;
  name: string;
}) {
  const { to, name } = opts;

  const subject = "You have registered — Cinema E-Booking";
  const text = `Hi ${name || "there"},

You have been registered!
Thanks for creating an account with the Cinema E-Booking.

Visit the site: ${process.env.APP_URL || ""}`;

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#000;padding:32px 0;color:#fff">
    <div style="max-width:560px;margin:0 auto;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;padding:24px">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-0.5px">Cinema E-Booking</h1>
      <p style="color:#d1d5db;margin:0 0 12px">Hi ${escapeHtml(name) || "there"},</p>
      <p style="margin:0 0 16px"><strong>You have registered.</strong><br/>Thanks for creating an account with Cinema E-Booking.</p>
      ${
        process.env.APP_URL
          ? `<a href="${process.env.APP_URL}" style="display:inline-block;background:#ba0c2f;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700">Visit the site</a>`
          : ""
      }
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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Withdrawal function (distansavtalslagen 2 kap. 10 a §).
// Receives name, order number and receipt email, sends the withdrawal to info@ and a
// timestamped receipt to the customer, through HUSKI EYEWEAR's own one.com mailbox.
// Needs WITHDRAW_SMTP_USER and WITHDRAW_SMTP_PASS in Vercel. Without them it answers 503
// and the page falls back to the mail link.
const nodemailer = require('nodemailer');

const INBOX = 'info@huskieyewear.com';

function clean(v, max) {
  return String(v || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (body.website) return res.status(200).json({ ok: true }); // honeypot: bots fill every field

  const name = clean(body.name, 120);
  const order = clean(body.order, 40);
  const email = clean(body.email, 160);
  if (!name || !order || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'fields' });
  }
  if (!process.env.WITHDRAW_SMTP_USER || !process.env.WITHDRAW_SMTP_PASS) {
    return res.status(503).json({ ok: false, error: 'not-configured' });
  }

  const now = new Date();
  const stamp = now.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });
  const transport = nodemailer.createTransport({
    host: 'send.one.com', port: 465, secure: true,
    auth: { user: process.env.WITHDRAW_SMTP_USER, pass: process.env.WITHDRAW_SMTP_PASS },
  });

  const facts =
    `Name / Namn: ${name}\n` +
    `Order: ${order}\n` +
    `Receipt to / Kvitto till: ${email}\n` +
    `Received / Mottaget: ${stamp} (Stockholm)\n`;

  try {
    await transport.sendMail({
      from: `HUSKI EYEWEAR <${process.env.WITHDRAW_SMTP_USER}>`,
      to: INBOX,
      replyTo: email,
      subject: `Withdrawal / Ångrat köp – order ${order}`,
      text: `A customer has withdrawn from a purchase on huskieyewear.com.\n\n${facts}`,
    });
    await transport.sendMail({
      from: `HUSKI EYEWEAR <${process.env.WITHDRAW_SMTP_USER}>`,
      to: email,
      replyTo: INBOX,
      subject: `Receipt: your withdrawal / Kvitto: du har ångrat ditt köp – order ${order}`,
      text:
        `We have received your withdrawal from the purchase.\n` +
        `Vi har tagit emot att du ångrar ditt köp.\n\n${facts}\n` +
        `We will contact you about the return.\nVi hör av oss om returen.\n\nHUSKI EYEWEAR\n${INBOX}`,
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'send' });
  }
  return res.status(200).json({ ok: true, received: now.toISOString(), stamp });
};

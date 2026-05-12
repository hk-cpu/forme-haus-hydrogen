/**
 * Transactional email — Formé Haus
 * Sends via Resend (resend.com). All links point strictly to formehaus.me.
 *
 * Required env var: RESEND_API_KEY
 * Sender domain:    configure "orders@formehaus.me" in Resend dashboard
 */

const STORE_URL = 'https://formehaus.me';
const FROM = 'Formé Haus <orders@formehaus.me>';
const RESEND_API = 'https://api.resend.com/emails';

// ── HTML template ─────────────────────────────────────────────────────────────

function orderConfirmationHtml(data: {
  firstName: string;
  orderName: string;
  items: Array<{title: string; quantity: number; price: string}>;
  total: string;
  currency: string;
  paymentMethod?: string;
  tapChargeId: string;
}): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2a2520;font-family:Georgia,serif;font-size:13px;color:#d4c4b4;">
          ${item.title}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2520;text-align:center;font-family:Arial,sans-serif;font-size:13px;color:#8B8076;">
          ×${item.quantity}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2520;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#d4c4b4;">
          ${item.price} ${data.currency}
        </td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Order Confirmed — Formé Haus</title>
</head>
<body style="margin:0;padding:0;background:#121212;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#121212;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${STORE_URL}" style="text-decoration:none;">
                <span style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.25em;color:#d4c4b4;text-transform:uppercase;">Formé Haus</span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1a1a1a;border-radius:12px;padding:40px 36px;border:1px solid #2a2520;">

              <!-- Check icon -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;border-radius:50%;background:rgba(168,116,65,0.12);border:1px solid rgba(168,116,65,0.25);display:inline-flex;align-items:center;justify-content:center;line-height:64px;text-align:center;">
                      <span style="font-size:28px;color:#a87441;line-height:64px;">✓</span>
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom:6px;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#8B8076;font-family:Arial,sans-serif;">
                      Order Placed
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;color:#f0e8de;font-weight:normal;">
                      Thank you, ${data.firstName}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0;font-size:13px;color:#8B8076;line-height:1.6;">
                      Your order <strong style="color:#a87441;">${
                        data.orderName
                      }</strong> has been placed and paid successfully.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="border-top:1px solid #2a2520;padding-bottom:24px;"></td></tr>

                <!-- Items -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemRows}
                    </table>
                  </td>
                </tr>

                <!-- Total -->
                <tr>
                  <td style="padding-top:16px;padding-bottom:28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-family:Georgia,serif;font-size:14px;color:#d4c4b4;">Total Paid</td>
                        <td align="right" style="font-family:Georgia,serif;font-size:16px;color:#a87441;font-weight:bold;">
                          ${data.total} ${data.currency}
                        </td>
                      </tr>
                      ${
                        data.paymentMethod
                          ? `<tr>
                        <td colspan="2" style="padding-top:6px;font-family:Arial,sans-serif;font-size:11px;color:#6B6058;letter-spacing:0.1em;text-transform:uppercase;">
                          Paid via ${data.paymentMethod}
                        </td>
                      </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>

                <!-- CTA buttons -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${STORE_URL}/account"
                       style="display:inline-block;background:#a87441;color:#fff;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:4px;">
                      View My Orders
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${STORE_URL}/collections/all"
                       style="display:inline-block;color:#8B8076;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:10px 0;border-bottom:1px solid #2a2520;">
                      Continue Shopping
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="border-top:1px solid #2a2520;padding-bottom:20px;"></td></tr>

                <!-- Transaction ref -->
                <tr>
                  <td align="center">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#4a4540;letter-spacing:0.1em;">
                      Reference: ${data.tapChargeId}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 0 0;">
              <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;color:#4a4540;letter-spacing:0.1em;">
                Need help?
                <a href="${STORE_URL}/contact" style="color:#8B8076;text-decoration:underline;">Contact us</a>
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#3a3530;letter-spacing:0.05em;">
                © ${new Date().getFullYear()} Formé Haus FH Establishment · Registered in Saudi Arabia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function sendOrderConfirmation(
  resendApiKey: string,
  data: {
    toEmail: string;
    firstName: string;
    orderName: string;
    items: Array<{title: string; quantity: number; price: string}>;
    total: string;
    currency: string;
    paymentMethod?: string;
    tapChargeId: string;
  },
): Promise<void> {
  const html = orderConfirmationHtml(data);

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [data.toEmail],
      subject: `Order Placed ${data.orderName} — Formé Haus`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[Email] Resend error:', res.status, body);
  } else {
    console.log(`[Email] Order confirmation sent to ${data.toEmail}`);
  }
}

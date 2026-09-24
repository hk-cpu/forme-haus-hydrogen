# Payment marks

These files are copied unmodified from Shopify's open-source
[`payment_icons`](https://github.com/activemerchant/payment_icons) library
(`app/assets/images/payment_icons/`), MIT-licensed — see `LICENSE.txt`. It is
the same artwork Shopify shows at checkout, which is why it is used here
instead of hand-drawn approximations.

| File             | Upstream file   |
| ---------------- | --------------- |
| `mada.svg`       | `mada.svg`      |
| `stc-pay.svg`    | `stcpay.svg`    |
| `apple-pay.svg`  | `apple_pay.svg` |
| `visa.svg`       | `visa.svg`      |
| `mastercard.svg` | `master.svg`    |
| `tamara.svg`     | `tamara.svg`    |

Do not recolour, crop or redraw them. The brand marks themselves are
trademarks of their owners, and Apple in particular requires the Apple Pay
mark to be used unaltered.

To add a method, copy its SVG from the same upstream folder and add an entry
to `PAYMENT_MARKS` in `app/components/PaymentBadges.tsx`.

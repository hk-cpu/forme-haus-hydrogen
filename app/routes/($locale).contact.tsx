import {motion} from 'framer-motion';
import {Send} from 'lucide-react';
import {Form, useActionData, useNavigation} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {getSeoMeta} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    seo: {
      title: 'Contact Us',
      titleTemplate: '%s | Formé Haus',
      description:
        'Get in touch with Formé Haus for styling guidance, order inquiries, or just to say hello.',
    },
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  // We'll use the EN fallback for server-side error messages since we don't have
  // access to the client's selected locale in the action without extra work.
  // The UI will show these briefly before the contact page re-renders with translations.
  if (!name || !email || !subject || !message) {
    return json(
      {error: 'Please fill in all fields.'},
      {status: 400},
    );
  }

  try {
    const body = new URLSearchParams({
      form_type: 'contact',
      utf8: '✓',
      'contact[name]': name,
      'contact[email]': email,
      'contact[subject]': subject,
      'contact[body]': message,
    });

    const res = await fetch(
      `https://${context.env.PUBLIC_STORE_DOMAIN}/contact`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body.toString(),
      },
    );

    if (!res.ok && res.status >= 500) {
      return json(
        {error: 'Unable to send message. Please try again.'},
        {status: 500},
      );
    }

    return json({success: true});
  } catch {
    return json(
      {error: 'Unable to send message. Please try again.'},
      {status: 500},
    );
  }
}

export default function ContactPage() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const submitted = actionData?.success === true;
  const {t, isRTL} = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Content */}
      <section className="relative py-12 px-6 md:px-12 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#a87441] mb-4 block">
              Experience the Haus
            </span>
            <h1 className="font-serif text-4xl md:text-6xl italic text-[#4A3C31] mb-6">
              {t('contact.title')}
            </h1>
          </motion.div>

          <p className="text-[15px] leading-relaxed text-[#5C5046] max-w-2xl mx-auto mb-12">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Contact Form */}
        <div>
          <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-6">
            {t('contact.sendMessage')}
          </h2>

          {actionData?.error && (
            <motion.div
              initial={{opacity: 0, y: -8}}
              animate={{opacity: 1, y: 0}}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-[13px] text-red-700 text-center"
            >
              {actionData.error}
            </motion.div>
          )}

          {submitted ? (
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              className="bg-[#a87441]/10 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#a87441]/20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-[#a87441]" />
              </div>
              <h3 className="font-serif text-xl text-[#4A3C31] mb-2">
                {t('contact.messageSent')}
              </h3>
              <p className="text-[13px] text-[#8B8076]">
                {t('contact.thankYou')}
              </p>
            </motion.div>
          ) : (
            <Form method="post" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2"
                  >
                    {t('contact.yourName')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    placeholder={t('contact.yourName')}
                    className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 text-[#4A3C31] outline-none focus:border-[#a87441] placeholder:text-[#8B8076]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2"
                  >
                    {t('contact.emailAddress')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 text-[#4A3C31] outline-none focus:border-[#a87441] placeholder:text-[#8B8076]/40"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2"
                >
                  {t('contact.subject')}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 text-[#4A3C31] outline-none focus:border-[#a87441]"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2"
                >
                  {t('contact.yourMessage')}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 text-[#4A3C31] outline-none focus:border-[#a87441] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4A3C31] text-white py-4 rounded-lg font-medium text-[13px] uppercase tracking-wider hover:bg-[#a87441] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.sendMessageButton')}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </Form>
          )}
        </div>

        {/* Right: Info Cards */}
        <div className="space-y-6">
          {/* Email Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">
              {t('contact.emailUs')}
            </h3>
            <p className="text-[13px] text-[#8B8076] mb-4">
              {t('contact.emailReply')}
            </p>
            <a
              href="mailto:info@formehaus.me"
              className="text-[#a87441] font-medium text-[13px]"
            >
              {t('contact.sendEmail')}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">
              {t('contact.whatsapp')}
            </h3>
            <p className="text-[13px] text-[#8B8076] mb-4">
              {t('contact.whatsappDesc')}
            </p>
            <a
              href="https://wa.me/966533954066"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#a87441] font-medium text-[13px]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('contact.chatOnWhatsApp')}
            </a>
          </div>

          {/* Store Hours */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">
              {t('contact.storeHours')}
            </h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#8B8076]">{t('contact.sunThu')}</span>
                <span className="text-[#4A3C31] font-medium">
                  9:00 AM - 9:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B8076]">{t('contact.friSat')}</span>
                <span className="text-[#4A3C31] font-medium">
                  2:00 PM - 10:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* New Ways to Connect */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-2">
              {t('contact.newWays')}
            </h3>
            <p className="text-[13px] text-[#8B8076] mb-4">
              {t('contact.newWaysDesc')}
            </p>
            <ul className="space-y-2 text-[13px] text-[#5C5046]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a87441]" />
                {t('contact.liveChat')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a87441]" />
                {t('contact.orderUpdates')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  if (!name || !email || !subject || !message) {
    return json({error: 'Please fill in all fields.'}, {status: 400});
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

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
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
              Connect With Us
            </h1>
          </motion.div>

          <p className="text-[15px] leading-relaxed text-[#5C5046] max-w-2xl mx-auto mb-12">
            Our dedicated team is here to assist with styling advice, order
            inquiries, or any questions you may have about our curated
            collections.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Contact Form */}
        <div>
          <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-6">
            Send a Message
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
                Message Sent!
              </h3>
              <p className="text-[13px] text-[#8B8076]">
                Thank you for reaching out. We&apos;ll respond within 24 hours.
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
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 text-[#4A3C31] outline-none focus:border-[#a87441] placeholder:text-[#8B8076]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2"
                  >
                    Email Address
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
                  Subject
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
                  Your Message
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
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
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
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">Email Us</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">
              We&apos;ll get back to you as soon as possible.
            </p>
            <a
              href="mailto:support@formehaus.me"
              className="text-[#a87441] font-medium text-[13px]"
            >
              support@formehaus.me
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">WhatsApp</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">
              Message us directly for quick support.
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
              Chat on WhatsApp
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">Instagram</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">
              Follow us for the latest drops and styling inspiration.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <a
                href="https://www.instagram.com/formee.haus"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src="/brand/ig-post-1.webp"
                  alt="Instagram post"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
              <a
                href="https://www.instagram.com/formee.haus"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src="/brand/ig-post-2.webp"
                  alt="Instagram post"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
              <a
                href="https://www.instagram.com/formee.haus"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src="/brand/ig-post-3.webp"
                  alt="Instagram post"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>
            <a
              href="https://www.instagram.com/formee.haus"
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
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @formee.haus
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

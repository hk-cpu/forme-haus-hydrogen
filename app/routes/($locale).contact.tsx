import {motion} from 'framer-motion';
import {Clock, Instagram, Send} from 'lucide-react';
import {Form, useActionData, useNavigation} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

export async function loader({context}: LoaderFunctionArgs) {
  return json({storeDomain: context.env.PUBLIC_STORE_DOMAIN});
}

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

    // Shopify returns 200/302 on success, 4xx on error
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

export const handle = {
  seo: {
    title: 'Contact Us | Formé Haus',
    description:
      'Get in touch with Formé Haus for styling guidance, order inquiries, or just to say hello.',
  },
};

export default function ContactPage() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const submitted = actionData?.success === true;

  return (
    <div className="bg-[#F9F5F0] min-h-[calc(100vh-64px)] flex flex-col justify-center">
      {/* Main Content Grid */}
      <section className="px-6 md:px-12 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Page Title — inline above grid */}
          <div className="mb-5 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#a87441] block mb-1">
              Experience the Haus
            </span>
            <h1 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31]">
              Connect With Us
            </h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Contact Form */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
          >
            <h2 className="font-serif text-lg italic text-[#4A3C31] mb-1">
              Send a Message
            </h2>
            <p className="text-[11px] text-[#8B8076] mb-3">
              Fill out the form below and we&apos;ll get back to you shortly.
            </p>

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
                  Thank you for reaching out. We&apos;ll respond within 24
                  hours.
                </p>
              </motion.div>
            ) : (
              <Form method="post" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3
                        text-[#4A3C31] placeholder-[#8B8076]/50
                        focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20
                        transition-all outline-none"
                      placeholder="Your full name"
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
                      name="email"
                      type="email"
                      required
                      className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3
                        text-[#4A3C31] placeholder-[#8B8076]/50
                        focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20
                        transition-all outline-none"
                      placeholder="your@email.com"
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
                    name="subject"
                    type="text"
                    required
                    className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3
                      text-[#4A3C31] placeholder-[#8B8076]/50
                      focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20
                      transition-all outline-none"
                    placeholder="How can we help?"
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
                    rows={2}
                    className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3
                      text-[#4A3C31] placeholder-[#8B8076]/50 resize-none
                      focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20
                      transition-all outline-none"
                    placeholder="Tell us how we can assist you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4A3C31] text-white py-3 rounded-lg font-medium text-[13px] uppercase tracking-wider
                    hover:bg-[#a87441] transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
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
          </motion.div>

          {/* Right: Coming Soon & Instagram */}
          <motion.div
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="space-y-3"
          >
            {/* Instagram Follow */}
            <div className="bg-white rounded-2xl p-4 border border-[#8B8076]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400
                    flex items-center justify-center"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#4A3C31]">
                      @formee.haus
                    </h3>
                    <p className="text-[11px] text-[#8B8076]">
                      Follow our journey
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.instagram.com/formee.haus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#121212] text-white text-[11px] uppercase tracking-wider rounded-lg
                    hover:bg-[#a87441] transition-colors"
                >
                  Follow
                </a>
              </div>

              <p className="text-[12px] text-[#5C5046] leading-relaxed mb-3">
                Discover the latest collections, editorial inspiration, and
                behind-the-scenes moments.
              </p>

              {/* Instagram Post Previews */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {url: 'https://www.instagram.com/p/DR_9yG3DKpr/', img: '/editorial/contact-hero-1.webp'},
                  {url: 'https://www.instagram.com/p/DR_96jbjCDY/', img: '/editorial/contact-hero-2.webp'},
                  {url: 'https://www.instagram.com/p/DR_9_GYDFpD/', img: '/editorial/contact-hero-3.webp'},
                ].map(({url, img}, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden relative group"
                  >
                    <img
                      src={img}
                      alt={`Formé Haus Instagram post ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Store Hours */}
            <div className="bg-[#F5F0EB] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#a87441]" />
                <span className="text-[11px] uppercase tracking-wider text-[#4A3C31]">
                  Customer Service Hours
                </span>
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#8B8076]">Sunday - Thursday</span>
                  <span className="text-[#4A3C31] font-medium">
                    9:00 AM - 9:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B8076]">Friday - Saturday</span>
                  <span className="text-[#4A3C31] font-medium">
                    2:00 PM - 10:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* New Ways to Connect */}
            <div className="bg-white rounded-2xl p-4 border border-[#8B8076]/10">
              <h3 className="font-serif text-base italic text-[#4A3C31] mb-1">
                New Ways to Connect
              </h3>
              <p className="text-[12px] text-[#5C5046] leading-relaxed mb-3">
                We&apos;re expanding how we connect with you to offer a more seamless and personalized experience.
              </p>
              <ul className="space-y-1.5">
                {['Live Chat', 'Order Updates'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[12px] text-[#8B8076]">
                    <span className="w-1 h-1 rounded-full bg-[#a87441]/50 shrink-0" />
                    {item}
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-[#a87441]/60">
                      Coming Soon
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

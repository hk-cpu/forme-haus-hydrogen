import {motion} from 'framer-motion';
import {
  Mail,
  Clock,
  Instagram,
  MessageCircle,
  ArrowRight,
  Send,
} from 'lucide-react';
import {Form, useActionData, useNavigation} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {useTranslation} from '~/hooks/useTranslation';

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

// Animation variants
const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.6, ease: [0.22, 1, 0.36, 1] as const},
  },
};

export default function ContactPage() {
  const {t} = useTranslation();
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const submitted = actionData?.success === true;

  const contactMethods = [
    // WhatsApp hidden until business number is available
    // {
    //   icon: MessageCircle,
    //   title: 'WhatsApp',
    //   description: 'Instant messaging for quick queries',
    //   value: '+966 XX XXX XXXX',
    //   href: 'https://wa.me/966XXXXXXXXX',
    //   action: 'Chat on WhatsApp',
    // },
    {
      icon: Mail,
      title: 'Email Us',
      description: "We'll get back to you as soon as possible",
      value: 'info@formehaus.me',
      href: 'mailto:info@formehaus.me',
      action: 'Send Email',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* Editorial Gallery Hero */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm"
          >
            {/* Main Image - Top Left (Large Landscape) */}
            <div className="md:col-span-3 md:row-span-2 relative group overflow-hidden rounded-xl aspect-[16/10]">
              <img 
                src="/editorial/contact-hero-1.png" 
                alt="Formé Haus Editorial" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Tall Image - Right (Narrow Vertical) */}
            <div className="md:col-span-1 md:row-span-3 relative group overflow-hidden rounded-xl">
              <img 
                src="/editorial/contact-hero-2.png" 
                alt="Formé Haus Lifestyle" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Bottom Left - Small Detail (Square-ish) */}
            <div className="md:col-span-1 relative group overflow-hidden rounded-xl aspect-square">
              <img 
                src="/editorial/contact-hero-3.png" 
                alt="Editorial Detail" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Bottom Center - Lifestyle (Wide Rectangle) */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-xl aspect-[16/8]">
              <img 
                src="/editorial/contact-hero-4.png" 
                alt="Luxury Lifestyle" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
          </motion.div>
        </div>
      </section>

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

          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, delay: 0.2}}
            className="text-[15px] leading-relaxed text-[#5C5046] max-w-2xl mx-auto mb-12"
          >
            Our dedicated team is here to assist with styling advice, order inquiries, 
            or any questions you may have about our curated collections.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods Grid - 2 Cards */}
      <section className="px-6 md:px-12 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true}}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {contactMethods.map((method) => (
            <motion.a
              key={method.title}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={
                method.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 border border-[#8B8076]/10
                hover:border-[#a87441]/30 hover:shadow-xl hover:shadow-[#a87441]/5
                transition-all duration-500"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a87441]/10 to-[#a87441]/5
                flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <method.icon className="w-6 h-6 text-[#a87441]" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl text-[#4A3C31] mb-2">
                {method.title}
              </h3>
              <p className="text-[13px] text-[#8B8076] mb-4">
                {method.description}
              </p>
              <p className="text-[15px] font-medium text-[#4A3C31] mb-6">
                {method.value}
              </p>

              {/* Action */}
              <div className="flex items-center gap-2 text-[#a87441] text-[12px] uppercase tracking-wider">
                <span>{method.action} &rarr;</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hover Glow */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#a87441]/5 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <section className="px-6 md:px-12 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact Form */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
          >
            <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-2">
              Send a Message
            </h2>
            <p className="text-[13px] text-[#8B8076] mb-8">
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
              <Form method="post" className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      placeholder="Sarah Al-Rashid"
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
                      placeholder="sarah@example.com"
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
                    rows={5}
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
                  className="w-full bg-[#4A3C31] text-white py-4 rounded-lg font-medium text-[13px] uppercase tracking-wider
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
            className="space-y-10"
          >
            {/* Instagram Follow */}
            <div className="bg-white rounded-2xl p-8 border border-[#8B8076]/10">
              <div className="flex items-center justify-between mb-6">
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

              <p className="text-[13px] text-[#5C5046] leading-relaxed">
                Discover the latest collections, editorial inspiration, and
                behind-the-scenes moments.
              </p>

              {/* Instagram Posts Links - Hidden until real feed is available */}
              {/* 
              <div className="grid grid-cols-3 gap-2 mt-6">
                {[
                  'https://www.instagram.com/p/DR_9yG3DKpr/',
                  'https://www.instagram.com/p/DR_96jbjCDY/',
                  'https://www.instagram.com/p/DR_9_GYDFpD/',
                ].map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#a87441]/20 via-[#8B5E3C]/15 to-[#4A3C31]/20 flex items-center justify-center group hover:from-[#a87441]/30 hover:to-[#4A3C31]/30 transition-all duration-300"
                  >
                    <Instagram className="w-6 h-6 text-[#a87441]/60 group-hover:text-[#a87441] group-hover:scale-110 transition-all duration-300" />
                  </a>
                ))}
              </div>
              */}
            </div>

            {/* Store Hours */}
            <div className="bg-[#F5F0EB] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
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
          </motion.div>
        </div>
      </section>

      {/* Bottom Brand Statement */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className="max-w-2xl mx-auto"
        >
          <img
            src="/brand/logo-icon-only.png"
            alt="Formé Haus"
            className="h-12 w-auto mx-auto mb-6 opacity-60"
          />
          <p className="font-serif text-xl italic text-[#4A3C31]">
            Luxury is in the details.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

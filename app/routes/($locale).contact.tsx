import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  MessageCircle,
  ArrowRight,
  Send
} from 'lucide-react';
import { useTranslation } from '~/hooks/useTranslation';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ContactPage() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our concierge team',
      value: '800 123 456',
      href: 'tel:+966800123456',
      action: 'Call Now',
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'We respond within 24 hours',
      value: 'care@formehaus.com',
      href: 'mailto:care@formehaus.com',
      action: 'Send Email',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Instant messaging for quick queries',
      value: '+966 50 000 0000',
      href: 'https://wa.me/966500000000',
      action: 'Chat Now',
    },
  ];

  const comingSoonChannels = [
    { name: 'Live Chat', description: 'Real-time support on our website' },
    { name: 'Video Call', description: 'Personal styling consultations' },
    { name: 'SMS Updates', description: 'Order notifications via text' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* Hero Section - Brand Story */}
      <section className="relative py-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#a87441] mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-6xl italic text-[#4A3C31] mb-6">
              We're Here for You
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[15px] leading-relaxed text-[#5C5046] max-w-2xl mx-auto mb-12"
          >
            At Formé Haus, we believe luxury is personal. Whether you're seeking styling advice, 
            have questions about an order, or simply want to share your experience, our dedicated 
            team in Riyadh is ready to assist you with the warmth and attention you deserve.
          </motion.p>

          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-[#8B8076]/10"
          >
            <MapPin className="w-4 h-4 text-[#a87441]" />
            <span className="text-[12px] uppercase tracking-wider text-[#4A3C31]">
              Riyadh, Kingdom of Saudi Arabia
            </span>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="px-6 md:px-12 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.href}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 border border-[#8B8076]/10 
                hover:border-[#a87441]/30 hover:shadow-xl hover:shadow-[#a87441]/5
                transition-all duration-500"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a87441]/10 to-[#a87441]/5 
                flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <method.icon className="w-6 h-6 text-[#a87441]" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl text-[#4A3C31] mb-2">{method.title}</h3>
              <p className="text-[13px] text-[#8B8076] mb-4">{method.description}</p>
              <p className="text-[15px] font-medium text-[#4A3C31] mb-6">{method.value}</p>

              {/* Action */}
              <div className="flex items-center gap-2 text-[#a87441] text-[12px] uppercase tracking-wider">
                <span>{method.action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#a87441]/5 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <section className="px-6 md:px-12 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-2">
              Send us a Message
            </h2>
            <p className="text-[13px] text-[#8B8076] mb-8">
              Fill out the form below and we'll get back to you shortly.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#a87441]/10 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#a87441]/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-[#a87441]" />
                </div>
                <h3 className="font-serif text-xl text-[#4A3C31] mb-2">Message Sent!</h3>
                <p className="text-[13px] text-[#8B8076]">
                  Thank you for reaching out. We'll respond within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 
                        text-[#4A3C31] placeholder-[#8B8076]/50
                        focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20 
                        transition-all outline-none"
                      placeholder="Sarah Al-Rashid"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 
                        text-[#4A3C31] placeholder-[#8B8076]/50
                        focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20 
                        transition-all outline-none"
                      placeholder="sarah@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 
                      text-[#4A3C31] placeholder-[#8B8076]/50
                      focus:border-[#a87441] focus:ring-1 focus:ring-[#a87441]/20 
                      transition-all outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
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
              </form>
            )}
          </motion.div>

          {/* Right: Coming Soon & Instagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {/* Coming Soon Communications */}
            <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-2xl p-8 text-white relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#a87441]/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#a87441]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441]">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-serif text-2xl italic mb-4">New Ways to Connect</h3>
                <p className="text-[13px] text-[#AA9B8F] mb-6 leading-relaxed">
                  We're expanding our communication channels to serve you better. 
                  Stay tuned for these exciting additions:
                </p>

                <div className="space-y-4">
                  {comingSoonChannels.map((channel) => (
                    <div key={channel.name} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#a87441] mt-2" />
                      <div>
                        <p className="text-[14px] font-medium text-[#F0EAE6]">{channel.name}</p>
                        <p className="text-[12px] text-[#8B8076]">{channel.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instagram Follow */}
            <div className="bg-white rounded-2xl p-8 border border-[#8B8076]/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 
                    flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#4A3C31]">@formehaus</h3>
                    <p className="text-[11px] text-[#8B8076]">Follow our journey</p>
                  </div>
                </div>
                <a
                  href="https://instagram.com/formehaus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#121212] text-white text-[11px] uppercase tracking-wider rounded-lg
                    hover:bg-[#a87441] transition-colors"
                >
                  Follow
                </a>
              </div>

              <p className="text-[13px] text-[#5C5046] leading-relaxed">
                Discover the latest collections, behind-the-scenes moments, and exclusive 
                styling inspiration. Join our community of discerning fashion enthusiasts.
              </p>

              {/* Instagram Preview Grid */}
              <div className="grid grid-cols-4 gap-2 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-[#F5F0EB] flex items-center justify-center
                      hover:bg-[#a87441]/10 transition-colors cursor-pointer"
                  >
                    <Instagram className="w-5 h-5 text-[#8B8076]/30" />
                  </div>
                ))}
              </div>
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
                  <span className="text-[#4A3C31] font-medium">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B8076]">Friday - Saturday</span>
                  <span className="text-[#4A3C31] font-medium">2:00 PM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Brand Statement */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <img
            src="/brand/logo-icon-only.png"
            alt="Formé Haus"
            className="h-12 w-auto mx-auto mb-6 opacity-60"
          />
          <p className="font-serif text-xl italic text-[#4A3C31] mb-4">
            "Luxury is in the details, and every detail matters."
          </p>
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#8B8076]">
            Formé Haus — Riyadh
          </p>
        </motion.div>
      </section>
    </div>
  );
}

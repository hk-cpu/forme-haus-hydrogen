import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import GhostCursorEnhanced from '~/components/GhostCursorEnhanced';

// 3D Floating Element Component
function FloatingElement({ 
  children, 
  delay = 0
}: { 
  children: React.ReactNode; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}

      className="absolute first:top-[20%] first:left-[5%] [&:nth-child(2)]:top-[40%] [&:nth-child(2)]:right-[5%] [&:nth-child(3)]:top-[70%] [&:nth-child(3)]:left-[60%]"
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{ 
          duration: 6 + delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Abstract 3D Shape
function AbstractShape({ 
  color = "#a87441", 
  size = 200,
  delay = 0 
}: { 
  color?: string; 
  size?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ 
        rotate: 360,
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
          filter: 'blur(40px)'
        }}
      />
      <div 
        className="absolute inset-4 rounded-full border-2 border-dashed opacity-40"
        style={{ borderColor: color }}
      />
      <div 
        className="absolute inset-8 rounded-full opacity-20"
        style={{ background: color }}
      />
    </motion.div>
  );
}

// Contact Method Card
function ContactCard({ 
  icon: Icon, 
  title, 
  value, 
  href,
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string;
  href?: string;
  delay?: number;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ x: 10 }}
      className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#a87441]/30 transition-all duration-500 cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a87441]/20 to-[#8B5E3C]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6 text-[#a87441]" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">{title}</p>
        <p className="text-white font-light tracking-wide">{value}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#a87441]">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    </motion.div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }
  return content;
}

// Story Section
function StorySection({ 
  title, 
  children, 
  align = 'left' 
}: { 
  title: string; 
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`max-w-xl ${align === 'right' ? 'ml-auto text-right' : ''}`}
    >
      <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">{title}</h3>
      <div className="h-px w-20 bg-gradient-to-r from-[#a87441] to-transparent mb-6" />
      <div className="text-white/70 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Enhanced Ghost Cursor */}
      <GhostCursorEnhanced
        primaryColor="#000000"
        secondaryColor="#a87441"
        brightness={1.3}
        bloomStrength={0.3}
        hoverIntensity={2.5}
        mixBlendMode="screen"
      />

      {/* Parallax Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#a87441]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8B5E3C]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-black/50 rounded-full blur-[100px]" />
      </motion.div>

      {/* 3D Floating Abstract Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingElement delay={0}>
          <AbstractShape color="#a87441" size={300} />
        </FloatingElement>
        <FloatingElement delay={1}>
          <AbstractShape color="#8B5E3C" size={200} />
        </FloatingElement>
        <FloatingElement delay={2}>
          <AbstractShape color="#D4AF87" size={150} />
        </FloatingElement>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[#a87441] text-xs uppercase tracking-[0.4em] mb-6"
            >
              Get In Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight"
            >
              Let's Create
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a87441] via-[#D4AF87] to-[#a87441]">
                Something Beautiful
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Whether you have a question about our collections, need styling advice, 
              or want to explore a bespoke collaboration, we're here to listen.
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-2 bg-[#a87441] rounded-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Story Section - The Atelier */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <StorySection title="The Atelier Awaits">
              <p className="mb-4">
                Every piece from Formé Haus begins with a conversation. Our atelier in Riyadh 
                is more than a workspace—it's where vision transforms into textile, where 
                sketches become silhouettes that drape elegantly across the discerning woman.
              </p>
              <p>
                We invite you to begin your journey with us. Whether you're seeking the perfect 
                ensemble for a special occasion or wish to explore our made-to-measure services, 
                our dedicated client advisors are ready to guide you.
              </p>
            </StorySection>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-32 px-6 bg-gradient-to-b from-transparent via-[#a87441]/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif text-white text-center mb-16"
            >
              Connect With Us
            </motion.h2>

            <div className="space-y-4">
              <ContactCard
                icon={Mail}
                title="Email"
                value="concierge@formehaus.com"
                href="mailto:concierge@formehaus.com"
                delay={0}
              />
              <ContactCard
                icon={Phone}
                title="Phone"
                value="+966 50 000 0000"
                href="tel:+966500000000"
                delay={0.1}
              />
              <ContactCard
                icon={MapPin}
                title="Visit Us"
                value="Riyadh, Kingdom of Saudi Arabia"
                delay={0.2}
              />
              <ContactCard
                icon={Clock}
                title="Hours"
                value="Sun - Thu: 10:00 AM - 8:00 PM"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-serif text-white mb-2">Send a Message</h2>
              <p className="text-white/50 mb-8">We typically respond within 24 hours</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#a87441] focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#a87441] focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#a87441] focus:bg-white/10 transition-all duration-300"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#a87441] focus:bg-white/10 transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-[#a87441] to-[#8B5E3C] text-white rounded-xl font-medium tracking-wider uppercase text-sm flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(168,116,65,0.4)] transition-shadow duration-500"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Footer Quote */}
        <section className="py-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <blockquote className="text-2xl md:text-4xl font-serif text-white/90 leading-relaxed italic">
              "Elegance is not about being noticed, 
              <br />
              it's about being remembered."
            </blockquote>
            <p className="mt-6 text-[#a87441] text-sm uppercase tracking-[0.3em]">
              — Formé Haus
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

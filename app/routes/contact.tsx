import {motion} from 'framer-motion';
import type {Route} from './+types/contact';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Contact | Formé Haus'},
    {name: 'description', content: 'Experience the Haus. Connect with our dedicated team.'}
  ];
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* Editorial Gallery Hero */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[900px] bg-white p-4 rounded-3xl shadow-sm"
          >
            {/* Main Image - Top Left (Large Landscape) */}
            <div className="md:col-span-3 md:row-span-2 relative group overflow-hidden rounded-xl">
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
            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-xl h-[300px] md:h-auto">
              <img 
                src="/editorial/contact-hero-3.png" 
                alt="Editorial Detail" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Bottom Center - Lifestyle (Wide Rectangle) */}
            <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-xl h-[300px] md:h-auto">
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

          <p className="text-[15px] leading-relaxed text-[#5C5046] max-w-2xl mx-auto mb-12">
            Our dedicated team is here to assist with styling advice, order inquiries, 
            or any questions you may have about our curated collections.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">Your Name</label>
                <input type="text" name="name" className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 outline-none focus:border-[#a87441]" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">Email Address</label>
                <input type="email" name="email" className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 outline-none focus:border-[#a87441]" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">Subject</label>
              <input type="text" name="subject" className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 outline-none focus:border-[#a87441]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">Your Message</label>
              <textarea name="message" rows={5} className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 outline-none focus:border-[#a87441] resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#4A3C31] text-white py-4 rounded-lg font-medium text-[13px] uppercase tracking-wider hover:bg-[#a87441] transition-all">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">Email Us</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">We'll get back to you as soon as possible.</p>
            <a href="mailto:info@formehaus.me" className="text-[#a87441] font-medium border-b border-[#a87441]/30 pb-1">info@formehaus.me</a>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">Store Hours</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#8B8076]">Sun - Thu</span>
                <span className="text-[#4A3C31] font-medium">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B8076]">Fri - Sat</span>
                <span className="text-[#4A3C31] font-medium">2:00 PM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








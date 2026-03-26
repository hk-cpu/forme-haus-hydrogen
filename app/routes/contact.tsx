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
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm"
          >
            {/* Main Image - Top Left (Large Landscape) */}
            <div className="md:col-span-3 md:row-span-2 relative group overflow-hidden rounded-xl aspect-[16/10]">
              <img 
                src="/editorial/contact-hero-1.webp" 
                alt="Formé Haus Editorial" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Tall Image - Right (Narrow Vertical) */}
            <div className="md:col-span-1 md:row-span-3 relative group overflow-hidden rounded-xl">
              <img 
                src="/editorial/contact-hero-2.webp" 
                alt="Formé Haus Lifestyle" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Bottom Left - Small Detail (Square-ish) */}
            <div className="md:col-span-1 relative group overflow-hidden rounded-xl aspect-square">
              <img 
                src="/editorial/contact-hero-3.webp" 
                alt="Editorial Detail" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Bottom Center - Lifestyle (Wide Rectangle) */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-xl aspect-[16/8]">
              <img 
                src="/editorial/contact-hero-4.webp" 
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
                <input type="text" name="name" placeholder="Full Name" className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 outline-none focus:border-[#a87441] placeholder:text-[#8B8076]/40" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8B8076] mb-2">Email Address</label>
                <input type="email" name="email" placeholder="name@example.com" className="w-full bg-white border border-[#8B8076]/20 rounded-lg px-4 py-3 outline-none focus:border-[#a87441] placeholder:text-[#8B8076]/40" />
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

        <div className="space-y-6">
          {/* Email Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">Email Us</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">We'll get back to you as soon as possible.</p>
            <a href="mailto:info@formehaus.me" className="text-[#a87441] font-medium text-[13px]">Send email</a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-4">WhatsApp</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">Message us directly for quick support.</p>
            <a
              href="https://wa.me/966533954066"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#a87441] font-medium text-[13px]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Store Hours */}
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

          {/* New Ways to Connect */}
          <div className="bg-white p-8 rounded-2xl border border-[#8B8076]/10">
            <h3 className="font-serif text-xl text-[#4A3C31] mb-2">New Ways to Connect</h3>
            <p className="text-[13px] text-[#8B8076] mb-4">We're expanding how we connect with you to offer a more seamless and personalized experience.</p>
            <ul className="space-y-2 text-[13px] text-[#5C5046]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a87441]" />
                Live Chat
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a87441]" />
                Order Updates
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}








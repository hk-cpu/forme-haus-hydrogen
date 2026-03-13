import type {Route} from './+types/contact';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Contact | Formé Haus'}];
};

export default function ContactPage() {
  return (
    <div className="contact-page max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-sm text-gray-500 tracking-wider uppercase">Get in Touch</span>
        <h1 className="text-4xl font-medium mt-2">We're Here for You</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Whether you're looking for styling advice, need assistance with your order, 
          or want to learn more about our pieces, our dedicated team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-medium mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input type="text" name="name" placeholder="" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" placeholder="" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input type="text" name="subject" placeholder="" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
              <textarea name="message" rows={5} placeholder="" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white py-4 rounded-lg font-medium">Send Message</button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Email Us</h3>
            <a href="mailto:info@formehaus.me" className="text-black font-medium">info@formehaus.me</a>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Call Us</h3>
            <a href="tel:800123456" className="text-black font-medium text-lg">800 123 456</a>
          </div>
        </div>
      </div>
    </div>
  );
}








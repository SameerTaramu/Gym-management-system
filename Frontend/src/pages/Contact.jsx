import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
            Get In <br /> <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium">
            Have questions about our plans or facilities? Our team is here to help you kickstart your journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div className="grid sm:grid-cols-2 gap-10">
              
              <div className="group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Location</h3>
                <p className="text-lg font-bold">123 Fitness Street,<br />Butwal, Nepal</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Call Us</h3>
                <p className="text-lg font-bold">+977 9800000000</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</h3>
                <p className="text-lg font-bold">hello@gymrat.com</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <Clock size={24} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Hours</h3>
                <p className="text-sm font-bold">Mon - Fri: 5AM - 10PM</p>
                <p className="text-sm font-bold">Sat - Sun: 6AM - 8PM</p>
              </div>
            </div>
          </div>

          <div className="h-[500px] lg:h-full min-h-[400px] rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-2xl">
            <iframe
              title="Gym Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.313977123!2d83.4241724!3d27.6853504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996864275dca789%3A0x4468c2ec686167d4!2sButwal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
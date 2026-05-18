import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdMail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          
          <div className="max-w-sm">
            <Link to="/" className="text-3xl font-black tracking-tighter mb-6 block">
              GYMRAT<span className="text-orange-500">.</span>
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed">
              Redefining the fitness experience. High-performance coaching and state-of-the-art facilities designed for those who never quit.
            </p>
            <div className="flex gap-6 mt-8">
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black-400">Platform</h4>
              <Link to="/" className="text-sm font-bold hover:text-orange-500 transition-colors">Home</Link>
              <Link to="/plans" className="text-sm font-bold hover:text-orange-500 transition-colors">Plans</Link>
              <Link to="/bookings" className="text-sm font-bold hover:text-orange-500 transition-colors">Bookings</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black-400">Support</h4>
              <Link to="/contact" className="text-sm font-bold hover:text-orange-500 transition-colors">Contact</Link>
              <a href="mailto:info@gymrat.com" className="text-sm font-bold hover:text-orange-500 transition-colors">Email Us</a>
              <span className="text-sm font-bold text-gray-400 cursor-default">FAQs</span>
            </div>

            <div className="hidden sm:flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black-400">Legal</h4>
              <span className="text-sm font-bold text-black-400 cursor-default">Privacy</span>
              <span className="text-sm font-bold text-black-400 cursor-default">Terms</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              &copy; {new Date().getFullYear()} GymRat Athletic Club. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                System Status: Operational
              </span>
            </div>
          </div>

          
        </div>

      </div>
    </footer>
  );
};

export default Footer;
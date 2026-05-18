import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import cardioImg from "../assets/images/Workout1.jpg";
import strengthImg from "../assets/images/HIIT1.jpg";
import yogaImg from "../assets/images/Yoga1.jpg";

const Home = () => {
  const featuredClasses = [
    { id: 1, name: "Cardio", desc: "Energy and endurance.", image: cardioImg },
    { id: 2, name: "Strength", desc: "Muscle and power.", image: strengthImg },
    { id: 3, name: "Yoga", desc: "Balance and mind.", image: yogaImg },
  ];

  return (
    <div className="bg-white mt-20 text-black font-sans antialiased mb-20">
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-10">
            TRANSFORM <br /> 
            <span className="text-orange-500 decoration-1 underline-offset-8">BODY & MIND</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            The premium fitness experience in Nepal. <br /> Simple booking. Expert trainers. Real results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-black text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-gray-800 transition-all">
              Get Started
            </Link>
            <Link to="/plans" className="bg-gray-100 text-black px-10 py-5 rounded-full font-medium text-lg hover:bg-gray-200 transition-all">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredClasses.map((cls) => (
            <div key={cls.id} className="relative h-[500px] group overflow-hidden rounded-3xl bg-gray-100">
              <img 
                src={cls.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={cls.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-3xl font-bold text-white mb-2">{cls.name}</h3>
                <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{cls.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need <br /> to reach your goals.
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-2">Seamless Booking</h4>
              <p className="text-gray-500">Pick a class, Book a class, and show up. No friction, just fitness.</p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">Flexible Memberships</h4>
              <p className="text-gray-500">Monthly, quarterly, or yearly. Choose the path that fits your life.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-xs">About GymBooking</span>
          <p className="mt-8 text-2xl md:text-3xl font-medium leading-snug">
            We are building the future of fitness in Nepal. A single platform to book gym classes, hire trainers, and manage your health journey with absolute ease.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-black rounded-[3rem] p-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">Ready to join?</h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 group text-xl font-bold hover:text-orange-500 transition-colors"
          >
            Contact us for a free tour <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
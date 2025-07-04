import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaShippingFast, FaHeadset, FaChevronDown, FaChevronUp, FaQuoteLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  // Our features data
  const features = [
    {
      icon: <FaTrophy className="text-yellow-500" size={28} />,
      title: "High-Quality Gear",
      description: "We offer the best sports equipment with durability and performance in mind, sourced from trusted manufacturers worldwide."
    },
    {
      icon: <FaShippingFast className="text-blue-500" size={28} />,
      title: "Fast & Secure Delivery",
      description: "Get your orders quickly with our efficient and secure shipping service, with real-time tracking available."
    },
    {
      icon: <FaHeadset className="text-green-500" size={28} />,
      title: "24/7 Customer Support",
      description: "Our dedicated team is always available to assist you with any inquiries or issues you might encounter."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "SportX has been a game-changer for my training. Their quality is top-notch and their customer service is exceptional!",
      name: "Alex Johnson",
      position: "Professional Athlete",
      avatar: "/api/placeholder/60/60"
    },
    {
      quote: "Fast delivery and excellent customer service. The products are exactly as described and perform wonderfully. Highly recommended!",
      name: "Sarah Lee",
      position: "Fitness Instructor",
      avatar: "/api/placeholder/60/60"
    },
    {
      quote: "I've been shopping with SportX for years, and the quality and consistency has never wavered. Trustworthy and reliable!",
      name: "Michael Chen",
      position: "Sports Coach",
      avatar: "/api/placeholder/60/60"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide with competitive delivery rates. International shipping typically takes 7-14 business days, depending on the destination country and customs processing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, and various UPI payment options for your convenience and security."
    },
    {
      question: "How can I track my order?",
      answer: "You will receive a tracking link via email after your order is shipped. You can also log into your account on our website to view real-time updates on your order status."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and in resalable condition. Please contact our customer service for the return process."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section with Parallax Effect */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/chess-bg.jpg')" }}
          initial={{ scale: 1.1 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1 bg-blue-600 bg-opacity-80 rounded-full text-white text-sm font-medium mb-4">SINCE 2020</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-white mb-6" 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}>
            About <span className="text-blue-400">SportX</span>
          </motion.h1>
          
          <motion.p 
            className="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}>
            From preschool to pre-tertiary, our students enjoy fun, teamwork, active sports, and a commitment to think beyond the classroom.
          </motion.p>
          
          <motion.a
            href="#mission"
            className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Learn More
          </motion.a>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,160C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Mission & Vision Section with animated border */}
      <section id="mission" className="container mx-auto py-16 px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">OUR PURPOSE</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission & Vision</h2>
          
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-75 blur">
              {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-75 blur"></div>
            
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">At SportX, we strive to provide high-quality sports equipment and accessories that empower athletes of all levels to achieve their full potential. We believe in the transformative power of sports to build character, foster teamwork, and promote physical well-being.</p>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">To become the most trusted global destination for sports enthusiasts, offering innovative products and exceptional customer service that inspire athletic excellence and healthy lifestyles across communities worldwide.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Sets Us Apart</h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                variants={fadeInUp}
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">OUR JOURNEY</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">The SportX Story</h2>
            <p className="text-gray-600 mb-4">Founded in 2010 by a group of passionate sports enthusiasts, SportX began with a simple vision: to provide high-quality sports equipment that everyone could afford. What started as a small shop in downtown has now grown into a global brand serving athletes and sports lovers across the world.</p>
            <p className="text-gray-600 mb-4">Over the years, we've partnered with elite athletes, innovative manufacturers, and sports organizations to continuously refine our products and services. Our commitment to quality and customer satisfaction has been the cornerstone of our growth.</p>
            <p className="text-gray-600">Today, SportX stands as a testament to the power of passion, perseverance, and the profound impact that quality sports equipment can have on performance and enjoyment of sports at all levels.</p>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-lg overflow-hidden">
                <div className=" bg-gray-300">
                  <img src="/src/assets/images/main.jpg" alt="" />
                </div>
              </div>
              
              <div className="h-64 rounded-lg overflow-hidden mt-8">
                <div className=" bg-gray-300">
                  
                <img src="/src/assets/images/dash.jpg" alt="" />
                </div>
              </div>
              <div className="h-64 rounded-lg overflow-hidden -mt-16">
                <div className=" bg-gray-300">
                  
                <img src="/src/assets/images/playing_chess-wallpaper-2880x900.jpg" alt="" />
                </div>
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <div className=" bg-gray-300">
                  
                <img src="/src/assets/images/main2.png" alt="" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Our Customers Say</h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeInUp}
              >
                <FaQuoteLeft className="text-blue-400 mb-4" size={24} />
                <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-6">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-4"
              variants={fadeInUp}
            >
              <button 
                className={`w-full flex justify-between items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all ${openFaq === index ? 'bg-blue-50' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-left text-gray-800">{faq.question}</span>
                {openFaq === index ? 
                  <FaChevronUp className="text-blue-500" /> : 
                  <FaChevronDown className="text-gray-500" />
                }
              </button>
              
              {openFaq === index && (
                <div className="bg-white p-4 rounded-b-lg shadow-md border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-blue-600 bg-opacity-90 transform -skew-y-6"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center text-white max-w-2x8 mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-lg text-blue-100 mb-8">Our friendly team is here to help you with anything you need. Don't hesitate to reach out!</p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
          <br />
          <br />
          <br />
          <br />
          <br />
      <Footer />
    </div>
  );
};

export default AboutUs;
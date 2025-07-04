import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Best sports gear I've ever bought! High quality and great customer service.",
      author: "Jane D.",
      role: "Professional Athlete"
    },
    {
      quote: "Amazing products! My performance has improved thanks to this gear.",
      author: "Mark T.",
      role: "Tennis Coach"
    },
    {
      quote: "The quality is exceptional and the prices are very competitive!",
      author: "Sarah L.",
      role: "Basketball Player"
    }
  ];

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn && window.location.pathname === "/dashboard") {
      navigate("/login", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/fetch?limit=3");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError("Failed to load featured products.");
        }
      } catch (error) {
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  // Product card animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="h-20"></div>

      {/* Hero Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between p-12 mx-4 my-8 text-center md:text-left rounded-2xl shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="z-10 md:w-1/2 mb-8 md:mb-0">
          <motion.h2 
            className="text-xl font-bold text-white tracking-wide uppercase"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to the Ultimate Sports Experience
          </motion.h2>
          <motion.h1 
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Premium Sports Equipment
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg text-white font-light max-w-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Explore the latest, high-quality gear for every sport. Whether you're a professional or just starting, we have the perfect equipment for you!
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link to="/store" className="px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300">
              Shop Now
            </Link>
          </motion.div>
        </div>
        <motion.div 
          className="md:w-1/2 z-10 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <img
            src="/src/assets/images/dash.jpg"
            alt="Sports Gear"
            className="w-full rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl rotate-12">
            NEW!
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ y: -10 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Quality</h3>
            <p className="text-gray-600">We offer only the highest quality sports equipment that meets professional standards.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ y: -10 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert Support</h3>
            <p className="text-gray-600">Our team of sports enthusiasts is always ready to help you find the perfect gear.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ y: -10 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast Delivery</h3>
            <p className="text-gray-600">Enjoy quick shipping and hassle-free returns on all our products.</p>
          </motion.div>
        </div>
      </div>
      <img src="/src/assets/images/main2.png" alt="Explore Products" className="w-3/4 mx-auto mt-6 rounded-lg" />

      {/* Testimonials */}
      <div className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-wide mb-12">
            What Our Customers Say
          </h2>
          <div className="relative h-80">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonial}
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl">
                  <div className="text-5xl text-blue-500 font-serif mb-4">"</div>
                  <p className="text-xl italic text-gray-700 mb-6">{testimonials[activeTestimonial].quote}</p>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mb-2">
                      {testimonials[activeTestimonial].author.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{testimonials[activeTestimonial].author}</h3>
                    <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full ${activeTestimonial === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label={`View testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products (Dynamic) */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-wide text-gray-800 uppercase">
            Featured Sports Equipment
          </h2>
          <Link 
            to="/store" 
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
          >
            View All 
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="object-cover w-full h-56"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    NEW
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description || "High-quality sports equipment for professional athletes."}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                    <Link to={`/productdetail/${product.id}`}>
                      <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p className="text-xl text-gray-500">No featured products available.</p>
            <Link to="/store" className="mt-4 inline-block text-blue-600 hover:underline font-semibold">
              Browse our store instead
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white uppercase tracking-wide mb-6">
              Get Your Gear Today!
            </h2>
            <p className="text-xl text-white font-light max-w-2xl mx-auto mb-8">
              Don't miss out on our exclusive offers. Join thousands of satisfied athletes who trust our products.
            </p>
            <Link
              to="/store"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
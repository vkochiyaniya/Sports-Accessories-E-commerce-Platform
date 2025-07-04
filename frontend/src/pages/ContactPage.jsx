import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState({ state: null, message: "" });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setFormStatus({ state: "loading", message: "" });
    
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ 
          state: "success", 
          message: "Message sent successfully! We'll get back to you soon." 
        });
        reset(); // Clear the form
      } else {
        setFormStatus({ 
          state: "error", 
          message: result.error || "Failed to send message. Please try again." 
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({ 
        state: "error", 
        message: "Something went wrong. Please try again later." 
      });
    }
  };

  const contactInfo = [
    { 
      icon: <FaPhoneAlt size={20} />, 
      label: "Phone", 
      value: "+91 98356 23789", 
      subtext: "Mon-Fri, 9am-6pm",
      color: "bg-blue-100 text-blue-600"
    },
    { 
      icon: <FaEnvelope size={20} />, 
      label: "Email", 
      value: "sportx@support.com", 
      subtext: "We respond within 24 hours",
      color: "bg-green-100 text-green-600"
    },
    { 
      icon: <FaMapMarkerAlt size={20} />, 
      label: "Location", 
      value: "Camp Area, Bhuj - 370001", 
      subtext: "Gujarat, India",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const socialMedia = [
    { icon: <FaFacebook />, color: "bg-blue-600", hover: "hover:bg-blue-700" },
    { icon: <FaTwitter />, color: "bg-sky-500", hover: "hover:bg-sky-600" },
    { icon: <FaInstagram />, color: "bg-pink-600", hover: "hover:bg-pink-700" },
    { icon: <FaLinkedin />, color: "bg-blue-700", hover: "hover:bg-blue-800" }
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')]"></div>
        </div>
        <motion.div 
          className="container mx-auto h-full flex flex-col justify-center items-center text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <br />
          <br />
          <br />
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 flex items-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                variants={fadeIn}
              >
                <div className={`p-4 rounded-full ${item.color} mr-5`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{item.label}</h3>
                  <p className="text-gray-700">{item.value}</p>
                  <p className="text-gray-500 text-sm">{item.subtext}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Map with improved styling */}
            <motion.div 
              className="rounded-xl overflow-hidden shadow-lg bg-white p-4"
              variants={fadeIn}
            >
              <h3 className="font-bold text-gray-800 text-lg mb-3">Find Us</h3>
              <div className="h-56 md:h-64 rounded-lg overflow-hidden shadow-inner">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.002053052177!2d70.06517077428944!3d23.251678810878303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be045c2d62e72e7%3A0x7bcdfe7a55d3e5c1!2sCamp%20Area%2C%20Bhuj!5e0!3m2!1sen!2sin!4v1649505532421!5m2!1sen!2sin"
                  title="Our Location"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
            
            {/* Social Media */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              variants={fadeIn}
            >
              <h3 className="font-bold text-gray-800 text-lg mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className={`${social.color} ${social.hover} text-white p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">Send Us a Message</span>
                <div className="h-1 flex-grow bg-gradient-to-r from-blue-600 to-purple-600 rounded-full ml-3"></div>
              </h2>
              
              {formStatus.state === "success" && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>{formStatus.message}</p>
                </div>
              )}
              
              {formStatus.state === "error" && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>{formStatus.message}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    <input
                      id="firstName"
                      {...register("firstName", { required: "First name is required" })}
                      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter Your Name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      id="lastName"
                      {...register("lastName", { required: "Last name is required" })}
                      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter Your Last Name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="user99@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                  <input
                    id="phone"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit phone number",
                      },
                    })}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter Your Phone Number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    {...register("message", { required: "Message cannot be empty" })}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all ${errors.message ? 'border-red-500' : 'border-gray-300'} min-h-32`}
                    placeholder="Tell us how we can help you..."
                    rows="5"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      {errors.message.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform transition-all hover:-translate-y-1 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Message
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
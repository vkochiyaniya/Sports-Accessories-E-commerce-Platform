import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Ensure it's an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="h-20"></div>

      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center p-10 mx-4 text-center rounded-lg shadow-lg bg-gradient-to-r from-yellow-500 to-orange-600 md:flex-row md:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src="/src/assets/images/dash.jpg"
          alt="Sports Gear"
          className="w-1/2 rounded-lg md:w-1/3"
        />
        <div className="ml-0 md:ml-10">
          <h2 className="text-xl font-extrabold tracking-wide text-white uppercase">
            Welcome to the Ultimate Sports Gear Store!
          </h2>
          <h1 className="mt-4 text-4xl font-black text-white uppercase lg:text-5xl">
            Premium Sports Equipment
          </h1>
          <p className="mt-4 text-lg text-white font-light">
            Explore the latest, high-quality gear for every sport. Whether you're a professional or just starting, we have the perfect equipment for you!
          </p>
        </div>
      </motion.div>

      {/* Testimonials */}
      <div className="px-6 mt-12 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          What Our Customers Say
        </h2>
        <div className="flex justify-center gap-8 mt-6">
          <div className="w-1/3 p-6 mx-2 bg-white rounded-lg shadow-lg hover:shadow-xl">
            <p className="italic text-gray-600 font-light">
              "Best sports gear I’ve ever bought! High quality and great customer service."
            </p>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Jane D.</h3>
          </div>
          <div className="w-1/3 p-6 mx-2 bg-white rounded-lg shadow-lg hover:shadow-xl">
            <p className="italic text-gray-600 font-light">
              "Amazing products! My performance has improved thanks to this gear."
            </p>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Mark T.</h3>
          </div>
        </div>
        <img src="/src/assets/images/main.jpg" alt="Explore Products" className="w-3/4 mx-auto mt-6 rounded-lg" />
      </div>

      {/* Explore Section */}
      <div className="px-6 mt-6 text-center">
        <h2 className="text-3xl font-bold tracking-wide text-gray-800 uppercase">
          Explore Our Products
        </h2>
        <p className="mt-2 text-lg text-gray-600 font-light">
          Browse through our wide range of sports equipment for all your needs.
        </p>
        <div className="flex justify-center mt-4">
          <Link
            to="/store"
            className="px-8 py-3 text-lg font-bold text-white uppercase tracking-wider transition duration-300 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
          >
            Explore Products
          </Link>
        </div>
        <img src="/src/assets/images/main2.png" alt="Explore Products" className="w-3/4 mx-auto mt-6 rounded-lg" />
      </div>

      {/* Featured Products (Dynamic) */}
      <div className="px-6 mt-12">
        <h2 className="text-3xl font-extrabold tracking-wide text-gray-800 uppercase">
          Featured Sports Equipment
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading featured products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-3">
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={product.image || "/placeholder.jpg"} // Fallback image
                  alt={product.name}
                  className="object-cover w-full h-40 rounded-md"
                />
                <h3 className="mt-2 text-lg font-bold text-gray-800 uppercase">
                  {product.name}
                </h3>
                <p className="text-gray-600 font-semibold">${product.price}</p>
                <Link to="/store">
                  <button className="w-full py-2 mt-2 text-white font-bold uppercase tracking-wider transition bg-black rounded-md hover:bg-gray-800">
                    Buy Now
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No featured products available.</p>
        )}
      </div>

      {/* Call to Action */}
      <div className="px-6 py-10 mt-12 text-center bg-gradient-to-r from-green-500 to-blue-600">
        <h2 className="text-4xl font-black text-white uppercase tracking-wide">
          Get Your Gear Today!
        </h2>
        <p className="mt-4 text-lg text-white font-light">
          Don’t miss out on our exclusive offers.
        </p>
        <img src="/cta-gear.jpg" alt="Sports Gear" className="w-3/4 mx-auto mt-6 rounded-lg" />
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;

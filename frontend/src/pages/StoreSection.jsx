import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import Filters from "../components/Filters";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth, useUser } from "@clerk/clerk-react";

// === Search Context Setup ===
const SearchContext = createContext();
const useSearch = () => useContext(SearchContext);
const StoreSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ price: 799, color: "" });

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useCart();
  const { signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/fetch");
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err.response ? err.response.data : err.message);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (key, value) => {
    setSelectedFilters({ ...selectedFilters, [key]: value });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.price <= selectedFilters.price &&
      (selectedFilters.color === "" || product.color === selectedFilters.color) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {/* Navbar */}
      <motion.header
        className={`fixed top-0 left-0 z-50 flex items-center justify-between w-full px-6 py-4 transition-all ${
          isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
        } font-inter`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/src/assets/images/logo.jpg" alt="SportX Logo" className="h-10" />
        </div>

        <div className="items-center hidden gap-6 md:flex">
          <motion.input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileFocus={{ width: 200 }}
          />

          <nav className="flex gap-6 text-gray-900 dark:text-white">
            {["/dashboard", "/store", "/orders", "/contact", "/about-us"].map((path, index) => (
              <motion.button
                key={index}
                className="relative hover:text-blue-500 after:block after:h-[2px] after:bg-blue-500 after:w-0 hover:after:w-full after:transition-all"
                onClick={() => navigate(path)}
                whileHover={{ scale: 1.1 }}
              >
                {path.replace("/", "").toUpperCase()}
              </motion.button>
            ))}
          </nav>

          <FaShoppingCart
            className="text-xl text-blue-500 transition-transform cursor-pointer hover:scale-110"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          />

          <div className="relative">
            <FaUser
              className="text-2xl text-gray-700 transition-transform cursor-pointer hover:scale-110 dark:text-white"
              onClick={() => setUserDropdown(!userDropdown)}
              aria-label="User Profile"
            />
            <AnimatePresence>
              {userDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 w-64 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="w-16 h-16 border-2 border-gray-300 rounded-full"
                    />
                    <h2 className="mt-2 text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
                      {user?.fullName}
                    </h2>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 mt-4 text-center text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      <FaSignOutAlt className="inline-block mr-2" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <FaBars className="text-xl cursor-pointer" onClick={() => setMenuOpen(true)} />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed top-0 left-0 z-50 flex flex-col w-full h-full gap-6 p-6 bg-white dark:bg-gray-900"
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
            >
              <FaTimes className="self-end text-xl cursor-pointer" onClick={() => setMenuOpen(false)} />
              {["/dashboard", "/store", "/orders", "/contact", "/about-us"].map((path, index) => (
                <button key={index} className="hover:text-blue-500" onClick={() => navigate(path)}>
                  {path.replace("/", "").toUpperCase()}
                </button>
              ))}
              <FaShoppingCart
                className="text-xl text-blue-500 transition-transform cursor-pointer hover:scale-110"
                onClick={() => navigate("/cart")}
              />
              <button className="mt-4 text-lg font-bold text-red-600 hover:text-red-800" onClick={handleLogout}>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Store Section */}
      <div className="flex flex-col flex-grow p-6 mt-20 md:flex-row">
        <Filters selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
        <div className="grid flex-grow w-full grid-cols-2 gap-6 p-4 md:grid-cols-3 lg:grid-cols-4 md:w-3/4">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">Loading products...</p>
          ) : error ? (
            <p className="text-center text-red-600 col-span-full">{error}</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="flex flex-col h-full p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/productdetail/${product.id}`} className="flex flex-col flex-grow">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="object-cover w-full h-40 rounded-md"
                  />
                  <h3 className="mt-2 text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-600">₹{product.price}</p>
                </Link>
                <div className="flex gap-2 mt-2">
                  <button
                    className="w-full py-2 text-white bg-black rounded-md hover:bg-gray-800"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/productdetail/${product.id}`}
                    className="w-full py-2 text-center text-white bg-gray-700 rounded-md hover:bg-gray-600"
                  >
                    View
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No products found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
      <Footer />
    </SearchContext.Provider>
  );
};

export default StoreSection;

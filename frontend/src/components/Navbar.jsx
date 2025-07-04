import React, { useState, useEffect, createContext, useContext } from "react";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Access location
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
  }, [location.pathname]); // Close menu and dropdown when the page changes

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <motion.header
        className={`fixed top-0 left-0 z-50 flex items-center justify-between w-full px-6 py-4 transition-all ${
          isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
        } font-inter`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/src/assets/images/logo.jpg" alt="SportX Logo" className="h-10" />
        </div>

        {/* Desktop Menu */}
        <div className="items-center hidden gap-6 md:flex">
          {/* Search Bar */}
          <motion.input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
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

          {/* Icons */}
          <FaShoppingCart
            className="text-xl text-blue-500 transition-transform cursor-pointer hover:scale-110"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          />

          {/* User Profile Dropdown */}
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
  onClick={() => navigate("/profile")}
  className="w-full px-4 py-2 mt-4 text-center text-blue-500 bg-gray-100 rounded-lg hover:bg-gray-200"
>
  View Profile
</button>

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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <FaBars className="text-xl cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Open Menu" />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed top-0 left-0 z-50 flex flex-col w-full h-full gap-6 p-6 bg-white dark:bg-gray-900"
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
            >
              <FaTimes className="self-end text-xl cursor-pointer" onClick={() => setMenuOpen(false)} aria-label="Close Menu" />
              {["/dashboard", "/store", "/orders", "/contact", "/about-us"].map((path, index) => (
                <button key={index} className="hover:text-blue-500" onClick={() => navigate(path)}>
                  {path.replace("/", "").toUpperCase()}
                </button>
              ))}
              <FaShoppingCart
                className="text-xl text-blue-500 transition-transform cursor-pointer hover:scale-110"
                onClick={() => navigate("/cart")}
                aria-label="Cart"
              />
              <button className="mt-4 text-lg font-bold text-red-600 hover:text-red-800" onClick={handleLogout}>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </SearchContext.Provider>
  );
};

export default Navbar;

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold italic">SPORT X</h3>
          <p className="text-sm text-gray-400 mt-2">
            Your one-stop shop for premium sports equipment. Elevate your game with top-quality gear, unbeatable prices, and fast delivery.
          </p>
          <p className="mt-4 font-semibold">Camp Area, Bhuj 370001</p>
          <p className="text-gray-400">+99 99999 99999</p>
          <p className="text-gray-400">sportx@rku.ac.in</p>
        </div>

        {/* Shopping Section */}
        <div>
          <h3 className="text-lg font-semibold">SHOPPING</h3>
          <ul className="mt-2 text-gray-400 space-y-2">
            <li className="hover:text-white cursor-pointer">Your Cart</li>
            <li className="hover:text-white cursor-pointer">Your Orders</li>
            <li className="hover:text-white cursor-pointer">Shipping Details</li>
          </ul>
        </div>

        {/* More Links */}
        <div>
          <h3 className="text-lg font-semibold">MORE LINKS</h3>
          <ul className="mt-2 text-gray-400 space-y-2">
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Gift Center</li>
            <li className="hover:text-white cursor-pointer">Buying Guides</li>
            <li className="hover:text-white cursor-pointer">New Arrivals</li>
            <li className="hover:text-white cursor-pointer">Clearance</li>
          </ul>
        </div>

        {/* Promo Updates */}
        <div>
          <h3 className="text-lg font-semibold">PROMO UPDATES</h3>
          <div className="mt-2">
            <p className="text-gray-400 text-sm">14 May</p>
            <p className="font-semibold">50% off on MRF Cricket Bat</p>
            <p className="text-gray-500 text-xs">3 comments</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">15 July</p>
            <p className="font-semibold">80% Discount for New Users</p>
            <p className="text-gray-500 text-xs">3 comments</p>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>&copy; 2025 SportX. All Rights Reserved.</p>
        <div className="flex space-x-4 text-lg mt-4 md:mt-0">
          <FaFacebook className="cursor-pointer hover:text-blue-500" />
          <FaTwitter className="cursor-pointer hover:text-blue-400" />
          <FaInstagram className="cursor-pointer hover:text-pink-500" />
          <FaYoutube className="cursor-pointer hover:text-red-500" />
        </div>
      </div>
    </footer>
  );
}

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0));
  }, [cart]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow p-6 bg-gray-100">
        <h1 className="text-2xl font-bold">🛒 Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center mt-8">
            <p className="text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 mt-4 text-white bg-black rounded-md hover:bg-gray-800 transition"
            >
              Go Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-white rounded-lg shadow-lg">
                {/* Product Image */}
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                {/* Product Details */}
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 text-sm">{item.description || "No description available."}</p>
                  <p className="mt-2 text-lg font-medium">Price: ₹{item.price.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total Price and Actions */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</h2>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Clear Cart
                </button>
                <button
  onClick={(e) => {
    e.preventDefault(); // Prevent unexpected page reload
    navigate("/payment");
  }}
  className="px-6 py-2 text-white bg-black rounded-lg hover:bg-gray-800 transition"
>
  Proceed to Payment
</button>

              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;

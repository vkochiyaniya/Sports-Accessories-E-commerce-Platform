import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Address form fields
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: ""
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);

  // Calculate total amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const amountInPaise = Math.round(totalAmount * 100);

  // Fetch saved addresses on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const token = await getToken();
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/profile`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          if (response.data.defaultAddress) {
            try {
              const defaultAddress = JSON.parse(response.data.defaultAddress);
              setSavedAddresses([defaultAddress]);
              
              // Pre-fill form if user has a default address
              if (useDefaultAddress) {
                setShippingAddress(defaultAddress);
              }
            } catch (err) {
              console.error("Error parsing default address:", err);
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };
    
    fetchUserData();
  }, [user, getToken, useDefaultAddress]);

  // Handle address form changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Toggle using default address
  const handleUseDefaultAddress = () => {
    setUseDefaultAddress(!useDefaultAddress);
    if (!useDefaultAddress && savedAddresses.length > 0) {
      setShippingAddress(savedAddresses[0]);
    }
  };

  // Validate form before payment
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'phone'];
    
    requiredFields.forEach(field => {
      if (!shippingAddress[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    // Validate phone number (10 digits for India)
    if (shippingAddress.phone && !/^\d{10}$/.test(shippingAddress.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    
    // Validate postal code (6 digits for India)
    if (shippingAddress.postalCode && !/^\d{6}$/.test(shippingAddress.postalCode)) {
      errors.postalCode = "Postal code must be 6 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpay = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fill all required fields correctly"
      });
      return;
    }

    if (cart.length === 0) {
      setMessage({
        type: "error",
        text: "Your cart is empty"
      });
      return;
    }

    console.log("handleRazorpay called");
    setLoading(true);
    setMessage(null);

    try {
      console.log("Loading Razorpay script...");
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || typeof window.Razorpay === "undefined") {
        console.error("Razorpay SDK is not available");
        throw new Error("Razorpay SDK not available");
      }

      const token = await getToken();
      console.log("Clerk token fetched");

      if (!token) throw new Error("Authentication failed");

      // Create Razorpay order
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-razorpay-order`,
        { 
          amount: amountInPaise,
          shippingAddress,
          items: cart
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!data.razorpayOrderId || !data.amount) {
        throw new Error("Invalid Razorpay order data");
      }

      // Configure Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "SportX",
        description: "Purchase your sports gear",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          console.log("Payment successful:", response);
          try {
            // Verify the payment
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify-razorpay-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            
            console.log("Payment verification successful");
            clearCart();
            setMessage({
              type: "success",
              text: "Payment successful! Redirecting to orders..."
            });
            
            // Redirect to orders page after successful payment
            setTimeout(() => {
              navigate("/orders");
            }, 2000);
          } catch (err) {
            console.error("Payment verification failed:", err);
            setMessage({ 
              type: "error", 
              text: "Payment verification failed: " + (err.response?.data?.error || err.message)
            });
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: shippingAddress.phone
        },
        notes: {
          address: `${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state}`,
        },
        theme: { color: "#1f2937" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setMessage({
          type: "error",
          text: "Payment failed: " + (response.error.description || "Something went wrong"),
        });
      });
      
      console.log("Opening Razorpay modal...");
      rzp.open();
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl p-4 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        
        {/* Order summary */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-2">x {item.quantity}</span>
                    </div>
                    <div className="font-medium">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Shipping Address Form */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
          
          {/* Default address option */}
          {savedAddresses.length > 0 && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useDefaultAddress}
                  onChange={handleUseDefaultAddress}
                  className="mr-2"
                />
                Use default address
              </label>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Full Name*</label>
              <input
                type="text"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleAddressChange}
                className={`w-full p-2 border rounded ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.fullName && <p className="mt-1 text-xs text-red-500">{formErrors.fullName}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleAddressChange}
                placeholder="10-digit mobile number"
                className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Address Line 1*</label>
              <input
                type="text"
                name="addressLine1"
                value={shippingAddress.addressLine1}
                onChange={handleAddressChange}
                placeholder="House/Flat No., Building, Street"
                className={`w-full p-2 border rounded ${formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.addressLine1 && <p className="mt-1 text-xs text-red-500">{formErrors.addressLine1}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={shippingAddress.addressLine2}
                onChange={handleAddressChange}
                placeholder="Landmark, Area (Optional)"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">City*</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                className={`w-full p-2 border rounded ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.city && <p className="mt-1 text-xs text-red-500">{formErrors.city}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">State*</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                className={`w-full p-2 border rounded ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.state && <p className="mt-1 text-xs text-red-500">{formErrors.state}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Postal Code*</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleAddressChange}
                placeholder="6-digit PIN code"
                className={`w-full p-2 border rounded ${formErrors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.postalCode && <p className="mt-1 text-xs text-red-500">{formErrors.postalCode}</p>}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Country*</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
          </div>
        </div>
        
        {/* Status Messages */}
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
        
        {/* Payment Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRazorpay}
            disabled={loading || cart.length === 0}
            className="px-6 py-3 text-white bg-blue-600 rounded shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ₹${totalAmount} with Razorpay`
            )}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
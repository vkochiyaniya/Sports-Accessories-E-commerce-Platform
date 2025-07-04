import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { StarIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Demo images for product gallery
  const productImages = [
    { url: product?.image || "/placeholder.jpg", alt: product?.name }
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products/getdetail/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Add the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      // Show success state
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));



  const [newReview, setNewReview] = useState("");
const [newRating, setNewRating] = useState(0);
const [submittingReview, setSubmittingReview] = useState(false);
const submitReview = async () => {
  if (!newReview || newRating < 1 || newRating > 5) {
    alert("Please provide a review and rating between 1 to 5.");
    return;
  }

  setSubmittingReview(true);

  try {
    const response = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
      review: newReview,
      rating: newRating,
    });

    // Update local state with the new review
    setProduct(prev => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
      rating: ((prev.rating * prev.reviews.length + newRating) / (prev.reviews.length + 1)).toFixed(1)
    }));

    setNewReview("");
    setNewRating(0);
  } catch (error) {
    console.error("Failed to submit review:", error);
    alert("Failed to submit review.");
  } finally {
    setSubmittingReview(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
        ></motion.div>
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center bg-white rounded-lg shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-bold text-red-500">Oops!</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchProduct}
            className="px-6 py-2 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate discount percentage for demo purposes
  const originalPrice = product?.price * 1.2;
  const discountPercentage = Math.round(((originalPrice - product?.price) / originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-1">
          <br />
          <br />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden bg-white rounded-lg shadow-lg"
            >
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={productImages[selectedImage]?.url} 
                alt={productImages[selectedImage]?.alt}
                className="object-cover w-full h-96" 
              />
              
              <div className="flex p-4 space-x-3">
              <br />
              <br />
                {productImages.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative cursor-pointer w-20 h-20 overflow-hidden rounded-md border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <img 
                      src={image.url} 
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Middle Column: Product Details */}
          
          <div className="lg:col-span-1">
          <br />
          <br />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                  In Stock
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-5 w-5 ${i < (product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product?.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
              
              <h1 className="mt-4 text-3xl font-bold">{product?.name}</h1>
              
              <div className="mt-6">
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-blue-600">₹{product?.price}</span>
                  <span className="ml-2 text-lg text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm font-semibold text-green-500">{discountPercentage}% OFF</span>
                </div>
                
                <div className="flex items-center mt-8 space-x-4">
                  <div className="flex items-center">
                    <button 
                      onClick={decrementQuantity}
                      className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-l hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-12 h-8 px-2 text-center border-t border-b border-gray-300"
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="flex items-center justify-center w-8 h-8 text-gray-600 border border-gray-300 rounded-r hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center flex-1 px-6 py-3 font-medium text-white rounded-md ${addedToCart ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? (
                      <>Added to Cart</>
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex flex-col space-y-4">
                  {product?.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                  )}
                  
                  {product?.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                  )}
                  
                  {product?.material && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Material</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  
                  {product?.color && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color</span>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-${product.color.toLowerCase()}-500`}></div>
                        <span className="font-medium">{product.color}</span>
                      </div>
                    </div>
                  )}
                  
                  {product?.size && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size</span>
                      <span className="font-medium">{product.size}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Additional Info */}
          <div className="lg:col-span-1">
            <br />
            <br />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold">Product Description</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {product?.description}
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <TruckIcon className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Free Shipping</h3>
                    <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ShieldCheckIcon className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <div className="ml-3">
                    <h3 className="font-semibold">Secure Payment</h3>
                    <p className="text-sm text-gray-500">We ensure secure payment with PCI DSS</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ArrowPathIcon className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <div className="ml-3">
                    <h3 className="font-semibold">30 Days Return</h3>
                    <p className="text-sm text-gray-500">Return or exchange within 30 days</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <br />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 mt-6 bg-white rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold">Customer Reviews</h2>

{/* Existing Reviews */}
{product?.reviews && product.reviews.length > 0 ? (
  <div className="mt-4 space-y-4">
    {product.reviews.map((review, index) => (
      <div key={index} className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-gray-600">{review}</p>
        <p className="mt-1 text-sm text-gray-400">by Customer {index + 1}</p>
      </div>
    ))}
  </div>
) : (
  <p className="mt-4 text-gray-500">No reviews yet. Be the first to write one!</p>
)}

{/* Add Review Form */}
<div className="mt-6">
  <h3 className="text-lg font-semibold">Write a Review</h3>
  <textarea
    className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring"
    rows="3"
    value={newReview}
    onChange={(e) => setNewReview(e.target.value)}
    placeholder="Write your review..."
  />
  <div className="flex items-center mt-2">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-6 w-6 cursor-pointer ${i < newRating ? 'text-yellow-400' : 'text-gray-300'}`}
        onClick={() => setNewRating(i + 1)}
      />
    ))}
    <span className="ml-2 text-sm text-gray-600">{newRating}/5</span>
  </div>
  <button
    onClick={submitReview}
    disabled={submittingReview}
    className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
  >
    {submittingReview ? "Submitting..." : "Submit Review"}
  </button>
</div>

            </motion.div>
          </div>
        </motion.div>
        
        {/* Related Products - Just a placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
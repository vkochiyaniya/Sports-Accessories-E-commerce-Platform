import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { message, Tooltip } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // New AntD 5+

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    message.success(`${product} added to cart! ✅`);
    // Add your cart logic here (e.g., dispatch to Redux or context)
  };

  return (
    <motion.div
      key={product.id}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      whileHover={{ scale: 1.02 }}
      onClick={handleViewProduct}
    >
      {/* Product Image */}
      <div className="w-full h-36 overflow-hidden rounded-t-xl">
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col gap-1 flex-grow">
        <h3 className="text-sm font-bold truncate">{product.name}</h3>
        <p className="text-sm font-semibold text-gray-700">₹{product.price.toFixed(2)}</p>
        {product.brand && (
          <p className="text-xs text-gray-400 truncate">{product.brand}</p>
        )}
        {product.rating && (
          <p className="text-xs text-yellow-500 mt-1">⭐ {product.rating.toFixed(1)} / 5</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-3 pt-0">
        <Tooltip title="Add to Cart">
          <button
            className="w-1/2 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            onClick={handleAddToCart}
          >
            <ShoppingCartOutlined />
          </button>
        </Tooltip>
        <Tooltip title="View Product">
          <button
            className="w-1/2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            onClick={handleViewProduct}
          >
            <EyeOutlined />
          </button>
        </Tooltip>
      </div>
    </motion.div>
  );
};

export default ProductCard;

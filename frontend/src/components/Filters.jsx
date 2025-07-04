import React from "react";
import { motion } from "framer-motion";
import { Select } from "antd";

const { Option } = Select;

const Filters = ({ selectedFilters, onFilterChange, onClearFilters }) => {
  const filterOptions = [
    {
      label: "Color",
      key: "color",
      options: ["Red", "Blue", "Green", "Black", "White"],
    },
    {
      label: "Size",
      key: "size",
      options: ["S", "M", "L", "XL", "XXL"],
    },
    {
      label: "Brand",
      key: "brand",
      options: [
        "Nike",
        "Adidas",
        "Puma",
        "Under Armour",
        "Decathlon",
        "Yonex",
        "Wilson",
      ],
    },
    {
      label: "Material",
      key: "material",
      options: [
        "Carbon Fiber",
        "Rubber",
        "Leather",
        "Nylon",
        "Synthetic",
        "Polyester",
        "Foam",
        "Wooden",
      ],
    },
    {
      label: "Category",
      key: "category",
      options: [
        "Fitness Equipment",
        "Outdoor Sports",
        "Indoor Games",
        "Team Sports",
        "Athletic Apparel",
        "Training Accessories",
        "Water Sports",
      ],
    },
  ];

  return (
    <aside className="w-full p-4 bg-white rounded-lg shadow-lg md:w-1/4">
      <h2 className="mb-4 text-xl font-bold">Filters</h2>

      {/* Price Range */}
      <motion.label
        className="block mb-4"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Price Range:
        <motion.span
          className="ml-2 font-semibold text-blue-600"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          ₹{selectedFilters.price}
        </motion.span>
        <motion.input
          type="range"
          min="500"
          max="1500"
          step="10"
          value={selectedFilters.price}
          onChange={(e) => onFilterChange("price", e.target.value)}
          className="w-full mt-1 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      </motion.label>

      {/* Dropdown Filters */}
      {filterOptions.map(({ label, key, options }) => (
        <motion.div
          key={key}
          className="mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block mb-1 font-medium text-gray-700">{label}</label>
          <Select
            placeholder={`Select ${label}`}
            value={selectedFilters[key] || undefined}
            onChange={(value) => onFilterChange(key, value)}
            allowClear
            className="w-full"
          >
            {options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </motion.div>
      ))}

      {/* Clear All Button */}
      <motion.button
        onClick={onClearFilters}
        className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
      >
        Clear All Filters
      </motion.button>
    </aside>
  );
};

export default Filters;

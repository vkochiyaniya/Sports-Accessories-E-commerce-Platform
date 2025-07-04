import axios from "axios";

// Use import.meta.env for Vite compatibility
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Throw error instead of returning empty array
  }
};

// Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

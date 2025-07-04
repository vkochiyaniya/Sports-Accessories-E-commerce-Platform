import React, { useState, useEffect } from "react";
import { Layout, Card, Button, Rate, Typography, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const { Content } = Layout;
const { Title, Text } = Typography;

const availabilityTag = (status) => {
  const colors = {
    "Available": "green",
    "Limited": "orange",
    "Out of Stock": "red",
  };
  return <div style={{ color: colors[status], border: `1px solid ${colors[status]}`, padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>{status}</div>;
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Make sure this endpoint matches the one in your routes file
      const response = await axios.get("http://localhost:5000/api/products/fetch");
      console.log("Fetched Products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    if (!productId) {
      console.error("Invalid product ID:", productId);
      return;
    }
    console.log("Editing product with ID:", productId);
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = async (id) => {
    console.log(`🛑 Deleting product: ${id}`);
    if (deleting) return;  // Prevent multiple delete clicks

    setDeleting(true);
    try {
      // Update: Adding credentials and correct headers
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.Clerk?.session?.getToken() || localStorage.getItem('clerkToken')}`
        }
      });

      console.log("Delete response:", response);
      
      if (response.status === 200) {
        console.log("✅ Product deleted successfully");
        message.success("Product deleted successfully!");
        // Refresh product list after deletion
        setProducts(products.filter((product) => product.id !== id));
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error.message);
      message.error(error.response?.data?.error || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f8", display: "flex" }}>
      <Sidebar />
      <Layout style={{ flex: 1 }}>
        <AdminNavbar />
        <Content style={{ padding: 24 }}>
          <motion.div
            className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Title level={2} className="text-gray-800">Products</Title>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/add-product")}
            >
              <PlusOutlined /> Add New Product
            </motion.button>
          </motion.div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {products.map((product) => {
                return (
                  <motion.div key={product.id}>
                    <Card
                      hoverable
                      cover={
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-48 rounded-t-xl"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      }
                      className="overflow-hidden shadow-lg rounded-xl"
                    >
                      <Title level={4}>{product.name}</Title>
                      <Text className="text-lg font-semibold text-gray-600">₹{product.price}</Text>
                      <div className="flex items-center mt-2">
                        <Rate disabled defaultValue={product.rating || 0} className="text-yellow-500" />
                        <Text className="ml-2 text-gray-500">({product.reviews || 0} reviews)</Text>
                      </div>
                      <div className="mt-2">{availabilityTag(product.availability || "Available")}</div>
                      <div className="flex justify-between mt-4">
                        <motion.button
                          className="flex items-center gap-1 px-3 py-2 transition-all bg-gray-200 rounded-md hover:bg-gray-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product.id);
                          }}
                        >
                          <EditOutlined /> Edit
                        </motion.button>
                        <motion.button
                          className="flex items-center gap-1 px-3 py-2 text-white transition-all bg-red-500 rounded-md hover:bg-red-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                        >
                          <DeleteOutlined /> Delete
                        </motion.button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductsPage;
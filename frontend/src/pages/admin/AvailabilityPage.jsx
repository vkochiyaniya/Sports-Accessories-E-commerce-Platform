import React, { useState } from "react";
import { Layout, Table, Typography, Card, Select } from "antd";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

// Sample Data
const initialProducts = [
  { id: 1, name: "Cricket Bat", price: "120.00", availability: "Available", image: "/images/bat.jpg" },
  { id: 2, name: "Table Tennis Paddles", price: "60.00", availability: "Limited", image: "/images/paddles.jpg" },
  { id: 3, name: "Badminton Shuttlecocks", price: "24.59", availability: "Out of Stock", image: "/images/shuttlecock.jpg" },
];

const AvailabilityPage = () => {
  const [products, setProducts] = useState(initialProducts);

  // Function to change availability status
  const handleChangeAvailability = (id, newAvailability) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, availability: newAvailability } : product
      )
    );
  };

  // Define badge colors
  const getBadgeStyle = (availability) => {
    if (availability === "Out of Stock")
      return { backgroundColor: "#ff4d4f", color: "white" }; // Red
    if (availability === "Limited")
      return { backgroundColor: "#faad14", color: "white" }; // Yellow
    return { backgroundColor: "#52c41a", color: "white" }; // Green
  };

  // Table Columns
  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img src={record.image} alt={text} className="w-14 h-14 object-cover rounded-md" />
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="text-gray-700 font-medium">${price}</span>,
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (availability) => (
        <div
          style={{
            ...getBadgeStyle(availability),
            padding: "6px 16px",
            borderRadius: "12px",
            fontWeight: "bold",
            textAlign: "center",
            minWidth: "120px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center", // Ensures proper vertical alignment
          }}
        >
          {availability}
        </div>
      ),
    },
    {
      title: "Change Status",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue={record.availability}
          style={{ width: 140 }}
          onChange={(value) => handleChangeAvailability(record.id, value)}
        >
          <Option value="Available">Available</Option>
          <Option value="Limited">Limited</Option>
          <Option value="Out of Stock">Out of Stock</Option>
        </Select>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <Sidebar />
      <Layout>
        <AdminNavbar />
        <Content style={{ padding: 24 }}>
          {/* Header with Animation */}
          <motion.div
            className="flex justify-between items-center mb-6 p-4 rounded-lg shadow-md bg-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Title level={2} className="text-gray-800">Product Availability</Title>
          </motion.div>

          {/* Table with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg p-6 rounded-xl bg-white">
              <Table columns={columns} dataSource={products} rowKey="id" className="shadow-md rounded-lg" />
            </Card>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AvailabilityPage;

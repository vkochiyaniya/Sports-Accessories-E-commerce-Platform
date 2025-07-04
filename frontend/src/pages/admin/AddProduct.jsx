import React, { useState } from "react";
import { Layout, Form, Input, Button, Upload, Typography, message, Select } from "antd";
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const categories = [
    "Fitness Equipment",
    "Outdoor Sports",
    "Indoor Games",
    "Team Sports",
    "Athletic Apparel",
    "Training Accessories",
    "Water Sports",
    "Other"
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Under Armour",
    "Decathlon",
    "Yonex",
    "Wilson",
    "Other"
  ];

  const materials = [
    "Carbon Fiber",
    "Rubber",
    "Leather",
    "Nylon",
    "Synthetic",
    "Polyester",
    "Foam",
    "Other"
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Red", "Blue", "Green", "Black", "White"];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (fileList.length === 0) {
        message.error("Please upload a product image!");
        setLoading(false);
        return;
      }

      if (!values.productId) {
        values.productId = `PROD-${Date.now()}`;
      }

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      } else {
        message.error("Invalid image file!");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/api/products/createproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      message.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f8", display: "flex" }}>
      <Sidebar />
      <Layout style={{ flex: 1 }}>
        <AdminNavbar />
        <Content style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Title level={3} className="text-gray-800">Add New Product</Title>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/products")}>
                Back
              </Button>
            </div>

            <Form layout="vertical" onFinish={onFinish} initialValues={{ productId: "" }}>
              <Form.Item name="productId" hidden><Input /></Form.Item>

              <Form.Item label="Product Name" name="name" rules={[{ required: true, message: "Please enter product name!" }]}>
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter product description!" }]}>
                <Input.TextArea placeholder="Enter product description" />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Product Category" name="category" rules={[{ required: true, message: "Please select a category!" }]}>
                  <Select placeholder="Select product category">
                    {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label="Brand Name" name="brand" rules={[{ required: true, message: "Please select a brand!" }]}>
                  <Select placeholder="Select brand">
                    {brands.map(brand => <Option key={brand} value={brand}>{brand}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label="Color" name="color" rules={[{ required: true, message: "Please select a color!" }]}>
                  <Select placeholder="Select color">
                    {colors.map(color => <Option key={color} value={color}>{color}</Option>)}
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Size" name="size" rules={[{ required: true, message: "Please select a size!" }]}>
                  <Select placeholder="Select size">
                    {sizes.map(size => <Option key={size} value={size}>{size}</Option>)}
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Material Type" name="material" rules={[{ required: true, message: "Please select a material!" }]}>
                  <Select placeholder="Select material">
                    {materials.map(material => <Option key={material} value={material}>{material}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label="Price (₹)" name="price" rules={[{ required: true, message: "Please enter price!" }]}>
                  <Input type="number" placeholder="Enter price" min="0" step="0.01" />
                </Form.Item>
              </div>

              <Form.Item label="Upload Product Image" required>
                <Upload
                  fileList={fileList}
                  beforeUpload={() => false}
                  listType="picture"
                  maxCount={1}
                  accept="image/png, image/jpeg"
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <motion.button
                  type="submit"
                  className="flex items-center justify-center w-full gap-2 py-2 text-white transition-all bg-blue-500 rounded-md hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  <SaveOutlined />
                  {loading ? "Saving..." : "Save Product"}
                </motion.button>
              </Form.Item>
            </Form>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddProduct;

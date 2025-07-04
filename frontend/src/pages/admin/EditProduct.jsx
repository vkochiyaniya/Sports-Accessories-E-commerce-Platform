import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Upload, Typography, message, Spin, Select } from "antd";
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

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
    "Wooden",
    "Other"
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Red", "Blue", "Green", "Black", "White"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        // Make sure this endpoint matches the one in your routes file
        const response = await axios.get(`http://localhost:5000/api/products/getdetail/${id}`);
        const product = response.data;

        form.setFieldsValue({
          productId: product.id || product.productId,
          name: product.name,
          description: product.description,
          category: product.category,
          brand: product.brand,
          color: product.color,
          size: product.size,
          material: product.material,
          price: product.price,
        });

        if (product.image) {
          setImagePreview(product.image);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        message.error("Failed to fetch product details");
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id, form]);

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
      setImagePreview(imageUrl);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      const allowedFields = [
        "name", "description", "category", "brand",
        "color", "size", "material", "price"
      ];

      allowedFields.forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      // Update: Adding credentials and correct content type
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          // Use Clerk's session token if that's your setup
          "Authorization": `Bearer ${window.Clerk?.session?.getToken() || localStorage.getItem('clerkToken')}`
        },
      });

      if (response.status === 200) {
        message.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      message.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
        <Sidebar />
        <Layout>
          <AdminNavbar />
          <Content style={{ padding: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <Sidebar />
      <Layout>
        <AdminNavbar />
        <Content style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Title level={3} className="text-gray-800">Edit Product</Title>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/products")}>
                Back
              </Button>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="productId" hidden><Input /></Form.Item>

              <Form.Item label="Product Name" name="name" rules={[{ required: true, message: "Please enter product name!" }]}>
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter product description!" }]}>
                <Input.TextArea placeholder="Enter product description" rows={4} />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select category!" }]}>
                  <Select placeholder="Select category">
                    {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label="Brand" name="brand" rules={[{ required: true, message: "Please select brand!" }]}>
                  <Select placeholder="Select brand">
                    {brands.map(b => <Option key={b} value={b}>{b}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label="Color" name="color">
                  <Select placeholder="Select color">
                    {colors.map(c => <Option key={c} value={c}>{c}</Option>)}
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Size" name="size">
                  <Select placeholder="Select size">
                    {sizes.map(s => <Option key={s} value={s}>{s}</Option>)}
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Material" name="material" rules={[{ required: true, message: "Please select material!" }]}>
                  <Select placeholder="Select material">
                    {materials.map(m => <Option key={m} value={m}>{m}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item label="Price (₹)" name="price" rules={[{ required: true, message: "Please enter price!" }]}>
                  <Input type="number" placeholder="Enter price" min="0" step="0.01" />
                </Form.Item>
              </div>

              <Form.Item label="Product Image">
                <div className="flex flex-col items-center mb-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Product" className="object-cover w-32 h-32 mb-3 rounded-lg shadow" />
                  )}
                  <Upload
                    fileList={fileList}
                    beforeUpload={() => false}
                    onChange={handleImageChange}
                    maxCount={1}
                    accept="image/png, image/jpeg, image/jpg"
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Upload New Image</Button>
                  </Upload>
                </div>
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
                  {loading ? "Saving..." : "Save Changes"}
                </motion.button>
              </Form.Item>
            </Form>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditProduct;

import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Card,
  Typography,
  message,
  
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar"; // Your existing Navbar

const { Content } = Layout;
const { Title } = Typography;

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dicncqzvu/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const DEFAULT_IMAGE = "https://placehold.co/150x150";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const UserProfile = () => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const userId = user?.id;
  useEffect(() => {
    const syncClerkUsers = async () => {
      try {
        await api.get("/users-merged");
        console.log("✅ Synced Clerk users with DB");
      } catch (error) {
        console.error("❌ Failed to sync users:", error);
      }
    };

    syncClerkUsers();
    }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const { data } = await api.get(`/users/${userId}/profile`);
        const { firstName, lastName, profileImage } = data;
        setImage(profileImage || DEFAULT_IMAGE);
        form.setFieldsValue({ firstName, lastName });
      } catch (error) {
        message.error("Failed to fetch profile data");
        console.error("Fetch error:", error);
      }
    };

    fetchProfile();
  }, [form, userId]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setLoading(true);
      const { data } = await axios.post(CLOUDINARY_URL, formData);
      const uploadedUrl = data.secure_url;
      setImage(uploadedUrl);
      await updateProfileImage(uploadedUrl);
      message.success("Image uploaded");
    } catch (error) {
      message.error("Image upload failed");
      console.error("Cloudinary error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      await api.put(`/users/${userId}/profile/image`, {
        profileImage: imageUrl,
      });
    } catch (error) {
      message.error("Image update failed");
      console.error("Update image error:", error);
    }
  };

  const handleImageChange = ({ file }) => {
    if (file?.originFileObj) {
      handleImageUpload(file.originFileObj);
    }
  };

  const onFinish = async (values) => {
    try {
      await api.put(`/users/${userId}/profile`, {
        ...values,
        profileImage: image,
      });
      message.success("Profile updated");
      navigate("/dashboard"); // Redirect to user dashboard or anywhere else
    } catch (error) {
      message.error("Profile update failed");
      console.error("Update error:", error);
    }
  };  
  

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <Navbar />
      <Content className="flex items-center justify-center px-4 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <Title level={2} className="mb-6 text-center">
              Edit Profile
            </Title>

            <div className="mb-6 text-center">
              <Avatar size={90} src={image} />
              <Upload
                showUploadList={false}
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleImageChange}
              >
                <Button
                  type="link"
                  icon={<UploadOutlined />}
                  loading={loading}
                  className="text-base"
                >
                  {loading ? "Uploading..." : "Change Photo"}
                </Button>
              </Upload>
            </div>

            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Enter your first name" }]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>  

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Enter your last name" }]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>

              <Form.Item>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full py-2 text-base rounded-md"
                  >
                    Update Profile
                  </Button>
                </motion.div>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default UserProfile;

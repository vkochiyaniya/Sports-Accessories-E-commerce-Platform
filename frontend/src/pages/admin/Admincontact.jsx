import React, { useEffect, useState } from "react";
import { Layout, Table, Typography, Card, Spin, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const { Content } = Layout;
const { Title } = Typography;

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/contact");
      setContacts(response.data);
    } catch (error) {
      console.error("Failed to fetch contact submissions:", error);
      message.error("Failed to fetch contact submissions");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
    title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message) => (
        <span className="line-clamp-2 break-words max-w-xs">{message}</span>
      ),
    },
    {
      title: "Submitted At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <Sidebar />
      <Layout>
        <AdminNavbar />
        <Content style={{ padding: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <Title level={2} className="text-gray-800 m-0">Contact Submissions</Title>
                <button
                  onClick={fetchContacts}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <Spin size="large" />
                </div>
              ) : contacts.length === 0 ? (
                <div>No contact submissions found</div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={contacts}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  className="shadow-md rounded-lg"
                />
              )}
            </Card>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminContact;

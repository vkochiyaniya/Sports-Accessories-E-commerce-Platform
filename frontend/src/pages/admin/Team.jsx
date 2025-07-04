import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Table,
  Typography,
  Card,
  Alert,
  Select,
  Button,
  Popconfirm,
  message,
  Empty,
} from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/users-merged`);
      setTeam(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load user data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (clerkId, id, newRole) => {
    if (!id) {
      message.warning("Cannot update role for Clerk-only users.");
      return;
    }

    setUpdatingRole(id);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/toggle-role/${id}`,
        { role: newRole },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        message.success("Role updated successfully");
        fetchUsers();
      } else {
        throw new Error("Failed to update role");
      }
    } catch (err) {
      console.error("Update role error:", err);
      message.error(err.response?.data?.message || "Failed to update role.");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDelete = async (clerkId) => {
    if (!clerkId) {
      message.warning("Invalid Clerk ID");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${clerkId}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      message.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text || <i style={{ color: "gray" }}>No Name</i>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || <i style={{ color: "gray" }}>No Email</i>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => (
        <Select
          value={record.role || "user"}
          disabled={!record.id}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record.clerkId, record.id, value)}
          loading={updatingRole === record.id}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.clerkId ? (
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.clerkId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        ) : (
          <span style={{ color: "gray" }}>Clerk ID missing</span>
        ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AdminNavbar />
        <Content className="p-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title level={2}>Team Management</Title>
            <Card>
              {error && <Alert type="error" message={error} showIcon />}
              <Table
                dataSource={team}
                columns={columns}
                rowKey={(record) => record.clerkId || record.email || Math.random()}
                loading={loading}
                locale={{ emptyText: <Empty description="No users found." /> }}
              />
            </Card>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeamPage;

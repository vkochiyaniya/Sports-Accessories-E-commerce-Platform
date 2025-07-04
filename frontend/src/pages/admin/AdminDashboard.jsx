  import React, { useState, useEffect } from "react";
  import {
    Layout,
    Card,
    Statistic,
    Typography,
    Spin,
    Row,
    Col,
  } from "antd";
  import {
    ShoppingCartOutlined,
    UserOutlined,
    DollarOutlined,
  } from "@ant-design/icons";
  import { motion } from "framer-motion";
  import axios from "axios";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from "recharts";
  import Sidebar from "../../components/admin/Sidebar";
  import AdminNavbar from "../../components/admin/AdminNavbar";

  const { Content } = Layout;
  const { Title } = Typography;

  const DashboardPage = () => {
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [usersRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/users-merged"),
          axios.get("http://localhost:5000/api/orders/admin/all"),
        ]);

        const users = usersRes.data || [];
        const orders = ordersRes.data || [];

        setUserCount(users.length);
        setOrderCount(orders.length);

        const revenue = orders.reduce(
          (sum, order) => sum + parseFloat(order.totalAmount || 0),
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUserCount(0);
        setOrderCount(0);
        setTotalRevenue(0);
      } finally {
        setLoading(false);
      }
    };

    const chartData = [
      {
        name: "Users",
        value: userCount,
      },
      {
        name: "Orders",
        value: orderCount,
      },
      {
        name: "Revenue",
        value: parseFloat(totalRevenue.toFixed(2)),
      },
    ];

    return (
      <Layout style={{ minHeight: "100vh", background: "#f4f6f8" }}>
        <Sidebar />
        <Layout>
          <AdminNavbar />
          <Content style={{ padding: 24 }}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <Title level={2} className="mb-6">Dashboard</Title>

                {/* Stat Cards */}
                <Row gutter={[24, 24]} className="mb-6">
                  <Col xs={24} sm={12} lg={8}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Card className="shadow-md">
                        <Statistic
                          title="Total Customers"
                          value={userCount}
                          prefix={<UserOutlined />}
                          valueStyle={{ color: "#722ed1" }}
                        />
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                      <Card className="shadow-md">
                        <Statistic
                          title="Total Orders"
                          value={orderCount}
                          prefix={<ShoppingCartOutlined />}
                          valueStyle={{ color: "#1890ff" }}
                        />
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                      <Card className="shadow-md">
                        <Statistic
                          title="Total Revenue"
                          value={`₹${totalRevenue.toFixed(2)}`}
                          prefix={<DollarOutlined />}
                          valueStyle={{ color: "#3f8600" }}
                        />
                      </Card>
                    </motion.div>
                  </Col>
                </Row>

                {/* Simple Bar Graphs */}
                <Row gutter={[24, 24]}>
                  {chartData.map((item, index) => (
                    <Col xs={24} md={8} key={index}>
                      <Card className="shadow-lg rounded-xl">
                        <Title level={5}>{item.name}</Title>
                        <ResponsiveContainer width="100%" height={200}>
    <BarChart data={[item]}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        allowDecimals={false}
        domain={[0, Math.max(5, item.value + 1)]} // Adjust max range
        tickCount={Math.max(2, item.value + 1)} // Ensure at least 2 ticks
      />
      <Tooltip />
      <Bar
        dataKey="value"
        fill={
          item.name === "Users"
            ? "#722ed1"
            : item.name === "Orders"
            ? "#1890ff"
            : "#3f8600"
        }
      />
    </BarChart>
  </ResponsiveContainer>

                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    );
  };

  export default DashboardPage;

import React from "react";
import { Card } from "antd";
import { UserOutlined, ShoppingOutlined, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const dashboardStats = [
  { title: "Total Users", value: "40,689", icon: <UserOutlined />, color: "#8e44ad" },
  { title: "Total Orders", value: "10,293", icon: <ShoppingOutlined />, color: "#2980b9" },
  { title: "Total Sales", value: "$89,000", icon: <DollarOutlined />, color: "#27ae60" },
  { title: "Total Pending", value: "2,040", icon: <ClockCircleOutlined />, color: "#e67e22" },
];

const DashboardCards = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
      {dashboardStats.map((stat, index) => (
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card style={{ background: stat.color, color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3>{stat.title}</h3>
                <h2>{stat.value}</h2>
              </div>
              {stat.icon}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;

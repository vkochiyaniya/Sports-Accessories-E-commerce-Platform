import React from "react";
import { Layout, Menu, Image, Typography } from "antd";
import { 
  UserOutlined, 
  ShoppingOutlined, 
  DollarOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  TeamOutlined ,
  MailOutlined
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const location = useLocation(); // Get current route path

  return (
    <Sider theme="light">
      {/* Logo and Name */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          padding: "20px", 
          gap: "12px" 
        }}
      >
        <br />
        <br />
        <Image 
          src="/src/assets/images/logo.jpg" 
          alt="SportX Logo" 
          width={150} 
          height={20} 
          preview={false} 
          style={{ borderRadius: "" }}
        />
        
      <div className="logo" style={{ padding: 10, fontSize: 20, fontWeight: "bold" }}> </div>
      </div>

      <Menu mode="vertical" selectedKeys={[location.pathname]}>
        <Menu.Item key="/admin" icon={<UserOutlined />}>
          <NavLink to="/admin">Dashboard</NavLink>
        </Menu.Item>
        <Menu.Item key="/admin/products" icon={<ShoppingOutlined />}>
          <NavLink to="/admin/products">Products</NavLink>
        </Menu.Item>
        <Menu.Item key="/admin/orders" icon={<DollarOutlined />}>
          <NavLink to="/admin/orders">Orders</NavLink>
        </Menu.Item>
        <Menu.Item key="/admin/invoice" icon={<FileTextOutlined />}>
          <NavLink to="/admin/invoice">Invoices</NavLink>
        </Menu.Item>
        <Menu.Item key="/admin/contact" icon={<MailOutlined />}>
          <NavLink to="/admin/contact">Contact</NavLink>
        </Menu.Item>
        <Menu.Item key="/admin/team" icon={<TeamOutlined />}>
          <NavLink to="/admin/team">User Management</NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;

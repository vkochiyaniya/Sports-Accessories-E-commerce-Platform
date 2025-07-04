import React, { useState, useEffect } from "react";
import { Layout, Table, Badge, Typography, Card, Button, Input, Select, Spin, message } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StockPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products/fetch");
      const productsData = response.data;
      
      setProducts(productsData);
      
      // Extract unique categories for filter
      const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, stock) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}/stock`, {
        stock: parseInt(stock)
      });
      
      message.success("Stock updated successfully");
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Error updating stock:", error);
      message.error("Failed to update stock");
    }
  };

  const getStockStatus = (stock) => {
    if (stock === undefined || stock === null) return { status: 'unknown', color: 'default' };
    if (stock <= 0) return { status: 'Out of Stock', color: 'red' };
    if (stock < 10) return { status: 'Low Stock', color: 'orange' };
    return { status: 'In Stock', color: 'green' };
  };

  const filteredProducts = products
    .filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      !categoryFilter || product.category === categoryFilter
    );

  const columns = [
    { 
      title: "Product", 
      dataIndex: "name", 
      key: "name",
      render: (name, record) => (
        <div className="flex items-center">
          {record.image && (
            <img 
              src={record.image} 
              alt={name} 
              className="w-10 h-10 mr-3 object-cover rounded"
            />
          )}
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{record.category} - {record.brand}</div>
          </div>
        </div>
      )
    },
    { 
      title: "Price", 
      dataIndex: "price", 
      key: "price",
      render: price => `$${parseFloat(price).toFixed(2)}`
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock, record) => {
        const { status, color } = getStockStatus(stock);
        return (
          <div className="flex items-center">
            <Badge 
              count={stock || 0} 
              style={{ backgroundColor: color, fontSize: '12px' }}
              className="mr-3"
            />
            <Select
              defaultValue={stock || 0}
              style={{ width: 80 }}
              onChange={(value) => updateStock(record.id, value)}
            >
              {[0, 5, 10, 20, 50, 100].map(num => (
                <Option key={num} value={num}>{num}</Option>
              ))}
            </Select>
          </div>
        );
      }
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const { status, color } = getStockStatus(record.stock);
        return <Tag color={color}>{status}</Tag>;
      }
    }
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
              <div className="flex items-center justify-between mb-6">
                <Title level={2} className="text-gray-800 m-0">
                  Stock Management
                </Title>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchProducts}
                  type="primary"
                  loading={loading}
                >
                  Refresh
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Input
                  placeholder="Search products..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: 250 }}
                />
                
                <Select
                  placeholder="Filter by Category"
                  style={{ width: 200 }}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  allowClear
                >
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <Spin size="large" />
                </div>
              ) : (
                <Table 
                  columns={columns} 
                  dataSource={filteredProducts} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
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

export default StockPage;
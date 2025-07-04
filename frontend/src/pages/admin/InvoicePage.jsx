import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Typography, Card, Spin, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { FilePdfOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";  // Import jsPDF
import { toast } from "react-toastify";
const { Content } = Layout;
const { Title } = Typography;

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/orders/admin/all");
      console.log("Fetched invoices:", response.data);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      message.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadInvoice = (order) => {
      try {
          const doc = new jsPDF();
          const { shippingAddress, totalAmount, id, createdAt, status, paymentId } = order;
          
          // Add title and company info
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.text("INVOICE", 105, 20, { align: "center" });
          
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text("SportX", 14, 30);
          doc.text("Camp Area Bhuj", 14, 35);
          doc.text("Bhuj, Gujarat, 360370", 14, 40);
          doc.text("contact@SportX.com", 14, 45);
      
          // Add line separator
          doc.setDrawColor(220, 220, 220);
          doc.line(14, 50, 196, 50);
      
          // Add order details
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text("INVOICE DETAILS", 14, 60);
          
          doc.setFont("helvetica", "normal");
          doc.text(`Invoice #: ${id.substring(0, 8)}`, 14, 70);
          doc.text(`Date: ${formatDate(createdAt)}`, 14, 75);
          doc.text(`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`, 14, 80);
          doc.text(`Payment ID: ${paymentId || 'N/A'}`, 14, 85);
      
          // Add client details if shipping address exists
          if (shippingAddress && typeof shippingAddress === 'object') {
            doc.setFont("helvetica", "bold");
            doc.text("SHIPPING DETAILS", 120, 60);
            
            doc.setFont("helvetica", "normal");
            doc.text(`${shippingAddress.fullName}`, 120, 70);
            doc.text(`${shippingAddress.addressLine1}`, 120, 75);
            if (shippingAddress.addressLine2) doc.text(`${shippingAddress.addressLine2}`, 120, 80);
            doc.text(`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`, 120, 85);
            doc.text(`${shippingAddress.country}`, 120, 90);
            doc.text(`Phone: ${shippingAddress.phone}`, 120, 95);
          }
      
          // Draw table header for order summary
          doc.setDrawColor(0, 0, 0);
          doc.setFillColor(240, 240, 240);
          doc.rect(14, 105, 182, 10, 'F');
          
          doc.setFont("helvetica", "bold");
          doc.text("ORDER SUMMARY", 105, 112, { align: "center" });
      
          // Add line for totals
          doc.line(14, 125, 196, 125);
          
          // Add total amount
          doc.setFont("helvetica", "bold");
          doc.text("Total Amount:", 140, 135);
          doc.text(`₹ ${totalAmount.toFixed(2)}`, 180, 135, { align: "right" });
      
          // Add footer
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text("Thank you for your purchase!", 105, 180, { align: "center" });
          doc.text("For any questions regarding this invoice, please contact our support team.", 105, 185, { align: "center" });
      
          // Save PDF
          doc.save(`${id.substring(0, 8)}_invoice.pdf`);
          toast.success("Invoice downloaded successfully");
        } catch (error) {
          console.error("Error generating invoice:", error);
          toast.error("Failed to generate invoice");
        }
  };

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span className="font-medium">{id.substring(0, 8)}...</span>,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => <span>{userId.substring(0, 8)}...</span>,
    },
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
      render: (paymentId) => (paymentId ? paymentId : "N/A"),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => (date ? formatDate(date) : "N/A"),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => handleDownloadInvoice(record)}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Download Invoice
          </Button>
        </motion.div>
      ),
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
                <Title level={2} className="text-gray-800 m-0">Invoices & Payments</Title>
                <Button
                  onClick={fetchInvoices}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  Refresh
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <Spin size="large" />
                </div>
              ) : invoices.length === 0 ? (
                <div>No invoices found</div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={invoices}
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

export default InvoicePage;
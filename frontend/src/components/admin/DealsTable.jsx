import React from "react";
import { Table, Avatar, Button } from "antd";

const columns = [
  { title: "Product Name", dataIndex: "name", key: "name", render: (text, record) => <Avatar src={record.image} /> },
  { title: "Location", dataIndex: "location", key: "location" },
  { title: "Date - Time", dataIndex: "date", key: "date" },
  { title: "Piece", dataIndex: "piece", key: "piece" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
  { 
    title: "Status", 
    dataIndex: "status", 
    key: "status", 
    render: (status) => (
      <Button type="primary" danger={status === "Rejected"} style={{ background: status === "Delivered" ? "#2ecc71" : status === "Pending" ? "#f39c12" : "#e74c3c" }}>
        {status}
      </Button>
    ) 
  },
];

const data = [
  { key: "1", name: "Cricket Bat", location: "Marjolaine Landing", date: "12.09.2019 - 12:53 PM", piece: 423, amount: "$34,295", status: "Delivered", image: "bat.jpg" },
  { key: "2", name: "Sneakers", location: "Marjolaine Landing", date: "12.09.2019 - 12:53 PM", piece: 423, amount: "$34,295", status: "Pending", image: "sneakers.jpg" },
  { key: "3", name: "Table Tennis Paddles", location: "Marjolaine Landing", date: "12.09.2019 - 12:53 PM", piece: 423, amount: "$34,295", status: "Rejected", image: "paddles.jpg" },
];

const DealsTable = () => {
  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default DealsTable;

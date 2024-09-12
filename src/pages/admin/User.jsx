import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";

const User = () => {
  const [users, setUsers] = useState([]); // Initialize as an array

  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/getAllUsers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setUsers(response.data.data); // Ensure data is always an array
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers(); // Fetch users when the component mounts
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name", // Add key to avoid warnings
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email", // Add key to avoid warnings
    },
    {
      title: "isDoctor",
      dataIndex: "isDoctor",
      key: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "isAdmin",
      dataIndex: "isAdmin",
      render: (text, record) => <span>{record.isAdmin ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users</h1>
      <h5>
        <Table columns={columns} dataSource={users} rowKey={users._id} />
      </h5>
    </Layout>
  );
};

export default User;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import moment from "moment";
import { message, Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/user/user-appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },

    {
      title: "Date & Time",
      dataIndex: "date",
      render: (doctor, record) => <span>{record.date}</span>,
    },
    {},
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <Layout>
      <h1>Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;

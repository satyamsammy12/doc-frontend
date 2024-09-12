import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";
import { message, Table } from "antd";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/doctor/doctor-appointments",
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
      setError(error);
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
      render: (text, record) => (
        <span>{moment(record.date).format("YYYY-MM-DD HH:mm")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={() => handleAccountStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleAccountStatus(record, "reject")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h1>Error loading appointments</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Appointments</h1>
      <Table columns={columns} dataSource={appointments} rowKey="_id" />
    </Layout>
  );
};

export default DoctorAppointment;

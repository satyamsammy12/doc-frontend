import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";
import moment from "moment";

const Doctor = () => {
  const [doc, setDoc] = useState([]); // Initialize as an empty array

  const getAllDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/getAllDoctors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        setDoc(response.data.data); // Set doctors data to state
      } else {
        console.error("Failed to fetch doctors:", response.data.message);
        setDoc([]); // Ensure doc is always an array
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoc([]); // Ensure doc is always an array
    }
  };

  const handleRejectAccount = async (record) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/admin/rejectAccountStatus",
        { doctorId: record._id, userId: record.userId, status: "pending" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {record.firstname} {record.lastname}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Fees",
      dataIndex: "feesPerConsultation",
      key: "feesPerConsultation",
    },
    {
      title: "Timing",
      dataIndex: "timing",
      key: "timing",
      render: (text, record) => {
        if (record.timing && record.timing.length === 2) {
          // Assuming timing is an array with start and end ISO strings
          const startTime = moment(record.timing[0]).format("HH:mm");
          const endTime = moment(record.timing[1]).format("HH:mm");
          return (
            <div>
              {startTime} - {endTime}
            </div>
          );
        }
        return null;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => handleRejectAccount(record)}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center">Doctors</h1>
      <Table columns={columns} dataSource={doc} rowKey="_id" />
    </Layout>
  );
};

export default Doctor;

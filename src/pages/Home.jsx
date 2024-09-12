import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import DoctorList from "../components/DoctorList";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/getAllDoctors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          Dr. {record.firstname} {record.lastname}
        </span>
      ),
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
      title: "Fees",
      dataIndex: "feesPerConsultation  ",
      key: "fees",
      render: (text, record) => `${record.feesPerConsultation}.Rs`,
    },
    {
      title: "Timing",
      dataIndex: "timing",
      key: "timing",
      render: (text, record) => {
        if (record.timing && record.timing.length === 2) {
          // Assuming timing is an array with start and end ISO strings
          const startTime = new Date(record.timing[0]).toLocaleTimeString();
          const endTime = new Date(record.timing[1]).toLocaleTimeString();
          return `${startTime} - ${endTime}`;
        } else {
          return "Not available";
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/doctor/book-appointment/${record._id}`)}
        >
          Book an appointment
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="container">
        <h1 className="justify-content-center">All Doctors</h1>
        <Table columns={columns} dataSource={data} />
        {/* <div className="card p-4 " style={{ width: "28rem" }}>
          {data.length > 0 ? (
            data.map((doctor) => (
              <li key={doctor.id} className="list-group-item ">
                Dr.
                {doctor.firstname} {doctor.lastname}
              </li>
            ))
          ) : (
            <li className="list-group-item">No doctors found</li>
          )}

          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              {data.length > 0 ? (
                data.map((doctor) => (
                  <li key={doctor.id} className="list-group-item">
                    Experience: &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {doctor.experience} years
                  </li>
                ))
              ) : (
                <li className="list-group-item">No doctors found</li>
              )}
            </li>
            <li className="list-group-item">
              {data.length > 0 ? (
                data.map((doctor) => (
                  <li key={doctor.id} className="list-group-item">
                    Phone no. &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    &nbsp;&nbsp;&nbsp;
                    {doctor.phone}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No doctors found</li>
              )}
            </li>
            <li className="list-group-item">
              {data.length > 0 ? (
                data.map((doctor) => (
                  <li key={doctor.id} className="list-group-item">
                    Specialization: &nbsp; &nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {doctor.specialization}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No doctors found</li>
              )}
            </li>
          </ul>
        </div> */}
      </div>
    </Layout>
  );
};

export default Home;

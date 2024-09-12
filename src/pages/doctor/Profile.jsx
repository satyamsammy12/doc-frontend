import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Col, Form, Input, message, Row, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      // Extract and format the timing field
      const timings = values.timing
        ? [
            moment(values.timing[0].format("HH:mm")),
            moment(values.timing[1].format("HH:mm")),
          ]
        : [];

      // Prepare the data to send
      const data = {
        ...values,
        userId: user._id,
        timings,
      };

      // Make the API request
      const res = await axios.post(
        "http://localhost:3000/api/v1/doctor/updateProfile",
        { ...values, userId: user.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Doctor Updated successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error Update doctor:", error);
      message.error("Something went wrong");
    }
  };

  const getDocInfo = async (req, res) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDocInfo();
  }, [params.id]);

  return (
    <Layout>
      <h1 className="text-center">Profile</h1>
      {doctor ? (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            ...doctor,
            timing: doctor.timings || [],
          }}
          className="m-3"
        >
          <h4>Personal Details :</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="First Name" name="firstname" required>
                <Input type="text" placeholder="Enter First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Last Name" name="lastname" required>
                <Input type="text" placeholder="Enter Last Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Phone No." name="phone" required>
                <Input type="text" placeholder="Enter Phone No." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Email" name="email" required>
                <Input type="text" placeholder="Enter Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input type="text" placeholder="Enter Website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Address" name="address" required>
                <Input type="text" placeholder="Enter Address" />
              </Form.Item>
            </Col>
          </Row>
          <h4>Professional Details :</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Specialization" name="specialization" required>
                <Input type="text" placeholder="Enter Specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Experience" name="experience" required>
                <Input type="text" placeholder="Enter Experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consultation"
                name="feesPerConsultation"
                required
              >
                <Input type="text" placeholder="Enter Fees" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Timing" name="timing" required>
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary form-btn" type="submit">
              Update
            </button>
          </div>
        </Form>
      ) : (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "180px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#666",
            cursor: "pointer",
          }}
        >
          You want to apply to the doctor then you can update your profile
        </p>
      )}
    </Layout>
  );
};

export default Profile;

import React from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, message, Row, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";

const ApplyDoc = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const startTime = moment(values.timing[0]).format("HH:mm");
      const endTime = moment(values.timing[1]).format("HH:mm");
      // Extract and format the timing field
      const timings = [
        {
          start: startTime,
          end: endTime,
          label: `${startTime} - ${endTime}`,
        },
      ];
      // Prepare the data to send
      const data = {
        ...values,
        userId: user._id,
        timings,
      };

      // Make the API request
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/apply-doctor",
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Doctor applied successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error applying doctor:", error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Apply Doctor</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
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
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </Layout>
  );
};

export default ApplyDoc;

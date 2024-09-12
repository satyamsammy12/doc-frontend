import React from "react";
import { Form, Input, message } from "antd";
import "./Signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        values
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("User created successfully");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };
  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="card1 p-4 rounded-3xl m-2 items-center"
        >
          <h3 className="text-center">Register</h3>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="Email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <button className="btn btn-primary d-flex items-center" type="submit">
            Signup
          </button>
          <br />
          <span>
            Already have an account? <Link to="/login">Login here</Link>
          </span>
        </Form>
      </div>
    </>
  );
};

export default Signup;

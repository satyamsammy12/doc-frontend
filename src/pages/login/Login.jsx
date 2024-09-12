import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { Form, Input, message } from "antd";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        values
      );
      window.location.reload();
      dispatch(hideLoading());
      if (response.data.success) {
        message.success("Logged in successfully!");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      console.log(error);
      message.error("Failed to login. Please try again.");
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
          <h3 className="text-center">Signin</h3>

          <Form.Item label="Email" name="email">
            <Input type="Email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <div className="last">
            <button className="btn btn-primary" type="submit">
              Login
            </button>
            <br />
            <span>
              Don't have an account? <Link to="/signup">Register here</Link>
            </span>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;

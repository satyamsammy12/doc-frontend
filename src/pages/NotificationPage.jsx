import React, { useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Retrieve the user state from Redux
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;

  // Fetch notifications when the component mounts
  useEffect(() => {
    // Fetch notifications logic here if necessary
  }, [userId]);

  // Handler for marking all notifications as read
  const handleMarkAllRead = async () => {
    if (!userId) {
      message.error("User ID is missing");
      return;
    }

    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/get-all-notification",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        // Optionally refetch notifications or update state here
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong");
    }
  };

  // Handler for deleting read notifications
  const handleDeleteRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/delete-all-notification",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload(true);
        // Optionally refetch notifications or update state here
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  // Ensure user.notifications is defined and is an array
  const notifications = Array.isArray(user?.notification)
    ? user.notification
    : [];
  const seenNotifications = Array.isArray(user?.seenNotification)
    ? user.seenNotification
    : [];

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="Unread" key="unread">
          <div className="d-flex justify-content-end">
            <Button
              type="primary"
              danger
              className="but mt-1 p-2"
              style={{
                marginRight: "38px",
                height: "30px",
                objectFit: "cover",
              }}
            >
              <h4
                className="p-0  mt-1  h-1"
                onClick={handleMarkAllRead}
                style={{
                  cursor: "pointer",
                  width: "210px",
                }}
              >
                Mark all as read
              </h4>
            </Button>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notificationMsg, index) => (
              <div
                className="card"
                key={index}
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-text">{notificationMsg.message}</div>
              </div>
            ))
          ) : (
            <div>No unread notifications</div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="read">
          <div className="d-flex justify-content-end">
            <Button
              type="primary"
              danger
              className="but mt-1 p-2"
              style={{
                marginRight: "38px",
                height: "30px",
                objectFit: "cover",
              }}
            >
              <h4
                className="p-0  mt-1  h-1"
                onClick={handleDeleteRead}
                style={{
                  cursor: "pointer",
                  width: "210px",
                }}
              >
                Delete all read
              </h4>
            </Button>
          </div>
          {seenNotifications.length > 0 ? (
            seenNotifications.map((notificationMsg, index) => (
              <div
                key={index}
                className="card"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-text">{notificationMsg.message}</div>
              </div>
            ))
          ) : (
            <div>No read notifications</div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;

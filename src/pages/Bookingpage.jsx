import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import moment from "moment";
import { DatePicker, Divider, message, TimePicker, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

const Bookingpage = () => {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
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
      console.error("Error fetching doctor data", error);
      message.error("Failed to fetch doctor data.");
    }
  };

  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return message.warning("Date and time are required");
      }
      dispatch(showLoading());

      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(hideLoading());
        return message.warning(
          "Authentication token is missing. Please log in."
        );
      }

      const res = await axios.post(
        "http://localhost:3000/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: data,
          userInfo: user,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Appointment booked successfully");
      } else {
        message.error("Failed to book appointment");
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Error booking appointment. Please try again.");
      console.error("Error booking appointment", error);
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());

      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(hideLoading());
        return message.warning(
          "Authentication token is missing. Please log in."
        );
      }

      const res = await axios.post(
        "http://localhost:3000/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        setIsAvailable(true);
        message.success("Slot available for booking");
      } else {
        setIsAvailable(false);
        message.error("Slot not available for booking");
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Error checking availability. Please try again.");
      console.error("Error checking availability", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [params.doctorId]);

  return (
    <Layout>
      <h1 className="text-center pt-3">Booking Page</h1>
      <Divider />
      <div className="container">
        {data && (
          <div>
            <h4 className="text-center mt-0 ">
              Dr. {data.firstname} {data.lastname}
            </h4>
            <Divider />
            <h4 className="d-flex justify-content-center mt-0">
              Fees: {data.feesPerConsultation} Rs
            </h4>
            <h4 className="d-flex justify-content-center mt-5">
              Specialization: {data.specialization}
            </h4>
            <h4 className="d-flex justify-content-center mt-5">
              Experience: {data.experience} years
            </h4>
            <h4 className="d-flex justify-content-center mt-5">
              Timings:{" "}
              {data.timing
                ? `${moment(data.timing[0]).format("HH:mm")} - ${moment(
                    data.timing[1]
                  ).format("HH:mm")}`
                : "Not Available"}
            </h4>
            <div
              className="d-flex w-50"
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                marginLeft: "250px",
              }}
            >
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setIsAvailable(false);
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                format="HH:mm"
                className="m-2"
                onChange={(value) => {
                  setIsAvailable(false);
                  setTime(moment(value).format("HH:mm"));
                }}
              />
            </div>
            <div
              className="w-50 "
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                marginLeft: "250px",
              }}
            >
              <Button
                type="primary"
                className="m-1 w-60"
                onClick={handleAvailability}
              >
                Check Availability
              </Button>
              <Button
                type="default"
                className="w-60 m-1 btn-dark"
                onClick={handleBooking}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookingpage;

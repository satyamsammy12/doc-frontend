import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import axios from "axios";

const ProtectedRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/getuserdata",
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        <Navigate to="/signup" />;
        dispatch(hideLoading());
        localStorage.clear();
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      console.log(error);
    }
  };

  useEffect(() => {
    if (token && !user) {
      getUser();
    }
  }, [token, user, dispatch]);

  if (user === null) {
    // Return a loading spinner or similar while fetching user data
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoutes;

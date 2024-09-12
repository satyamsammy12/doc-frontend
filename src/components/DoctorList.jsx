import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  // Extract and format start and end times
  const startTime = moment(doctor.timing[0]).format("HH:mm");
  const endTime = moment(doctor.timing[1]).format("HH:mm");
  const navigate = useNavigate(); // Assuming useNavigate hook is available in your component

  return (
    <>
      <div
        className="card m-4"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="card-header">
          <h5>
            Dr. {doctor.firstname} {doctor.lastname}
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center">
            <p>Speciality : {doctor.specialization}</p>

            <p>Fees : {doctor.feesPerConsultation}.Rs</p>

            <p>Experience : {doctor.experience}.yr</p>

            <p>
              Timing : {startTime} - {endTime}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="card" style="width: 18rem;">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Dr. {doctor.firstname} {doctor.lastname}
          </li>
          <li className="list-group-item">
            Speciality:{doctor.specialization}
          </li>
          <li className="list-group-item">
            <p>
              Timing: {startTime} - {endTime}
            </p>
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default DoctorList;

// src/Profile.js
import React from "react";
import Navbar from "../Components/Navbar";

function Profile() {
  // Static user data
  const userData = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    job: "Software Developer",
    avatarUrl: "https://via.placeholder.com/150",
  };

  return (
      <div>
          <Navbar/>
          <div style={{ width: "300px", margin: "50px auto", textAlign: "center" }}>
              <img
                  src={userData.avatarUrl}
                  alt="avatar"
                  style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
              <h1>{userData.name}</h1>
              <p>Email: {userData.email}</p>
              <p>Job: {userData.job}</p>
          </div>
      </div>
  );
}

export default Profile;

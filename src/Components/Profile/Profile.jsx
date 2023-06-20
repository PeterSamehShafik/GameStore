import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL, BEARERKEY } from "./../../index.js";
import Info from "./Info.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const getProfile = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .get(`${baseURL}/user/profile`, config)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    if (result?.data?.message == "done") {
      setProfile(result.data.user);
    }
  };
  function modifyButtons(e) {
    // ${e.target}
  }
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {profile ? (
        <div className="container profile">
          <header className="d-flex justify-content-between align-items-center mb-2">
            <Link to="/home" className="back-store h4 fw-bolder">
              <i className="fa-solid fa-arrow-left me-2"></i>
              <strong>Store</strong>
            </Link>
          </header>
          <div className="main-body">
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center ">
                      <img
                        src={profile.profilePic?.secure_url}
                        alt="Profile Picture"
                        className="rounded-circle img-fluid"
                        width="150"
                      />
                      <div className="mt-3">
                        <h4>
                          {profile.firstName} {profile.lastName}
                        </h4>
                        <h6 className="text-muted text-center">
                          username: {profile.userName}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card mb-3">
                  <ul class="fs-6 d-flex justify-content-between py-3 px-4 mb-0 rounded-2">
                    <li class="nav-item" onClick={modifyButtons}>
                      <Link to="info">Info</Link>
                    </li>
                    <li class="nav-item " onClick={modifyButtons}>
                      <Link to="activity">Activity</Link>
                    </li>
                    <li class="nav-item" onClick={modifyButtons}>
                      <Link to="wishlist">Wishlist</Link>
                    </li>
                    <li class="nav-item" onClick={modifyButtons}>
                      <Link to="following">Followers</Link>
                    </li>
                    <li class="nav-item">
                      <Link to="games">Games</Link>
                    </li>
                  </ul>
                </div>
                <Outlet context={[profile]} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-absolute top-0">
          <div className="sk-chase">
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
            <div className="sk-chase-dot"></div>
          </div>
        </div>
      )}
    </>
  );
}

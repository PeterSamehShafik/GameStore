import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, Outlet, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL, BEARERKEY } from "./../../index.js";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";


export default function Profile() {
  const { id } = useParams();
  if(id){
    localStorage.setItem("userId", id);
  }
  const [cropper, setCropper] = useState(null)
  const [profile, setProfile] = useState(null);
  const [pathname, setPathname] = useState("");
  const [file, setFile] = useState(null);
  const getProfile = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    if (id) {
      const result = await axios
        .get(`${baseURL}/user/profile/${id}`, config)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
      if (result?.data?.message === "done") {
        setProfile(result.data.user);
      }
    } else {
      const result = await axios
        .get(`${baseURL}/user/profile`, config)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
      if (result?.data?.message === "done") {
        setProfile(result.data.user);
      }
    }
  };
  function modifyButtons(e) {
    setPathname(e.target.id);
  }
  const inputImage = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      let Profile = { ...profile };
      Profile.temp = URL.createObjectURL(e.target.files[0]);
      setProfile(Profile);
    }
  };

  const saveImage = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    await axios
      .patch(
        `${baseURL}/user/profilePic`,
        {
          image: file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: BEARERKEY + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        // handle the response
        if (response.data.message === "done") {
          let temp = { ...profile };
          temp.profilePic.secure_url =
            response.data.updatedUser.profilePic.secure_url;
          setProfile(temp);
          setFile(null);
        }
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
  };
  const removePic = () => {
    let temp = { ...profile };
    delete temp.temp;
    setProfile(temp);
    setFile(null);
  };

  // const getCropData = async () => {
  //   if (cropper) {
  //     const file = await fetch(cropper.getCroppedCanvas().toDataURL())
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         return new File([blob], "newAvatar.png", { type: "image/png" });
  //       });
  //     if (file) {
  //       authService
  //         .uploadAvatar(userId, file)
  //         .then(() => {
  //           refetchUser(userId);
  //           cancelEdit();
  //         })
  //         .catch((e) => alert(e));
  //     }
  //   }
  // };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {profile ? (
        <div className="container profile">
          <header className="d-flex justify-content-between align-items-center mb-2">
            <Link to="/home" className="back-store h4 fw-bolder text-white">
              <i className="fa-solid fa-arrow-left me-2"></i>
              <strong>Store</strong>
            </Link>
          </header>
          <div className="main-body">
            <div className="row">
              <div className="col-md-4">
                <div className="card ">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center">
                      <div className="profile-img position-relative">
                        {
                          localStorage.getItem("userId")?
                          ''
                          :
                          <div className="image-upload position-absolute top-0 end-0">
                            <label htmlFor="file-input">
                              <i className="fa-regular fa-pen-to-square fa-lg"></i>
                            </label>
                            <input id="file-input" type="file" onChange={inputImage} />
                          </div>
                        }
                          {/* <Cropper
                            src={profile.temp}
                            style={{ height: 400, width: 400 }}
                            initialAspectRatio={4 / 3}
                            minCropBoxHeight={100}
                            maxCropBoxHeight={100}
                            minCropBoxWidth={100}
                            guides={false}
                            checkOrientation={false}
                            onInitialized={(instance) => {
                              setCropper(instance);
                            }}
                          /> */}
                          {/* <button onClick={getCropData}>Crop Image</button> */}
                        <img
                          src={
                            profile.temp
                              ? profile.temp
                              : profile.profilePic?.secure_url
                          }
                          alt="Profile"
                          className="rounded-circle img-fluid "
                          width="150"
                        />
                      </div>
                      <div className="save-image-buttons d-flex justify-content-between">
                        {file ? (
                          <div className="mt-2">
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={saveImage}
                            >
                              {" "}
                              Save{" "}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={removePic}
                            >
                              {" "}
                              Cancel{" "}
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
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
                  <nav className="navbar navbar-expand-sm navbar-light bg-dark-grey">
                    <div className="">
                      <div className="ms-auto">
                        <button
                          className="navbar-toggler"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#navbarNav"
                          aria-controls="navbarNav"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span className="navbar-toggler-icon"></span>
                        </button>
                      </div>
                      <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="fs-6 py-2 px-4 mb-0 rounded-2 navbar-nav">
                          <li
                            className="nav-item me-lg-5 me-sm-3"
                            onClick={modifyButtons}
                          >
                            <Link
                              className={
                                pathname === "info" ? "text-violet" : ""
                              }
                              to="info"
                              id="info"
                            >
                              Info
                            </Link>
                          </li>
                          <li
                            className="nav-item me-lg-5 me-sm-3 "
                            onClick={modifyButtons}
                          >
                            <Link
                              className={
                                pathname === "activity" ? "text-violet" : ""
                              }
                              to="activity"
                              id="activity"
                            >
                              Activity
                            </Link>
                          </li>
                          {
                            localStorage.getItem("userId")?
                            ''
                            :
                            <li
                              className="nav-item me-lg-5 me-sm-3"
                              onClick={modifyButtons}
                            >
                              
                              <Link
                                className={
                                  pathname === "wishlist" ? "text-violet" : ""
                                }
                                to="wishlist"
                                id="wishlist"
                              >
                                Wishlist
                              </Link>
                            </li>
                          }
                          <li
                            className="nav-item me-lg-5 me-sm-3"
                            onClick={modifyButtons}
                          >
                            <Link
                              className={
                                pathname === "following" ? "text-violet" : ""
                              }
                              to="following"
                              id="following"
                            >
                              Followers
                            </Link>
                          </li>
                          <li
                            className="nav-item me-lg-5 me-sm-3"
                            onClick={modifyButtons}
                          >
                            <Link
                              className={
                                pathname === "games" ? "text-violet" : ""
                              }
                              to="games"
                              id="games"
                            >
                              Games
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
                <Outlet context={[profile, setProfile]} />
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

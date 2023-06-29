import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL, BEARERKEY } from "./../../index.js";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Profile({ crrUser, currentUser }) {
  const { id } = useParams();
  if (id) {
    localStorage.setItem("id", id);
  }
  // crop Image
  const [showCropper, setShowCropper] = useState(false);
  const [cropper, setCropper] = useState(null);
  //end of crop
  const [isFollowed, setIsFollowed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pathname, setPathname] = useState("");
  const [file, setFile] = useState(null);
  const [reload, setReload] = useState(false);

  //modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    header: "",
    body: "",
    isMainBtn: true,
  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const callModal = ({
    header = "Are you sure?",
    body,
    closeBtnColor = "secondary",
    closeBtnTxt = "Close",
    mainBtnColor = "primary",
    mainBtnTxt,
    mainBtnFunc,
    isMainBtn = true,
    isCloseBtn = true,
    isStatic = false,
  } = {}) => {
    setModalData({
      ...modalData,
      header,
      body,
      closeBtnColor,
      closeBtnTxt,
      mainBtnColor,
      mainBtnTxt,
      mainBtnFunc,
      isMainBtn,
      isCloseBtn,
      isStatic,
    });
    handleShowModal();
  };
  const applyCloseModel = () => {
    modalData.mainBtnFunc();
    handleCloseModal();
  };
  //end of modal

  const navigate = useNavigate();

  const getProfile = async () => {
    setReload(true);
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
          if (
            error.response?.data?.message === "JsonWebTokenError: jwt malformed"
          ) {
            navigate("/login");
          }
        });
      if (result?.data?.message === "done") {
        setProfile(result.data.user);
        setReload(false);
      }
    } else {
      const result = await axios
        .get(`${baseURL}/user/profile`, config)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
          if (
            error.response?.data?.message === "JsonWebTokenError: jwt malformed"
          ) {
            navigate("/login");
          }
        });
      if (result?.data?.message === "done") {
        setProfile(result.data.user);
        setReload(false);
      }
    }
    checkIsFollowed();
  };
  function modifyButtons(e) {
    setPathname(e.target.id);
  }

  //Edit Image
  const inputImage = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      let Profile = { ...profile };
      Profile.temp = URL.createObjectURL(e.target.files[0]);
      setShowCropper(true);
      setProfile(Profile);
    }
  };
  const saveImage = async () => {
    if (!file) {
      return;
    }
    callModal({
      header: "Loading",
      body: "Please wait....",
      isMainBtn: false,
      isCloseBtn: false,
      isStatic: true,
    });
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
          handleCloseModal();
          callModal({
            header: "Success!",
            body: "The profile picture updated successfully",
            isMainBtn: false,
            closeBtnTxt: "Close",
            closeBtnColor: "success",
          });
          let temp = { ...profile };
          temp.profilePic.secure_url =
            response.data.updatedUser.profilePic.secure_url;
          setProfile(temp);
          setFile(null);
          currentUser();
        }
      })
      .catch((error) => {
        // handle errors
        console.log(error);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      });
  };
  const removePic = () => {
    let temp = { ...profile };
    delete temp.temp;
    setProfile(temp);
    setShowCropper(false);
    setFile(null);
  };
  const getCropData = async () => {
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "newAvatar.png", { type: "image/png" });
        });
      if (file) {
        let Profile = { ...profile };
        Profile.temp = URL.createObjectURL(file);
        setFile(file);
        setProfile(Profile);
        setShowCropper(false);
      }
    }
  };

  //Following
  const checkIsFollowed = () => {
    if (localStorage.getItem("id") === crrUser?._id) {
      localStorage.setItem("userId", "owner");
    }
    let checkId = localStorage.getItem("id");
    if (crrUser) {
      const check = crrUser?.following.find((person) => person._id === checkId);
      if (check) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    }
  };
  const removeFollowing = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .patch(`${baseURL}/user/following/remove/${id}`, { body: "" }, config)
      .catch((e) => {
        console.log(e);
      });
    if (result?.data?.message === "done") {
      setIsFollowed(false);
      currentUser();
    }
  };
  const addFollowing = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .patch(`${baseURL}/user/following/add/${id}`, { body: "" }, config)
      .catch((e) => {
        console.log(e);
      });
    if (result?.data?.message === "done") {
      setIsFollowed(true);
      currentUser();
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    checkIsFollowed();
  }, [crrUser]);

  useEffect(() => {
    getProfile();
  }, [localStorage.getItem("id")]);

  return (
    <>
      {profile && !reload ? (
        <>
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
                          {localStorage.getItem("userId") === "user" ? (
                            ""
                          ) : (
                            <div className="image-upload position-absolute top-0 end-0">
                              <label htmlFor="file-input">
                                <i className="fa-regular fa-pen-to-square fa-lg"></i>
                              </label>
                              <input
                                id="file-input"
                                type="file"
                                onChange={inputImage}
                              />
                            </div>
                          )}
                          {showCropper ? (
                            <div className="text-center">
                              <Cropper
                                id="cropperComp"
                                src={profile.temp}
                                initialAspectRatio={6 / 6}
                                aspectRatio={6 / 6}
                                responsive={true}
                                minCropBoxHeight={100}
                                minCropBoxWidth={100}
                                guides={false}
                                autoCropArea={0.9}
                                movable={false}
                                checkOrientation={true}
                                onInitialized={(instance) => {
                                  setCropper(instance);
                                }}
                                className="w-100 h-100"
                              />
                              <button
                                onClick={getCropData}
                                className="btn btn-outline-info mt-2"
                              >
                                Crop Image
                              </button>
                            </div>
                          ) : (
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
                          )}
                        </div>
                        <div className="save-image-buttons d-flex justify-content-between">
                          {file && !showCropper ? (
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
                        <div className="mt-3 text-center">
                          <h4>
                            {profile.firstName} {profile.lastName}
                          </h4>
                          <h6 className="text-muted text-center">
                            username: {profile.userName}
                          </h6>
                          {localStorage.getItem("userId") === "owner" ? (
                            ""
                          ) : isFollowed ? (
                            <button
                              className="btn btn-info mt-2"
                              onClick={removeFollowing}
                            >
                              {" "}
                              Unfollow{" "}
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-info mt-2"
                              onClick={addFollowing}
                            >
                              {" "}
                              Follow{" "}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="mb-3">
                    <nav className="navbar navbar-expand-sm navbar-light bg-dark-grey ">
                      <div className="container-fluid ">
                        <div className="">
                          <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                          >
                            {/* <span className="navbar-toggler-icon text-white"></span> */}
                            <i class="fa-solid fa-bars toggler-icon"></i>
                          </button>
                        </div>
                        <div
                          className="collapse navbar-collapse text-center"
                          id="navbarNav"
                        >
                          <ul className="fs-6 py-2  mb-0 rounded-2 navbar-nav mx-auto mt-sm-0 mt-2 w-100 d-flex justify-content-around">
                            <li className="nav-item" onClick={modifyButtons}>
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
                            <div className="line-grey d-block d-sm-none my-1"></div>
                            {localStorage.getItem("userId") === "user" ? (
                              ""
                            ) : (
                              <>
                                <li
                                  className="nav-item "
                                  onClick={modifyButtons}
                                >
                                  <Link
                                    className={
                                      pathname === "activity"
                                        ? "text-violet"
                                        : ""
                                    }
                                    to="activity"
                                    id="activity"
                                  >
                                    Activity
                                  </Link>
                                </li>
                                <div className="line-grey w-100 d-block d-sm-none my-1"></div>
                                <li
                                  className="nav-item"
                                  onClick={modifyButtons}
                                >
                                  <Link
                                    className={
                                      pathname === "wishlist"
                                        ? "text-violet"
                                        : ""
                                    }
                                    to="wishlist"
                                    id="wishlist"
                                  >
                                    Wishlist
                                  </Link>
                                </li>
                                <div className="line-grey w-100 d-block d-sm-none my-1"></div>
                              </>
                            )}
                            <li className="nav-item" onClick={modifyButtons}>
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
                            <div className="line-grey w-100 d-block d-sm-none my-1"></div>
                            <li className="nav-item" onClick={modifyButtons}>
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
                  <Outlet context={[profile, setProfile, getProfile]} />
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            className="text-white"
            backdrop={modalData.isStatic ? "static" : true}
            keyboard={modalData.isStatic ? false : true}
          >
            {modalData.isStatic ? (
              <Modal.Header>
                <Modal.Title>{modalData.header}</Modal.Title>
              </Modal.Header>
            ) : (
              <Modal.Header closeButton>
                <Modal.Title>{modalData.header}</Modal.Title>
              </Modal.Header>
            )}

            <Modal.Body>{modalData.body}</Modal.Body>
            <Modal.Footer>
              {modalData.isCloseBtn == true ? (
                <Button
                  variant={modalData.closeBtnColor}
                  onClick={handleCloseModal}
                >
                  {modalData.closeBtnTxt}
                </Button>
              ) : (
                ""
              )}
              {modalData.isMainBtn == true ? (
                <Button
                  variant={modalData.mainBtnColor}
                  onClick={applyCloseModel}
                >
                  {modalData.mainBtnTxt}
                </Button>
              ) : (
                ""
              )}
            </Modal.Footer>
          </Modal>
        </>
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

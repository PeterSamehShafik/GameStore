import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StartScreen.css";
import axios from "axios";
import { baseURL, roles } from "../../index.js";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import { motion } from "framer-motion";
//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function StartScreen({ currentUser }) {
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
    });
    handleShowModal();
  };
  const applyCloseModel = () => {
    modalData.mainBtnFunc();
    handleCloseModal();
  };
  //end of modal

  const [game, setGame] = useState({
    slug: "",
    _id: "",
  });
  const [checked, setChecked] = useState(true);
  const getRandomGame = async () => {
    const result = await axios.get(`${baseURL}/game/random`).catch((e) => {
      console.log(e);
    });
    if (result?.data?.message === "done") {
      setGame(result?.data?.game);
    }
  };
  useEffect(() => {
    getRandomGame();
    // setChecked(false)
  }, []);

  // Popper
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
    setOpen2(false);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
    setOpen2((previousOpen) => !previousOpen);
    setOpen(false);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const canBeOpen2 = open2 && Boolean(anchorEl2);
  const id1 = canBeOpen ? "transition-popper" : undefined;
  const id2 = canBeOpen2 ? "transition-popper" : undefined;

  //End of popper

  return (
    <>
      <motion.main
        className="main__container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="myVideo">
          <video autoPlay muted loop>
            <source src="/liveWP.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="d-flex justify-content-center">
          <div className="show-content bg-blur p-2 d-inline-block  rounded-pill">
            <div className="form-check form-switch text-blue fw-bold">
              {checked ? (
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  checked
                  onChange={() => {
                    setChecked(false);
                  }}
                />
              ) : (
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => {
                    setChecked(true);
                  }}
                />
              )}
              <label className="form-check-label" for="flexSwitchCheckChecked">
                {checked ? "Hide content" : "Show content"}
              </label>
            </div>
          </div>
        </div>
        {checked && (
          <div className="start-screen d-flex align-items-center mt-5">
            <div className="container-fluid ">
              <div className="row g-3">
                <div className="col-lg-7">
                  <div className="first-row px-lg-0 px-sm-5 px-2">
                    <div className="info p-3 bg-blur d-flex flex-column text-center rounded-top border-info border-bottom ">
                      <h1 className="display-1 fw-bolder">Game Store</h1>
                      <p>
                        The best destination to buy new games to competitive
                        prices. 24 hour support, "best price" guarantee and a
                        flawless UX. Wish for more? Tell us below — or check out
                        our careers.
                      </p>
                    </div>
                    <div className="app-route bg-blur rounded-bottom">
                      <div className="container">
                        <div className="row g-3 justify-content-center py-3 ">
                          <div className="col-md-6 ps-0 pe-1 col-lg-3 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <Link
                                to="/home"
                                className=" btn btn-info rounded-5 mt-2 w-100"
                              >
                                {/* <button className="w-sm-75 btn btn-info rounded-5 mt-2 w-md-100"> */}
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                <span className="ms-1">Browse</span>
                                {/* </button> */}
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-6 ps-0 pe-1 col-lg-3 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <Link
                                to={`/details/${game.slug}/${game._id}`}
                                className="w-100 btn btn-light rounded-5 mt-2"
                              >
                                {/* <button className="w-sm-75 btn btn-light rounded-5 mt-2 w-md-100"> */}
                                <i className="fa-solid fa-dice"></i>
                                <span className="ms-1">Random</span>
                                {/* </button> */}
                              </Link>
                            </div>
                          </div>
                          <div className="col-md-6 ps-0 pe-1 col-lg-3 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <div>
                                <button
                                  aria-describedby={id1}
                                  type="button"
                                  onClick={handleClick}
                                  className=" btn btn-light rounded-5 mt-2 w-100"
                                >
                                  <i className="fa-brands fa-github"></i> Github
                                </button>
                                <Popper
                                  id={id1}
                                  open={open}
                                  anchorEl={anchorEl}
                                  transition
                                >
                                  {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={350}>
                                      <Box
                                        sx={{
                                          border: 1,
                                          p: 1,
                                          bgcolor: "background.paper",
                                        }}
                                      >
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href="https://github.com/PeterSamehShafik/GameStore"
                                          className=" btn btn-light rounded-5 mt-2 w-100 text-dark"
                                        >
                                          Frontend
                                        </a>
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href="https://github.com/ahmedessamrizk/GameStore_BE"
                                          className=" btn btn-light rounded-5 mt-2 w-100 text-dark"
                                        >
                                          Backend
                                        </a>
                                      </Box>
                                    </Fade>
                                  )}
                                </Popper>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 ps-0 pe-1 col-lg-3 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <div>
                                <button
                                  aria-describedby={id2}
                                  type="button"
                                  onClick={handleClick2}
                                  className=" btn btn-light rounded-5 mt-2 w-100"
                                >
                                  <i className="fa-brands fa-linkedin-in"></i>{" "}
                                  LinkedIn
                                </button>
                                <Popper
                                  id={id2}
                                  open={open2}
                                  anchorEl={anchorEl2}
                                  transition
                                >
                                  {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={350}>
                                      <Box
                                        sx={{
                                          border: 1,
                                          p: 1,
                                          bgcolor: "background.paper",
                                        }}
                                      >
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href="https://www.linkedin.com/in/ahmed-essam7722/"
                                          className=" btn btn-light rounded-5 mt-2 w-100 text-dark"
                                        >
                                          Ahmed Essam
                                        </a>
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href="https://www.linkedin.com/in/peter-sameh-38b914220/"
                                          className=" btn btn-light rounded-5 mt-2 w-100 text-dark"
                                        >
                                          Peter Sameh
                                        </a>
                                      </Box>
                                    </Fade>
                                  )}
                                </Popper>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="offset-lg-2 col-lg-3 px-lg-1 px-sm-5 px-3">
                  <div className="info bg-blur d-flex flex-column text-center text-white rounded mx-sm-1">
                    <h3 className="fw-bolder mt-3">Quick Navigation</h3>
                    <div className="app-route mt-4 pb-3 px-lg-4 px-md-5 px-0  d-flex flex-column align-items-center">
                      <div className="container">
                        <div className="row g-3 justify-content-center py-3 ">
                          <div className="px-0 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <button
                                onClick={() => {
                                  callModal({
                                    header: "What's new?",
                                    body: (
                                      <>
                                        <ol>
                                          <li>
                                            {" "}
                                            Adding notifications feature.{" "}
                                          </li>
                                          <li> Routing animation. </li>
                                          <li> Google sign in. </li>
                                          <li> Bug Fixes. </li>
                                        </ol>
                                        <p>
                                          With these exciting updates, the
                                          website now offers a seamless user
                                          experience, empowering visitors to
                                          effortlessly explore and engage with
                                          its enhanced features.
                                        </p>
                                      </>
                                    ),
                                    isMainBtn: false,
                                    closeBtnTxt: "Let's play",
                                    closeBtnColor: "success",
                                  });
                                }}
                                className="btn btn-light my-1 rounded-5 px-3 w-100 "
                              >
                                {/* <button className="btn btn-light my-1 rounded-5 px-3 w-100 "> */}
                                <i class="fa-solid fa-bell fa-shake"></i>
                                <span className="ms-2">What's new?</span>
                                {/* </button> */}
                              </button>
                            </div>
                          </div>
                          <div className="px-0 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <Link
                                to="home"
                                className="btn btn-light mb-1 rounded-5 px-3 w-100 "
                              >
                                {/* <button className="btn btn-light mb-1 rounded-5 px-3 w-100 "> */}
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                <span className="ms-2">Game Page</span>
                                {/* </button> */}
                              </Link>
                            </div>
                          </div>
                          <div className="px-0 d-flex justify-content-center">
                            <div className="w-100 px-lg-0 px-4">
                              <Link
                                to="/404"
                                className="btn btn-light my-1 rounded-5 px-3 w-100 "
                              >
                                {/* <button className="btn btn-light my-1 rounded-5 px-3 w-100 "> */}
                                <i className="fa-solid fa-bug"></i>
                                <span className="ms-2">404 Page</span>
                                {/* </button> */}
                              </Link>
                            </div>
                          </div>
                          {currentUser ? (
                            <>
                              <div className="px-0 d-flex justify-content-center">
                                <div className="w-100 px-lg-0 px-4">
                                  <Link
                                    to="/profile"
                                    onClick={() => {
                                      localStorage.setItem("userId", "owner");
                                      localStorage.setItem(
                                        "id",
                                        currentUser._id
                                      );
                                    }}
                                    className="btn btn-light my-1 rounded-5 px-3 w-100 "
                                  >
                                    {/* <button className="btn btn-light my-1 rounded-5 px-3 w-100 "> */}
                                    <i className="fa-solid fa-user"></i>
                                    <span className="ms-2">Profile</span>
                                    {/* </button> */}
                                  </Link>
                                </div>
                              </div>
                              <div className="px-0 d-flex justify-content-center">
                                <div className="w-100 px-lg-0 px-4">
                                  {currentUser.role === roles.superAdmin ||
                                  currentUser === roles.admin ? (
                                    <Link
                                      to="/cpanel"
                                      className="btn btn-light my-1 rounded-5 px-3 w-100 "
                                    >
                                      {/* <button className="btn btn-light my-1 rounded-5 px-3 w-100 "> */}
                                      <i className="fa-brands fa-cpanel"></i>
                                      <span className="ms-2">
                                        Control Panel
                                      </span>
                                      {/* </button> */}
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      {/* <button className='btn btn-light my-1 rounded-5 px-4 py-2'>
                                    <i className="fa-solid fa-bug"></i>
                                    <span className="ms-2">404 Query</span>
                                </button>
                                <button className='btn btn-light my-1 rounded-5 px-4 py-2'>
                                    <i className="fa-solid fa-address-card"></i>
                                    <span className="ms-2">About</span>
                                </button> */}
                    </div>
                  </div>
                </div>
                <Modal
                  size="lg"
                  show={showModal}
                  onHide={handleCloseModal}
                  className="text-white"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{modalData.header}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{modalData.body}</Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant={modalData.closeBtnColor}
                      onClick={handleCloseModal}
                    >
                      {modalData.closeBtnTxt}
                    </Button>
                    {modalData.isMainBtn === true ? (
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
              </div>
            </div>
          </div>
        )}
      </motion.main>
    </>
  );
}

export default StartScreen;

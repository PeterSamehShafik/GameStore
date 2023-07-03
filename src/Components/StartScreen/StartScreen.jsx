import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StartScreen.css";
import axios from "axios";
import { baseURL, roles } from "../../index.js";

function StartScreen({ currentUser }) {
  const [game, setGame] = useState({
    slug: "",
    _id: "",
  });
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
  }, []);

  return (
    <>
      <div className="myVideo">
        <video autoPlay muted loop>
          <source src="/liveWP.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="start-screen d-flex align-items-center mt-5">
        <div className="container-fluid ">
          <div className="row g-3">
            <div className="col-lg-7">
              <div className="first-row px-lg-0 px-sm-5 px-2">
                <div className="info p-3 bg-blur d-flex flex-column text-center rounded-top border-info border-bottom ">
                  <h1 className="display-1 fw-bolder">Game Store</h1>
                  <p>
                    The best destination to buy new games to competitive prices.
                    24 hour support, "best price" guarantee and a flawless UX.
                    Wish for more? Tell us below — or check out our careers.
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
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.google.com"
                            className=" btn btn-light rounded-5 mt-2 w-100"
                          >
                            {/* <button className="w-sm-75 btn btn-light rounded-5 mt-2 w-md-100"> */}
                            <i className="fa-brands fa-github"></i>
                            <span className="ms-1">Github</span>
                            {/* </button> */}
                          </a>
                        </div>
                      </div>
                      <div className="col-md-6 ps-0 pe-1 col-lg-3 d-flex justify-content-center">
                        <div className="w-100 px-lg-0 px-4">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.google.com"
                            className=" btn btn-light rounded-5 mt-2 w-100"
                          >
                            {/* <button className="w-sm-75 btn btn-light rounded-5 mt-2 w-md-100"> */}
                            <i className="fa-brands fa-linkedin-in"></i>
                            <span className="ms-1">LinkedIn</span>
                            {/* </button> */}
                          </a>
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
                                onClick={()=>{
                                  localStorage.setItem("userId", "owner")
                                  localStorage.setItem("id", currentUser._id)
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
                                  <span className="ms-2">Control Panel</span>
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
          </div>
        </div>
      </div >
    </>
  );
}

export default StartScreen;

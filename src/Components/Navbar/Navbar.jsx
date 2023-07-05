import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BEARERKEY, baseURL, roles } from "./../../index";
import { useScroll } from "./../../utilities/scrollNav";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Avatar from "@mui/material/Avatar";

function Navbar({ currentUser, removeUser, cart, setSearch, setPage, notifyCount, setNotifyCount }) {
  const location = useLocation();
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const [temp, setTemp] = useState(0)
  const [notifications, setNotifications] = useState(null);
  // const [limit, setLimit] = useState(5)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    hideNave();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const hideNave = () => {
    document.getElementById("navbarSupportedContent").classList.remove("show");
  };

  //handel scrolling hide
  const { scrollDirection } = useScroll();

  

  const getNotifications = async (e) => {
    handleClick(e);
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .get(`${baseURL}/user/notifications`, config)
      .catch((e) => console.log(e));
    // console.log(result)
    if (result?.data?.message === "done") {
      setTemp(notifyCount)
      setNotifyCount(0);
      setNotifications(result.data.user.notifications);
    }
  };

  // useEffect(() => {
    
  // }, []);

  return (
    <>
      <nav
        className={
          scrollDirection === "down"
            ? "main-nav navbar top-nav navbar-expand-lg navbar-dark text-white position-fixed w-100 bg-dark top-0"
            : "main-nav navbar top-nav navbar-expand-lg navbar-dark text-white position-fixed w-100 bg-dark top-minus"
        }
      >
        <div className="container-fluid px-lg-5">
          <Link onClick={hideNave} to="/" className="navbar-brand">
            <i className="fa-solid fa-gamepad me-3"></i>
            <span className="fw-bolder">Game Store</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon text-white"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {!location.pathname.toLowerCase().includes("home") ? (
              ""
            ) : (
              <div
                className="d-flex align-items-center m-auto ms-lg-auto w-50 d-lg-inline-flex d-none"
                role="search"
              >
                <input
                  className="form-control me-2 search text-white"
                  type="search"
                  placeholder="Search games..."
                  aria-label="Search"
                  onChange={handleSearch}
                />
                <i className="fa-solid fa-magnifying-glass close-search "></i>
              </div>
            )}

            <ul className="navbar-nav navbar-nav-list ms-auto mb-2 mb-lg-0 d-flex align-items-center ">
              {location.pathname.toLowerCase() === "/" ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/home"
                      className="nav-link text-white fw-bolder ms-2 py-1"
                      aria-current="page"
                      onClick={hideNave}
                    >
                      <i className=" fa-solid fa-magnifying-glass me-1"></i>
                      <span>Browse Store</span>
                    </Link>
                  </li>
                  <div className="line-grey w-100 d-block d-lg-none my-1"></div>
                </>
              ) : (
                ""
              )}

              {currentUser ? (
                <>
                  {currentUser.role === roles.admin ||
                  currentUser.role === roles.superAdmin ? (
                    <>
                      <li className="nav-item">
                        <div className="nav-link cursor-normal text-white fw-bolder mx-2">
                          <Link
                            to="/cpanel"
                            onClick={hideNave}
                            className="c-panel d-lg-flex align-items-center text-warning"
                          >
                            <i className="fa-solid fa-gear fa-spin"></i>
                            <span className="ms-1 ">C.Panel</span>
                          </Link>
                        </div>
                      </li>
                      <div className="line-grey w-100 d-block d-lg-none my-1"></div>
                    </>
                  ) : (
                    ""
                  )}

                  <li className="nav-item">
                    <div
                      className="nav-link text-white fw-bolder ms-2"
                      aria-current="page"
                    >
                      <Link
                        to={`/profile/info/${currentUser?._id}`}
                        onClick={() => {
                          localStorage.setItem("userId", "owner");
                          hideNave();
                        }}
                      >
                        <button
                          onClick={hideNave}
                          className="glow-on-hover bg-dark d-flex align-items-center"
                          type="button"
                        >
                          <img
                            src={currentUser?.profilePic?.secure_url}
                            className="img-fluid rounded-circle"
                          />
                          <span className="ms-2">{currentUser?.firstName}</span>
                        </button>
                      </Link>
                    </div>
                  </li>

                  <div className="line-grey w-100 d-block d-lg-none my-1"></div>

                  <li className="nav-item py-2 mx-md-3">
                    <div
                      className="notify-section position-relative "
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={open ? handleClose : getNotifications}
                    >
                      <div className="notify-icon bg-white text-dark rounded-circle p-0 px-1 cursor-pointer ">
                        <i className="fa-solid fa-earth-americas text-dark"></i>
                      </div>
                      {notifyCount !== 0 ? (
                        <span className="position-absolute d-inline-block p-1 top-0 start-100 translate-middle badge rounded-circle bg-danger p-0">
                          {notifyCount}
                        </span>
                      ) : (
                        ""
                      )}
                      {/* Notifications Body */}
                      <Menu
                        className="mt-1"
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <div class="notifications py-2 bg-secondary text-dark fw-bold" id="box">
                          <h2 className="h6 px-2  fw-bolder text-black-50">Notifications</h2>
                          <hr className="my-1"/>
                          {notifications?.map((notify, idx) => {
                            return (
                              <>
                                <div className={idx < temp && temp !== 0? "notifications-item p-2 bg-notify" : "notifications-item p-2 "}>
                                  {" "}
                                    <Link to={`/details/${notify.gameSlug}/${notify.gameId}`}>
                                  <div className="d-flex">
                                    <Avatar
                                      alt="Notify"
                                      src="https://img.freepik.com/premium-vector/gamer-streamer-mascot-logo-vector-illustration_382438-609.jpg"
                                      />
                                  <div class="text ms-2">
                                    <p className="mb-0"><b>{notify.message.split('has')[0]}</b> has {notify.message.split('has')[1]}</p>
                                  </div>
                                  </div>
                                      </Link>
                                </div>
                                    <hr className="my-0" />
                              </>
                            );
                          })}
                        </div>
                      </Menu>
                    </div>
                  </li>

                  <div className="line-grey w-100 d-block d-lg-none my-1"></div>

                  <li className="nav-item py-2 mx-md-2">
                    <div
                      className="cart-section  position-relative"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExample"
                      aria-controls="offcanvasExample"
                    >
                      <div className="cart-icon bg-white text-dark rounded-circle p-0 px-1 cursor-pointer ">
                        <FontAwesomeIcon icon="fa-solid fa-bag-shopping fa-xl" />
                      </div>
                      {cart?.games?.length !== 0 ? (
                        <span className = {cart?.games?.length? "position-absolute d-inline-block p-1 top-0 start-100 translate-middle badge rounded-circle bg-danger p-0" : "position-absolute d-inline-block top-0 start-100 translate-middle badge rounded-circle bg-danger p-0"}>
                          {cart?.games?.length !== 0
                            ? cart?.games?.length
                            : "0"}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>

                  {/* <li className="nav-item">
                    <div
                      onClick={hideNave}
                      className="nav-link text-white fw-bolder ms-2"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExample"
                      aria-controls="offcanvasExample"
                    >
                      <div className="cart-nav position-relative">
                        <FontAwesomeIcon icon="fa-solid fa-bag-shopping fa-xl" />
                        <span className=" count position-absolute">
                          {cart.games ? `${cart?.games?.length}` : ""}
                        </span>
                      </div>
                    </div>
                  </li> */}
                  <div className="line-grey w-100 d-block d-lg-none my-1"></div>
                  <li className="nav-item" onClick={removeUser}>
                    <div
                      onClick={hideNave}
                      className="nav-link text-white fw-bolder ms-2"
                      aria-current="page"
                    >
                      <span>Logout</span>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      onClick={hideNave}
                      to="login"
                      className="nav-link text-white fw-bolder mx-4 my-2 "
                      aria-current="page"
                    >
                      <div>
                        <span>Login</span>
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={hideNave}
                      to="signup"
                      className="nav-link text-white fw-bolder mx-4 my-2"
                      aria-current="page"
                    >
                      <div>
                        <span>Sign up</span>
                      </div>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

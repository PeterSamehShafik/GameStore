import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { roles } from "./../../index";

function Navbar({ currentUser, removeUser, cart, setSearch }) {
  const location = useLocation();
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const hideNave = () => {
    document.getElementById('navbarSupportedContent').classList.remove('show')

  }

  return (
    <>
      <nav className="main-nav navbar top-nav navbar-expand-lg navbar-dark text-white position-fixed w-100 bg-dark top-0">
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
            {!location.pathname.toLowerCase().includes("home")  || !currentUser ? (
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
              {location.pathname.toLowerCase() === "/" ? <>
                <li className="nav-item" >
                  <Link
                    to='/home'
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
                :
                ""
              }

              {currentUser ? (
                <>
                  {currentUser.role === roles.admin ||
                    currentUser.role === roles.superAdmin ? (
                    <>
                      <li className="nav-item">
                        <div className="nav-link text-white fw-bolder mx-2">
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
                        to={`/profile/info/${currentUser._id}`}
                        onClick={() => {
                          localStorage.setItem("userId", "owner");
                          hideNave()
                        }}
                      >
                        <button onClick={hideNave} class="glow-on-hover bg-dark" type="button">
                          <img
                            src={currentUser.profilePic.secure_url}
                            className="img-fluid rounded-circle"
                          />
                          <span className="ms-2">{currentUser?.firstName}</span>
                        </button>
                      </Link>
                    </div>
                  </li>

                  <div className="line-grey w-100 d-block d-lg-none my-1"></div>
                  <li className="nav-item"
                  >
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
                          {cart.games ? `${cart?.games?.length}` : "0"}
                        </span>
                      </div>
                    </div>
                  </li>
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

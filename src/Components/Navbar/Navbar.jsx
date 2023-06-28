import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { roles } from './../../index';

function Navbar({ currentUser, removeUser, cart, setSearch }) {
  const location = useLocation();
  const handleSearch = (e) => {
    setSearch(e.target.value)
  }
  const games = [];
  return (
    <>
      <nav className="navbar top-nav navbar-expand-lg navbar-dark text-white position-sticky ">
        <div className="container-fluid px-5">
          <Link to="/" className="navbar-brand">
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
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {location.pathname === "/" ? (
              ""
            ) : (
              <div
                className="d-flex align-items-center m-auto ms-lg-auto w-50"
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
            <ul className="navbar-nav">
              {location.pathname === "/" ? (
                <Link to="/home" className="ms-lg-5 ms-4 navbar-brand">
                  <i className="fa-solid fa-cart-shopping me-3"></i>
                  <span className="fw-bolder">Browse Store</span>
                </Link>
              ) : (
                ""
              )}
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
              {currentUser ? (
                <>
                  {currentUser.role === roles.admin || currentUser.role === roles.superAdmin ?
                    <li className="nav-item">
                      <div className="nav-link text-white fw-bolder mx-2">
                        <Link to="/cpanel" className="c-panel d-flex align-items-center text-warning">
                          <i className="fa-solid fa-gear fa-spin" ></i>
                          <span className="ms-1 " >C.Panel</span>
                        </Link>
                      </div>
                    </li> : ""}

                  <li className="nav-item">
                    <div
                      className="nav-link text-white fw-bolder ms-2"
                      aria-current="page"
                    >
                      <Link to={`/profile/info/${currentUser._id}`} onClick={() => { localStorage.setItem("userId", 'owner') }}>
                        <img src={currentUser.profilePic.secure_url} className="img-fluid rounded-circle" />
                        <span className="ms-2">{currentUser?.firstName}</span>
                      </Link>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div
                      className="nav-link text-white fw-bolder ms-2"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExample"
                      aria-controls="offcanvasExample"
                    >
                      <FontAwesomeIcon icon="fa-solid fa-bag-shopping" />
                      <span className="ms-3">
                        {cart.games ? (
                          <>Cart: {cart?.games?.length}</>
                        ) : (
                          <>Cart: 0</>
                        )}
                      </span>
                    </div>
                  </li>
                  <li className="nav-item" onClick={removeUser}>
                    <div
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
                    <div
                      className="nav-link text-white fw-bolder mx-4"
                      aria-current="page"
                    >
                      <Link to="login">Login</Link>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div
                      className="nav-link text-white fw-bolder mx-4"
                      aria-current="page"
                    >
                      <Link to="signup">Signup</Link>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav >
    </>
  );
}

export default Navbar;

import React, { useState } from "react";
import Joi from "joi";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { baseURL } from "../../index.js";
import "./SignUp.css";

export default function Signup() {
  let navigate = useNavigate();

  //Data
  const [apiFlag, setApiFlag] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
    DOB: "",
  });
  const [ErrList, setErrList] = useState([]);
  const [APIRes, setAPIRes] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  //Functions
  function getUser(e) {
    setAPIRes(null);
    let newUser = { ...user };
    let data = e.target.value;
    newUser[e.target.id] = data;
    setUser(newUser);
    checkInputs(newUser, e);
  }
  function checkInputs(newUser, e) {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(10).alphanum().required(),
      userName: Joi.string().min(3).max(10).alphanum().required(),
      DOB: Joi.date(),
      phone: Joi.number().min(5),
      lastName: Joi.string().min(3).max(10).alphanum().required(),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
    });
    let joiResponse = schema.validate(newUser, { abortEarly: false });
    let inputField = e.target;
    if (inputField.id === "DOB") {
      return;
    }
    if (joiResponse.error) {
      let errors = joiResponse.error.details;
      let errorFlag,
        i = 0;
      for (i = 0; i < errors.length; i++) {
        if (errors[i].context.label === inputField?.id) {
          errorFlag = true;
          break;
        }
      }

      if (errorFlag) {
        inputField?.nextElementSibling.classList.remove("d-none");
        inputField?.classList.add("invalid-input");
        inputField?.classList.remove("valid-input");
        inputField?.nextElementSibling.children[1].classList.remove("d-none");
        inputField?.nextElementSibling.children[0].classList.add("d-none");
        setErrList([errors[i]]);
      } else {
        inputField?.classList.remove("invalid-input");
        inputField?.classList.add("valid-input");
        inputField?.nextElementSibling.children[0].classList.remove("d-none");
        inputField?.nextElementSibling.children[1].classList.add("d-none");
        setErrList([]);
      }
      if (inputField.value === "" && errorFlag) {
        console.log(errorFlag);
        setErrList([]);
      }
    } else {
      inputField?.classList.remove("invalid-input");
      inputField?.classList.add("valid-input");
      inputField?.nextElementSibling.children[0].classList.remove("d-none");
      inputField?.nextElementSibling.children[1].classList.add("d-none");
      setErrList([]);
    }
  }
  function getError(key) {
    for (const error of ErrList) {
      if (error.context.key === key) {
        return error.message;
      }
    }
    return "";
  }
  async function checkAPI(e) {
    e.preventDefault();
    if (ErrList.length !== 0) {
      setAPIRes("Invalid data");
      return;
    }
    setApiFlag(true);
    let result = await axios
      .post(`${baseURL}/auth/signup`, user)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setAPIRes(error?.response?.data?.message);
          setApiFlag(false);
        }
      });
    if (result?.data?.message === "done") {
      setApiFlag(false);
      setAPIRes(null);
      navigate("/login");
    }
  }

  const handlePassword = () => {
    if (!showPassword) {
      document.getElementById("password").type = "text";
      setShowPassword(true);
    } else {
      document.getElementById("password").type = "password";
      setShowPassword(false);
    }
  };
  return (
    <>
      <div className="sign-up-page">
        <section>
          {/* getting background */}
          {[...Array(260)].map((idx) => {
            return <span key={idx}></span>;
          })}

          <div className="signup mt-5">
            <div className="content">
              <h2>Sign Up</h2>

              <form onSubmit={checkAPI} className="form">
                {APIRes ? (
                  <div className="alert alert-danger"> {APIRes} </div>
                ) : (
                  ""
                )}
                <div className="d-flex">
                  <div className="inputBox me-2">
                    <input
                      autoComplete="off"
                      autoFocus
                      required
                      onChange={getUser}
                      typeof="text"
                      id="firstName"
                      className="input-field position-relative"
                    />{" "}
                    <div className="position-absolute check-mark d-none">
                      <i className="fa-solid fa-check"></i>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <i className="desc">First Name</i>
                    <p className="text-danger mb-2" id="firstName">
                      {getError("firstName")}
                    </p>
                  </div>

                  <div className="inputBox ms-2">
                    <input
                      autoComplete="off"
                      autoFocus
                      required
                      onChange={getUser}
                      typeof="text"
                      id="lastName"
                      className="input-field position-relative"
                    />{" "}
                    <div className="position-absolute check-mark d-none">
                      <i className="fa-solid fa-check"></i>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <i className="desc">Last Name</i>
                    <p className="text-danger mb-2" id="lastName">
                      {getError("lastName")}
                    </p>
                  </div>
                </div>

                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    type="email"
                    id="email"
                    className="input-field position-relative"
                  />{" "}
                  <div className="position-absolute check-mark d-none">
                    <i className="fa-solid fa-check"></i>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <i className="desc">Email</i>
                  <p className="text-danger mb-2" id="email">
                    {getError("email")}
                  </p>
                </div>

                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    id="userName"
                    type="text"
                    className="input-field position-relative"
                  />{" "}
                  <div className="position-absolute check-mark d-none">
                    <i className="fa-solid fa-check"></i>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <i className="desc">userName</i>
                  <p className="text-danger mb-2" id="userName">
                    {getError("userName")}
                  </p>
                </div>
                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    typeof="text"
                    id="phone"
                    className="input-field position-relative"
                  />{" "}
                  <div className="position-absolute check-mark d-none">
                    <i className="fa-solid fa-check"></i>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <i className="desc">Phone</i>
                  <p className="text-danger mb-2" id="phone">
                    {getError("phone")}
                  </p>
                </div>

                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    onChange={getUser}
                    type="date"
                    id="DOB"
                    className="input-field position-relative"
                  />{" "}
                  <i className="desc">Date of birth:</i>
                  <p className="text-danger mb-2" id="DOB">
                    {getError("DOB")}
                  </p>
                </div>

                <div className="inputBox">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    type="password"
                    id="password"
                    className="position-relative"
                  />
                  <div className="position-absolute check-mark d-none">
                    <i className="fa-solid fa-check"></i>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <span
                    className="show-password bg-transparent position-absolute"
                    onClick={handlePassword}
                  >
                    {!showPassword ? (
                      <i className="fa-regular fa-eye-slash"></i>
                    ) : (
                      ""
                    )}
                    {showPassword ? <i className="fa-regular fa-eye"></i> : ""}
                  </span>
                  <i className="desc">Password</i>
                  <p className="text-danger wrong-input mb-2 " id="email">
                    {getError("password")}
                  </p>
                </div>

                <div className="inputBox">
                  {apiFlag ? (
                    ""
                  ) : (
                    <button
                      className="sign-btn btn hover-50 text-white bg-violet w-100 py-2"
                      type="submit"
                    >
                      Sign Up
                    </button>
                  )}
                  <div className="links">
                    <Link className=" sign-up-btn mt-2 hover-50" to="/login">
                      Already have an account?
                    </Link>
                  </div>

                  {apiFlag ? (
                    <button className="btn btn-info w-100 d-flex justify-content-center align-items-center">
                      <div className="sk-chase">
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                      </div>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

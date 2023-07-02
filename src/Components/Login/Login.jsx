import React, { useState } from "react";
import Joi from "joi";
import $ from "jquery";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { baseURL } from "../../index.js";

export default function Login({ currentUser }) {
  let navigate = useNavigate();
  //Data
  const [apiFlag, setApiFlag] = useState(false);
  const [googleFlag, setGoogleFlag] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
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
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
        )
        .messages({
          "string.pattern.base": `Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character`,
        }),
    });
    let joiResponse = schema.validate(newUser, { abortEarly: false });
    let inputField = e.target;
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
    if(ErrList.length !== 0){
      setAPIRes('Invalid data')
      return;
    }
    setApiFlag(true);
    let result = await axios
      .post(`${baseURL}/auth/signin`, user)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setAPIRes(error?.response?.data?.message);
          setApiFlag(false);
        }
      });
    if (result?.data?.message === "done") {
      localStorage.setItem("token", result?.data.token);
      currentUser();
      setApiFlag(false);
      setAPIRes(null);
      navigate("/home");
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

  const googleSign = () => {
    window.location.replace(`${baseURL}/auth/google`);
  };

  return (
    <>
      <div className="sign-in-page">
        <section>
          {/* getting background */}
          {[...Array(260)].map((idx) => {
            return <span className="bg" key={idx}></span>;
          })}

          <div className="signin mt-5">
            <div className="content">
              <h2>Sign In</h2>

              <form onSubmit={checkAPI} className="form">
                {APIRes ? (
                  <div className="alert alert-danger"> {APIRes} </div>
                ) : (
                  ""
                )}
                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    typeof="text"
                    id="email"
                    className="position-relative"
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

                <div className="inputBox">
                  <input
                    className="position-relative"
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    type="password"
                    id="password"
                  />
                  <div className="position-absolute check-mark d-none">
                    <i className="fa-solid fa-check"></i>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <span
                    className="show-password bg-transparent position-absolute"
                    onClick={handlePassword}
                  >
                    {
                      !showPassword?
                      <i className="fa-regular fa-eye-slash"></i>
                      :
                      ''
                    }
                    {
                      showPassword?
                      <i className="fa-regular fa-eye"></i>
                      :
                      ''
                    }
                  </span>
                  <i className="desc">Password</i>
                  <p className="text-danger wrong-input mb-2 " id="password">
                    {getError("password")}
                  </p>
                </div>

                <div className="links">
                  <Link className="hover-50" to="/forgot">
                    Forgotten password?
                  </Link>
                  <Link className="sign-up-btn hover-50" to="/signup">
                    Signup
                  </Link>
                </div>

                <div className="inputBox">
                  {googleFlag || apiFlag ? (
                    ""
                  ) : (
                    <button
                      className="sign-btn btn hover-50 text-white bg-violet w-100 py-2"
                      type="submit"
                    >
                      Login
                    </button>
                  )}

                  {apiFlag || googleFlag ? (
                    ""
                  ) : (
                    <div
                      onClick={googleSign}
                      className="bg-google py-2 google-btn w-100 cursor-pointer d-flex justify-content-center align-items-center my-3"
                    >
                      <div className="google-icon-wrapper">
                        <img
                          className="google-icon"
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        />
                      </div>
                      <p className="hover-50 text-white m-0">
                        <b>Sign in with google</b>
                      </p>
                    </div>
                  )}

                  {apiFlag || googleFlag ? (
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

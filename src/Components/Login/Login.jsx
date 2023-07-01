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

  //Functions
  function getUser(e) {
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
      password: Joi.string().pattern(
        new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        )
      ).messages(),
    });
    let joiResponse = schema.validate(newUser, { abortEarly: true });
    if (joiResponse.error) {
      $(".saveData").attr("disabled", true);
      $(".saveData").addClass("button-disabled");
      let errors = joiResponse.error.details;
      setErrList(joiResponse.error.details);

      if (errors[0].context.label === e.target.id) {
        $(e.target).next().next().addClass("fa-xmark");
        $(e.target).next().next().removeClass("fa-check");
        $(e.target).addClass("checked-wrong");
        $(e.target).removeClass("checked-right");
      } else {
        $(e.target).next().next().addClass("fa-check");
        $(e.target).next().next().removeClass("fa-xmark");
        $(e.target).addClass("checked-right");
        $(e.target).removeClass("checked-wrong");
      }
    } else {
      $(".saveData").attr("disabled", false);
      $(".saveData").removeClass("button-disabled");
      $("input").next().next().addClass("fa-check");
      $("input").next().next().removeClass("fa-xmark");
      $("input").addClass("checked-right");
      $("input").removeClass("checked-wrong");
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
    setApiFlag(true);
    e.preventDefault();
    let result = await axios
      .post(`${baseURL}/auth/signin`, user)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
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

  const googleSign = async () => {
    
    // let result = await axios
    //   .get(`${baseURL}/auth/google/callback`, user)
    //   .catch(function (error) {
    //     if (error.response) {
    //       console.log(error.response)
    //       setAPIRes(error?.response?.data?.message);
    //       setGoogleFlag(false);
    //     }
    //   });
    // if (result?.data?.message == "done") {
    //   localStorage.setItem("token", result?.data.token);
    //   currentUser();    
    //   setGoogleFlag(false);
    //   setAPIRes(null);
    //   navigate("/home");
    // }
    window.location.replace(`${baseURL}/auth/google`);

  }

  return (
    <>
      {/* <div className="sign-up-page d-flex align-items-center">
        <div className="Signup d-flex align-align-items-center  mx-auto w-100">
          <div className="register-form w-50 mx-auto">
            <form onSubmit={checkAPI}>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 position-relative">
                    <div className="floating-label-group">
                      <input
                        autoComplete="off"
                        autoFocus
                        required
                        onChange={getUser}
                        typeof="text"
                        className="form-control"
                        id="email"
                      />{" "}
                      <label className="floating-label">Email</label>{" "}
                      <i className="fa-solid position-absolute"></i>{" "}
                      <p className="text-danger wrong-input mb-2" id="email">
                        {getError("email")}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 position-relative">
                    <div className="floating-label-group mt-3">
                      <input
                        autoComplete="off"
                        autoFocus
                        required
                        onChange={getUser}
                        type="password"
                        className="form-control"
                        id="password"
                      />{" "}
                      <label className="floating-label">Password</label>{" "}
                      <i className="fa-solid position-absolute"></i>{" "}
                      <p className="text-danger wrong-input mb-2" id="password">
                        {getError("password")}
                      </p>
                    </div>
                  </div>

                  <div className="position-relative col-md-12 mt-2">
                    {apiFlag ? (
                      <button
                        typeof="submit"
                        className="btn w-100 btn-info saveData btnMain"
                      >
                        {" "}
                        Waiting...{" "}
                      </button>
                    ) : (
                      <button
                        typeof="submit"
                        className="btn w-100 btn-info my-2 saveData btnMain"
                      >
                        {" "}
                        Log in{" "}
                      </button>
                    )}
                  </div>
                  {APIRes ? (
                    <div className="col-md-12">
                      <p className="text-danger"> {APIRes} </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}

      <div className="sign-in-page">
        <section>
          {/* getting background */}
          {[...Array(260)].map((idx) => { return <span key={idx}></span> })}

          <div className="signin mt-5">

            <div className="content">

              <h2>Sign In</h2>

              <form onSubmit={checkAPI} className="form">

                <div className="inputBox">

                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    typeof="text"
                    id="email"
                    className="input-field"
                  /> <i className="desc">Email</i>
                  <p className="text-danger mb-2" id="email">
                    {getError("email")}
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
                  /> <i className="desc">Password</i>
                  <p className="text-danger wrong-input mb-2" id="email">
                    {getError("password")}
                  </p>

                </div>

                <div className="links">
                  <Link className="hover-50" to="/forgot" >Forgot Password</Link>
                  <Link className="sign-up-btn hover-50" to="/signup">Signup</Link>

                </div>

                <div className="inputBox">

                  {googleFlag || apiFlag ? "" :
                    <input className="sign-btn hover-50 text-white" type="submit" value="Login" />
                  }


                  {apiFlag || googleFlag ? "" :
                    <div onClick={googleSign} className="google-btn w-100 cursor-pointer d-flex justify-content-center align-items-center my-3">
                      <div className="google-icon-wrapper">
                        <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                      </div>
                      <p className=" text-white m-0"><b>Sign in with google</b></p>

                    </div>
                  }

                  {apiFlag || googleFlag ? <button className="btn btn-info w-100 d-flex justify-content-center align-items-center">
                    <div className="sk-chase">
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                    </div></button> : ""}

                </div>

              </form>

            </div>

          </div>

        </section>
      </div>

    </>
  );
}

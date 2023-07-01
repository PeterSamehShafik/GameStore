import React, {  useState } from "react";
import Joi from "joi";
import $ from "jquery";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { baseURL } from "../../index.js";
import './SignUp.css'

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
      firstName: Joi.string().min(3).max(10).alphanum().required(),
      userName: Joi.string().min(3).max(10).alphanum(),
      DOB: Joi.date(),
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
        .messages({
          "string.pattern.base":
            "Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
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
      .post(`${baseURL}/auth/signup`, user)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setAPIRes(error.response.data.message);
          setApiFlag(false);
        }
      });
    if (result?.data?.message === "done") {
      //console.log(data.token);
      setApiFlag(false);
      setAPIRes(null);
      navigate("/login");
    }
  }

  return (
    // <>
    //   <div className="sign-up-page d-flex align-items-center">
    //     <div className="Signup d-flex align-align-items-center  mx-auto w-100">
    //       <div className="register-form w-50 mx-auto">
    //         <form onSubmit={checkAPI}>
    //           <div className="container">
    //             <div className="row">
    //               <div className="col-md-6 position-relative">
    //                 <div className="floating-label-group">
    //                   <input
    //                     autoComplete="off"
    //                     autoFocus
    //                     onChange={getUser}
    //                     typeof="text"
    //                     className="form-control"
    //                     id="userName"
    //                   />
    //                   <label className="floating-label">Username</label>
    //                   <i className="fa-solid position-absolute"></i>
    //                   <p className="text-danger wrong-input mb-2" id="userName">
    //                     {/* //{getError("userName")}{" "} */}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="col-md-6 position-relative">
    //                 <div className="floating-label-group">
    //                   <input
    //                     autoComplete="off"
    //                     autoFocus
    //                     required
    //                     onChange={getUser}
    //                     typeof="text"
    //                     className="form-control"
    //                     id="firstName"
    //                   />
    //                   <label className="floating-label">First Name</label>
    //                   <i className="fa-solid position-absolute"></i>
    //                   <p
    //                     className="text-danger wrong-input mb-2"
    //                     id="firstName"
    //                   >
    //                     {getError("firstName")}{" "}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="col-md-6 position-relative">
    //                 <div className="floating-label-group mt-3">
    //                   <input
    //                     autoComplete="off"
    //                     autoFocus
    //                     required
    //                     onChange={getUser}
    //                     typeof="text"
    //                     className="form-control"
    //                     id="lastName"
    //                   />{" "}
    //                   <label className="floating-label">Last Name</label>{" "}
    //                   <i className="fa-solid position-absolute"></i>{" "}
    //                   <p className="text-danger wrong-input mb-2" id="lastName">
    //                     {getError("lastName")}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="col-md-12 position-relative">
    //                 <div className="floating-label-group mt-3">
    //                   <input
    //                     autoComplete="off"
    //                     autoFocus
    //                     required
    //                     onChange={getUser}
    //                     typeof="text"
    //                     className="form-control"
    //                     id="email"
    //                   />{" "}
    //                   <label className="floating-label">Email</label>{" "}
    //                   <i className="fa-solid position-absolute"></i>{" "}
    //                   <p className="text-danger wrong-input mb-2" id="email">
    //                     {getError("email")}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="col-md-12 position-relative">
    //                 <div className="floating-label-group mt-3">
    //                   <input
    //                     autoComplete="off"
    //                     autoFocus
    //                     onChange={getUser}
    //                     type="date"
    //                     typeof="date"
    //                     className="form-control"
    //                     id="DOB"
    //                   />
    //                   <label className="floating-label">Date of birth</label>{" "}
    //                   <i className="fa-solid position-absolute"></i>{" "}
    //                   <p className="text-danger wrong-input mb-2" id="DOB">
    //                     {getError("DOB")}
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="col-md-12 position-relative">
    //                 <div className="floating-label-group mt-3">
    //                   <input
    //                     autoComplete="off"
    //                     autoFocus
    //                     required
    //                     onChange={getUser}
    //                     typeof="password"
    //                     className="form-control"
    //                     id="password"
    //                   />{" "}
    //                   <label className="floating-label">Password</label>{" "}
    //                   <i className="fa-solid position-absolute"></i>{" "}
    //                   <label className="floating-label">Password</label>{" "}
    //                   <p className="text-danger wrong-input mb-2" id="password">
    //                     {getError("password")}
    //                   </p>
    //                 </div>
    //               </div>

    //               <div className="position-relative col-md-12">
    //                 {apiFlag ? (
    //                   <button
    //                     typeof="submit"
    //                     className="btn w-100 btn-info my-3 saveData btnMain"
    //                   >
    //                     {" "}
    //                     Waiting...{" "}
    //                   </button>
    //                 ) : (
    //                   <button
    //                     typeof="submit"
    //                     className="btn w-100 btn-info my-2 saveData btnMain"
    //                   >
    //                     {" "}
    //                     Sign Up{" "}
    //                   </button>
    //                 )}
    //               </div>
    //               {APIRes ? (
    //                 <div className="col-md-12">
    //                   <p className="text-danger"> {APIRes} </p>
    //                 </div>
    //               ) : (
    //                 ""
    //               )}
    //             </div>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
      <div className="sign-up-page">
        <section>
          {/* getting background */}
          {[...Array(260)].map((idx) => {
            return <span key={idx}></span>;
          })}

          <div className="signup">
            <div className="content">
              <h2>Sign Up</h2>

              <form onSubmit={checkAPI} className="form">
                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    typeof="text"
                    id="firstName"
                    className="input-field"
                  />{" "}
                  <i className="desc">First Name</i>
                  <p className="text-danger mb-2" id="firstName">
                    {getError("firstName")}
                  </p>
                </div>
                
                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    typeof="text"
                    id="lastName"
                    className="input-field"
                  />{" "}
                  <i className="desc">Last Name</i>
                  <p className="text-danger mb-2" id="lastName">
                    {getError("lastName")}
                  </p>
                </div>

                <div className="inputBox ">
                  <input
                    autoComplete="off"
                    autoFocus
                    required
                    onChange={getUser}
                    typeof="text"
                    id="userName"
                    className="input-field"
                  />{" "}
                  <i className="desc">Username</i>
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
                    id="email"
                    className="input-field"
                  />{" "}
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
                    typeof="text"
                    id="email"
                    className="input-field"
                  />{" "}
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
                    typeof="date"
                    id="DOB"
                    className="input-field"
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
                  />
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
                      className="sign-btn hover-50 text-white bg-violet w-100 py-2"
                      type="submit"
                    >
                      Login
                    </button>
                  )}


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

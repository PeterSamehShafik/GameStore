import React, { useState } from 'react'
import "./../Login/Login.css"
import { baseURL } from "../../index.js";
import Joi from "joi";
import $ from "jquery";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css'

export default function ForgotPassword() {
    const [user, setUser] = useState({});
    const [ErrList, setErrList] = useState([]);
    const [apiFlag, setApiFlag] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [alreadyCode, setAlreadyCode] = useState(false);

    const navigate = useNavigate()

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
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
            newPassword: Joi.string().pattern(
                new RegExp(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
                )
            ).messages({ "string.pattern.base": `Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character` }),
            code: Joi.string()
        });
        let joiResponse = schema.validate(newUser, { abortEarly: true });
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

                setErrList([errors[i]]);
            } else {
                inputField?.classList.remove("invalid-input");
                inputField?.classList.add("valid-input");
                setErrList([]);
            }
            if (inputField.value === "" && errorFlag) {
                setErrList([]);
            }
        } else {
            inputField?.classList.remove("invalid-input");
            inputField?.classList.add("valid-input");
            setErrList([]);
        }
    }
    function getError(key) {
        for (const error of ErrList) {
            if (error.context.key == key) {
                return error.message;
            }
        }
        return "";
    }

    const sendCode = async (e) => {
        e.preventDefault()
        setApiFlag(true);
        let result = await axios
            .post(`${baseURL}/auth/sendcode`, user)
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response)
                    setApiFlag(false);
                    setAlreadyCode(false)
                    setBackendError(error.response.data.message)
                }
            });
        if (result?.data?.message == "done") {
            setApiFlag(false);
            setIsSent(true)
            setAlreadyCode(false)
            setBackendError(null)
        }
    }
    const recoverPassword = async (e) => {
        e.preventDefault()
        setApiFlag(true);
        let result = await axios
            .post(`${baseURL}/auth/password/recover`, user)
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response)
                    setApiFlag(false);
                    setBackendError(error.response.data.message)
                }
            });
        if (result?.data?.message == "done") {
            setApiFlag(false);
            setBackendError(null)
            navigate('/login')
        }
    }

    const alreadyHaveCode = (isHave) => {
        if (isHave) {
            setAlreadyCode(true)
            setIsSent(true)
            setBackendError(null)
            setUser({});

        } else {
            setAlreadyCode(false)
            setIsSent(false)
            setBackendError(null)
            setUser({});
        }
    }
    return (
        <div className="forgot-password">
            <div className="sign-in-page">
                <section>
                    {/* getting background */}
                    {[...Array(260)].map((idx) => { return <span key={idx}></span> })}

                    <div className="signin mt-5">

                        <div className="content">
                            {isSent ?
                                <>
                                    <h2>Write the code</h2>

                                    <form onSubmit={recoverPassword} className="form">

                                        {alreadyCode ? <div className="inputBox">

                                            <input
                                                autoComplete="off"
                                                autoFocus
                                                required
                                                onChange={getUser}
                                                typeof="text"
                                                id="email"
                                                className="input-field position-relative"
                                                defaultValue=""
                                            />
                                            <div className="position-absolute check-mark d-none">
                                                <i className="fa-solid fa-check"></i>
                                                <i className="fa-solid fa-xmark"></i>
                                            </div>
                                            <i className="desc">email</i>
                                            <p className="text-danger wrong-input mb-2 " id="email">
                                                {getError("email")}
                                            </p>
                                        </div> : ""}

                                        <div className="inputBox">

                                            <input
                                                autoComplete="off"
                                                autoFocus
                                                required
                                                onChange={getUser}
                                                typeof="text"
                                                id="code"
                                                className="input-field"
                                                defaultValue=""
                                            /> <i className="desc">Code</i>
                                        </div>
                                        <div className="inputBox">

                                            <input
                                                autoComplete="off"
                                                autoFocus
                                                required
                                                onChange={getUser}
                                                type="text"
                                                id="newPassword"
                                            />
                                            <div className="position-absolute check-mark d-none">

                                            </div>
                                            <i className="desc">New Password</i>
                                            <p className="text-danger wrong-input mb-2" id="email">
                                                {getError("newPassword")}
                                            </p>

                                        </div>
                                        <button typeof="submit" className="btn w-100 btn-info sendCode btnMain d-flex justify-content-center">
                                            {apiFlag ? <div className="sk-chase">
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                            </div> : "Change Password"}
                                        </button>
                                        {backendError ? <div className="alert alert-danger">{backendError}</div> : ""}
                                        <div className="links">
                                            <Link to="/login" >Sign in</Link>
                                            <p onClick={() => { alreadyHaveCode(false) }} className="sign-up-btn hover-50 cursor-pointer" >I don't have a code</p>

                                        </div>

                                    </form>
                                </>
                                :
                                <>
                                    <h2>Forgot Password</h2>

                                    <form onSubmit={sendCode} className="form">

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
                                        <button typeof="submit" className="btn w-100 btn-info sendCode btnMain d-flex justify-content-center">
                                            {apiFlag ? <div className="sk-chase">
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                                <div className="sk-chase-dot"></div>
                                            </div> : "Send Code"}
                                        </button>
                                        {backendError ? <div className="alert alert-danger">{backendError}</div> : ""}
                                        <div className="links">
                                            <Link to="/login" >Sign in</Link>
                                            <p onClick={() => { alreadyHaveCode(true) }} className="sign-up-btn hover-50 cursor-pointer" >I have a code</p>
                                        </div>

                                    </form>
                                </>}




                        </div>

                    </div>

                </section>
            </div >
        </div >
    )
}

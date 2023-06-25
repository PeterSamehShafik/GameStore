import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { baseURL, BEARERKEY, roles } from "./../index.js";
import "./CPanel.css"
//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import jwtDecode from "jwt-decode";



export default function CPanel({ removeUser }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [profile, setProfile] = useState("Loading");
    const [pathName, setPathname] = useState(null)

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

    const getProfile = async () => {
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            },
        };
        const result = await axios
            .get(`${baseURL}/user/profile`, config)
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response);
                    setProfile(null);
                }
            });
        if (result?.data?.message == "done") {
            if (result.data.user.role == roles.admin || result.data.user.role == roles.superAdmin) {
                setProfile(result.data.user);
                if (result.data.user.role == roles.admin && location.pathname.includes("user")) {
                    setPathname("/cpanel")
                } else{
                    setPathname(location.pathname)
                }
            } else {
                navigate("/home")
            }
        } else {
            callModal({ header: "Error", body: "Something went wrong.", isMainBtn: "false", closeBtnTxt: "OK" })
            navigate("/login")
        }
    };

    const toggleSideBar = () => {
        const sideBarMenu = document.getElementById("sideBarMenu")
        const currWidth = sideBarMenu.offsetWidth
        if (currWidth > '80') {
            sideBarMenu.style.width = "4rem"
            const contents = document.querySelectorAll(".barContent")
            for (let i = 0; i < contents.length; i++) {
                contents[i].classList.add("d-none")
            }
        } else {
            sideBarMenu.style.width = "12.6rem"
            const contents = document.querySelectorAll(".barContent")
            for (let i = 0; i < contents.length; i++) {
                contents[i].classList.remove("d-none")
            }
        }
    }
    useEffect(() => {
        getProfile();
    }, []);


    return <>

        {profile === "Loading" ?
            <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-absolute top-0">
                <div className="sk-chase">
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                </div>
            </div>
            :
            profile == null ?
                <div className="m-auto d-flex flex-column align-items-center mt-5">
                    <img src="/error.png" className="img-fluid w-25" alt="" srcset="" />
                    <p className="fs-1 mx-auto">Something went wrong....</p>
                    <p className="fs-1 mx-auto">Please try again</p>
                </div>
                :
                <>
                    <div className="container-fluid CPanel">
                        <div className="row flex-nowrap">
                            <div id="sideBarMenu" className="col-auto col-md-3 col-xl-2 px-0 bg-dark c-panel-menu">
                                <div className=" d-flex flex-column justify-content-center align-items-center align-items-sm-start px-0 pt-2 text-white min-vh-100">
                                    <div className="barContent dropdown-center mt-3 pb-1 mx-auto p-3 pt-0">
                                        <span className="cursor-pointer d-flex flex-column align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false" >
                                            <img src={profile.profilePic.secure_url} alt="profPic" style={{ "width": "5rem" }} className="img-fluid rounded-circle border border-success border-3" />
                                            <div className="name d-flex cursor-pointer h4 mb-0 mt-1">
                                                <span className="d-none d-sm-inline mx-1">{profile.firstName} {profile.lastName}</span>
                                                <i className="fa-solid fa-circle-chevron-down"></i>
                                            </div>
                                            <span className="text-muted">{profile.userName}</span>

                                        </span>
                                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">

                                            <li><Link to="/profile/info" className="dropdown-item">Profile</Link></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li><span onClick={removeUser} className="dropdown-item cursor-pointer">Sign out</span></li>
                                        </ul>
                                    </div>
                                    <hr className="barContent text-white bg-white m-0 mb-3 w-75 mx-auto" />
                                    <ul className="nav barContent nav-pills w-100 flex-column  align-items-center align-items-sm-start" id="menu">

                                        <li className={pathName.toLowerCase() === "/cpanel" || pathName.toLowerCase() === "/cpanel/" ?
                                            "nav-item active current-active" : "nav-item"}>
                                            <Link to="/cpanel" onClick={() => setPathname("/cpanel")} className="nav-link  align-middle px-0 d-flex justify-content-between">
                                                <span className="ms-1 ">Home</span>
                                                <i className="fa-solid d-none d-sm-inline fa-gauge-high text-white opacity-75"></i>
                                            </Link>
                                        </li>
                                        <li className={pathName.toLowerCase().includes("users") || pathName.toLowerCase().includes("genres") || pathName.toLowerCase().includes("games") ?
                                            "nav-item active current-active" : "nav-item"}>
                                            <a href="#submenu1" data-bs-toggle="collapse" className="nav-link d-flex justify-content-between px-0 align-middle">
                                                <span className="ms-1 ">Dashboard</span>
                                                <i className="d-none d-sm-inline fa-solid fa-table-columns text-white opacity-75"></i>
                                            </a>
                                            <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                                                {profile.role === roles.superAdmin ?
                                                    <li className="w-100">
                                                        <Link to="users" onClick={() => setPathname("/cpanel/users")}
                                                            className={pathName.toLowerCase().includes("users") ? "nav-link d-flex justify-content-between px-0 current-active" : "nav-link d-flex justify-content-between px-0 "}>
                                                            <span className="ms-2">Users</span>
                                                            <i className="d-none d-sm-inline fa-solid fa-triangle-exclamation text-white opacity-75"></i>

                                                        </Link>
                                                    </li> : ""}
                                                <li className="w-100">
                                                    <Link to="games" onClick={() => setPathname("/cpanel/games")}
                                                        className={pathName.toLowerCase().includes("games") ? "nav-link d-flex justify-content-between px-0 current-active" : "nav-link d-flex justify-content-between px-0 "}>
                                                        <span className="ms-2 ">Games</span>
                                                        <i className="d-none d-sm-inline fa-solid fa-gamepad text-white opacity-75"></i>

                                                    </Link>
                                                </li>
                                                <li className="w-100">
                                                    <Link to="genres" onClick={() => setPathname("/cpanel/genres")}
                                                        className={pathName.toLowerCase().includes("genres") ? "nav-link d-flex justify-content-between px-0 current-active" : "nav-link d-flex justify-content-between px-0 "}>
                                                        <span className="ms-2 ">Genres</span>
                                                        <i className="d-none d-sm-inline fa-solid fa-earth-europe text-white opacity-75"></i>

                                                    </Link>
                                                </li>

                                            </ul>
                                        </li>
                                        <li className="nav-item ">
                                            <a className="nav-link d-flex justify-content-between w-100 px-0 align-middle">
                                                <span className="ms-1">Test</span>
                                                <i className="fa-solid d-none d-sm-inline fa-gauge-high text-white opacity-75"></i>
                                            </a>
                                        </li>
                                        <li className="nav-item ">
                                            <a href="#submenu2" data-bs-toggle="collapse" className="nav-link d-flex justify-content-between px-0 align-middle">
                                                <span className="ms-1 ">Navigate</span>
                                                <i className="d-none d-sm-inline fa-regular fa-compass"></i>
                                            </a>
                                            <ul className="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                                                <li className="w-100">
                                                    <Link to="/" className="nav-link d-flex justify-content-between px-0">
                                                        <span className="ms-2">Start Screen</span>
                                                        <i className="d-none d-sm-inline fa-solid fa-hourglass-start text-white opacity-75"></i>
                                                    </Link>
                                                </li>
                                                <li className="w-100">
                                                    <Link to="/home" className="nav-link d-flex justify-content-between px-0">
                                                        <span className="ms-2">Home Page</span>
                                                        <i className="d-none d-sm-inline fa-solid fa-house text-white opacity-75"></i>
                                                    </Link>
                                                </li>
                                                <li className="w-100">
                                                    <Link to="/profile/info" className="nav-link d-flex justify-content-between px-0">
                                                        <span className="ms-2">Profile</span>
                                                        <i className="d-none d-sm-inline fa-solid fa-user text-white opacity-75"></i>
                                                    </Link>
                                                </li>

                                            </ul>
                                        </li>
                                        <hr className="text-white bg-white m-0 mb-3 w-100 d-none d-sm-inline " />
                                    </ul>
                                    <span className="nav-item  ">
                                        <a onClick={toggleSideBar} className="nav-link w-100 d-flex justify-content-between px-0 align-middle">
                                            <span className="barContent  ms-1">Collapse</span>
                                            <div className="coll">
                                                <div className="coll-show bg-white opacity-75"></div>
                                                <div className="coll-show bg-white opacity-75"></div>
                                                <div className="coll-show bg-white opacity-75"></div>
                                            </div>
                                        </a>
                                    </span>
                                    <hr />

                                </div>
                            </div>
                            <div className="col px-0 pb-3 bg-beige w-100">
                                <header className='w-100 bg-primary p-2 d-flex align-items-center mb-0'>
                                    <Link to="/home">
                                        <i className="fa-solid fa-gamepad me-3 text-info fa-xl " ></i>
                                        <span className="fw-bolder text-white h5 mb-0">Game Store</span>
                                    </Link>
                                </header>
                                <section className='bg-beige ps-3 mb-4 p-4 shadow '>
                                    <div className="d-flex align-items-center">
                                        <span className="btn disabled button-53" >Control Panel</span>
                                        {pathName.toLowerCase() === "/cpanel" || pathName.toLowerCase() === "/cpanel/" ? "" :
                                            <>
                                                <i className="fa-2xl mx-2 opacity-50 right-arrow"></i>

                                                <span className="btn disabled button-53 text-capitalize" > {pathName.toLowerCase().split("/cpanel/")}</span></>
                                        }

                                    </div>
                                    <h1 className='fw-bolder h3 mt-3 opacity-75'>Control Panel</h1>

                                    <p className='text-muted opacity-75 fw-bolder h5 '>Hi {profile.firstName}, Welcome to GameStore Control Panel.</p>
                                </section>
                                <Outlet context={[profile, setProfile, pathName, setPathname]} />

                            </div>
                        </div>
                    </div>
                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        className="text-white"
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
                            {modalData.isMainBtn == true ? (
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
                </>
        }



    </>
}

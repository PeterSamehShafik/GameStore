import React, { useState } from 'react'
import "./NotFound.css"
import $ from "jquery";
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function NotFound({ error, resetErrorBoundary }) {

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
        isCloseBtn = true,
        isStatic = false
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
            isCloseBtn,
            isStatic
        });
        handleShowModal();
    };
    const applyCloseModel = () => {
        modalData.mainBtnFunc();
        handleCloseModal();
    };
    //end of modal

    const navigateToHome  = () => {
        window.location.href = "https://gamestore-379019.web.app/";
    }
    const pauseScreen = () => {
        $('.glitch-wrapper').toggleClass('paused');
        $('.not-found').toggleClass('paused');
    }
    const sendEmail = (e) => {
        e.preventDefault()
        callModal({
            header: "Loading",
            body: "Please wait....",
            isMainBtn: false,
            isCloseBtn: false,
            isStatic: true,
          });
        //   e = new Error(error)
  
        emailjs.send('service_721mdfl', 'template_x4hurtm', {
            subject: `GameStore Error Report`,
            user_name: `None`,
            user_email: `None`,
            message: `${error.stack}`,
        }, 'VzoIZXhoU3k2oltf9')
            .then((result) => {
                navigateToHome()
            }, (error) => {
                console.log(error)
                handleCloseModal()
                callModal({
                    header: "Error",
                    body: "Something went wrong, please try again",
                    isMainBtn: false,
                    closeBtnTxt: "OK",
                });
            });
    
    }
    return <div className="not-found position-absolute top-0">
        <div className="glitch-wrapper">
            <div className="glitch-text">
                {
                    error?
                    `Oops! Something went wrong!
                        Help us improve your experience by sending an error report`
                    :
                    "ERROR 404: Not found"
                }
            </div>
        </div>
        <div className="w-100 d-flex justify-content-center">
            {
                error?
                <>
                    <button id='homeBtn' className="ms-auto me-2 button-49" onMouseLeave={pauseScreen} onMouseEnter={pauseScreen} role="button" onClick={sendEmail}>Send Report</button>
                    <button id='homeBtn' className="mx-auto button-49" onMouseLeave={pauseScreen} onMouseEnter={pauseScreen} role="button" onClick={navigateToHome}>Back Home</button>
                </>
                :
                <Link to="/">
                    <button id='homeBtn' className="mx-auto button-49" onMouseLeave={pauseScreen} onMouseEnter={pauseScreen} role="button">Back Home</button>
                </Link>

            }
        </div>
        <Modal
                show={showModal}
                onHide={handleCloseModal}
                className="text-white"
                backdrop={modalData.isStatic ? "static" : true}
                keyboard={modalData.isStatic ? false : true}
            >
                {modalData.isStatic ?
                    <Modal.Header >
                        <Modal.Title>{modalData.header}</Modal.Title>
                    </Modal.Header> :
                    <Modal.Header closeButton>
                        <Modal.Title>{modalData.header}</Modal.Title>
                    </Modal.Header>}

                <Modal.Body>{modalData.body}</Modal.Body>
                <Modal.Footer>
                    {modalData.isCloseBtn == true ?
                        <Button
                            variant={modalData.closeBtnColor}
                            onClick={handleCloseModal}
                        >
                            {modalData.closeBtnTxt}
                        </Button> : ""}
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

    </div>
}
